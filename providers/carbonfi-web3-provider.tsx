"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { ethers, type BrowserProvider, type JsonRpcSigner, type Eip1193Provider } from "ethers"

/**
 * CarbonFi Wallet — Ethereum Mainnet web3 provider (REAL, not mock).
 * Supports:
 *  - External injected wallets (MetaMask / Rabby / WalletConnect) via EIP-1193 window.ethereum
 *  - Self-custody EOA from a private key (imported locally, never persisted)
 *
 * Only Ethereum Mainnet (chainId 0x1) is supported.
 */

export interface Web3Request {
  id: string
  method: string
  params: any[]
  origin: string
  timestamp: number
}

export interface WalletInfo {
  type: "smart" | "self-custody"
  address: string
  balance: string
  network: string
  connectedVia: "injected" | "private-key"
}

export interface CarbonFiWeb3ContextType {
  // Connection state
  isConnected: boolean
  accounts: string[]
  chainId: string
  balance: string
  provider: BrowserProvider | null
  signer: JsonRpcSigner | ethers.Wallet | null

  // Pending requests
  pendingRequests: Web3Request[]

  // Actions
  connectInjected: () => Promise<void>
  connectPrivateKey: (privateKey: string) => Promise<void>
  connectSmartWallet: (identifier: string, name?: string) => Promise<void>
  connect: () => Promise<void>
  disconnect: () => void
  sendTransaction: (to: string, value: string, data?: string) => Promise<string>
  sendERC20: (tokenAddress: string, to: string, amount: string, decimals: number) => Promise<string>
  signMessage: (message: string) => Promise<string>
  approveRequest: (requestId: string) => Promise<void>
  rejectRequest: (requestId: string) => void
  refreshBalance: () => Promise<void>

  // dApp connection
  connectedDApp: string | null
  setConnectedDApp: (dapp: string | null) => void
}

export const CarbonFiWeb3Context = createContext<CarbonFiWeb3ContextType | undefined>(undefined)

const RPC_URLS = [
  process.env.NEXT_PUBLIC_ETH_RPC_URL,
  "https://ethereum.publicnode.com",
  "https://eth.drpc.org",
  "https://rpc.ankr.com/eth",
  "https://eth.llamarpc.com",
  "https://1rpc.io/eth",
].filter((url): url is string => typeof url === "string" && url.length > 0)

async function createEthProvider() {
  let lastError: unknown = null
  for (const url of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url)
      await provider.getBlockNumber()
      return provider
    } catch (e) {
      lastError = e
    }
  }
  throw lastError ?? new Error("No working Ethereum RPC available")
}

// Ethereum Mainnet only
const ETHEREUM_MAINNET = {
  chainId: "0x1",
  chainName: "Ethereum Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: RPC_URLS,
  blockExplorerUrls: ["https://etherscan.io/"],
}

const isEthereumMainnet = (chainId: string) => chainId === "0x1"

interface WindowWithEthereum extends Window {
  ethereum?: Eip1193Provider & {
    isMetaMask?: boolean
    request: (args: { method: string; params?: any[] }) => Promise<any>
    on?: (event: string, handler: (...args: any[]) => void) => void
    removeListener?: (event: string, handler: (...args: any[]) => void) => void
    selectedAddress?: string | null
  }
}

export function CarbonFiWeb3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [accounts, setAccounts] = useState<string[]>([])
  const [chainId, setChainId] = useState("0x1")
  const [balance, setBalance] = useState("0")
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | ethers.Wallet | null>(null)
  const [pendingRequests, setPendingRequests] = useState<Web3Request[]>([])
  const [connectedDApp, setConnectedDApp] = useState<string | null>(null)
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)

  const win = typeof window !== "undefined" ? (window as WindowWithEthereum) : undefined

  // Track account / chain changes from external wallets
  useEffect(() => {
    if (!win?.ethereum?.on) return

    const handleAccountsChanged = (accs: string[]) => {
      if (accs.length === 0) {
        disconnect()
      } else {
        setAccounts(accs)
        refreshBalance()
      }
    }
    const handleChainChanged = (chain: any) => {
      const hex = typeof chain === "string" ? chain : (chain as any)?.toString?.(16)
      if (isEthereumMainnet(hex)) {
        setChainId("0x1")
        refreshBalance()
      } else {
        // Force switch back to Ethereum Mainnet
        win.ethereum?.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x1" }] })
      }
    }

    win.ethereum.on("accountsChanged", handleAccountsChanged)
    win.ethereum.on("chainChanged", handleChainChanged)
    return () => {
      win.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged)
      win.ethereum?.removeListener?.("chainChanged", handleChainChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win?.ethereum])

  const getEthersProvider = useCallback((): BrowserProvider => {
    if (!win?.ethereum) {
      throw new Error("No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.")
    }
    return new ethers.BrowserProvider(win.ethereum)
  }, [win?.ethereum])

  const connectInjected = useCallback(async () => {
    try {
      if (!win?.ethereum) {
        throw new Error("No injected Ethereum wallet found. Install MetaMask or use WalletConnect.")
      }
      // Request account access (REAL EIP-1193)
      const eth = win.ethereum
      const accs: string[] = await eth.request({ method: "eth_requestAccounts" })
      const web3Provider = getEthersProvider()

      // Ensure we are on Ethereum Mainnet
      const network = await web3Provider.getNetwork()
      if (network.chainId.toString() !== "1") {
        await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x1" }] })
      }

      const signer = await web3Provider.getSigner()
      const addr = (accs[0] ?? signer.address).toLowerCase()
      setAccounts([addr])
      setChainId("0x1")
      setProvider(web3Provider)
      setSigner(signer)
      setIsConnected(true)
      setWalletInfo({
        type: "smart",
        address: addr,
        balance: "",
        network: "Ethereum Mainnet",
        connectedVia: "injected",
      })
      refreshBalance()
    } catch (error) {
      console.error("Injected wallet connection failed:", error)
      throw error
    }
  }, [win?.ethereum, getEthersProvider])

  const connectPrivateKey = useCallback(async (privateKey: string) => {
    try {
      const key = privateKey.trim()
      if (!key.startsWith("0x")) {
        throw new Error("Private key must start with 0x")
      }
      const wallet = new ethers.Wallet(key)
      const addr = wallet.address.toLowerCase()
      const rpcProvider = await createEthProvider()
      const signer = wallet.connect(rpcProvider)

      setAccounts([addr])
      setChainId("0x1")
      setProvider(null) // no injected provider for private key mode
      setSigner(signer)
      setIsConnected(true)
      setWalletInfo({
        type: "self-custody",
        address: addr,
        balance: "",
        network: "Ethereum Mainnet",
        connectedVia: "private-key",
      })
      refreshBalance()
    } catch (error) {
      console.error("Private key connection failed:", error)
      throw error
    }
  }, [])

  const connectSmartWallet = useCallback(async (identifier: string, name?: string) => {
    try {
      // Deterministically derive a private key from the Google user identifier (sub/email).
      // This gives the same Ethereum address every time for the same Google account.
      const keyBytes = new TextEncoder().encode("carbonfi:smart-wallet:" + identifier)
      const digest = await crypto.subtle.digest("SHA-256", keyBytes)
      const hex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      const privateKey = "0x" + hex
      const wallet = new ethers.Wallet(privateKey)
      const addr = wallet.address.toLowerCase()
      const rpcProvider = await createEthProvider()
      const signer = wallet.connect(rpcProvider)

      setAccounts([addr])
      setChainId("0x1")
      setProvider(null)
      setSigner(signer)
      setIsConnected(true)
      setWalletInfo({
        type: "smart",
        address: addr,
        balance: "",
        network: "Ethereum Mainnet",
        connectedVia: "injected",
      })
      refreshBalance()
    } catch (error) {
      console.error("Smart wallet connection failed:", error)
      throw error
    }
  }, [])

  const connect = useCallback(async () => {
    // Try injected wallet first
    if (win?.ethereum) {
      try {
        await connectInjected()
        return
      } catch (e) {
        console.warn("Injected connect failed, falling back to private key:", e)
      }
    }
    // Fallback: open private key modal (handled by UI)
    throw new Error("require-private-key")
  }, [win?.ethereum, connectInjected])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAccounts([])
    setBalance("0")
    setProvider(null)
    setSigner(null)
    setConnectedDApp(null)
    setWalletInfo(null)
  }, [])

  const refreshBalance = useCallback(async () => {
    try {
      if (accounts[0] && signer?.provider) {
        const bal = await signer.provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(bal))
      } else if (accounts[0] && provider) {
        const bal = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(bal))
      }
    } catch (error) {
      console.error("Balance refresh failed:", error)
    }
  }, [accounts, signer, provider])

  const sendTransaction = useCallback(
    async (to: string, value: string, data?: string): Promise<string> => {
      if (!signer) throw new Error("Wallet not connected")
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(value),
        data: data || "0x",
      })
      return tx.hash
    },
    [signer],
  )

  const sendERC20 = useCallback(
    async (tokenAddress: string, to: string, amount: string, decimals: number): Promise<string> => {
      if (!signer) throw new Error("Wallet not connected")
      const erc20Abi = [
        "function transfer(address to, uint256 amount) returns (bool)",
        "function balanceOf(address owner) view returns (uint256)",
      ]
      const contract = new ethers.Contract(tokenAddress, erc20Abi, signer)
      const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals))
      return tx.hash
    },
    [signer],
  )

  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!signer) throw new Error("Wallet not connected")
      return await signer.signMessage(message)
    },
    [signer],
  )

  const approveRequest = useCallback(
    async (requestId: string) => {
      const request = pendingRequests.find((r) => r.id === requestId)
      if (request) {
        setPendingRequests((prev) => prev.filter((r) => r.id !== requestId))
      }
    },
    [pendingRequests],
  )

  const rejectRequest = useCallback((requestId: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId))
  }, [])

  const value: CarbonFiWeb3ContextType = {
    isConnected,
    accounts,
    chainId,
    balance,
    provider,
    signer,
    pendingRequests,
    connect,
    connectInjected,
    connectPrivateKey,
    connectSmartWallet,
    disconnect,
    sendTransaction,
    sendERC20,
    signMessage,
    approveRequest,
    rejectRequest,
    refreshBalance,
    connectedDApp,
    setConnectedDApp,
  }

  return <CarbonFiWeb3Context.Provider value={value}>{children}</CarbonFiWeb3Context.Provider>
}

export const useCarbonFiWeb3 = () => {
  const context = useContext(CarbonFiWeb3Context)
  if (context === undefined) {
    throw new Error("useCarbonFiWeb3 must be used within a CarbonFiWeb3Provider")
  }
  return context
}

export { ETHEREUM_MAINNET }
