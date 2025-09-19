"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface Web3Request {
  id: string
  method: string
  params: any[]
  origin: string
  timestamp: number
}

export interface CarbonFiWeb3ContextType {
  // Connection state
  isConnected: boolean
  accounts: string[]
  chainId: string
  balance: string

  // Pending requests
  pendingRequests: Web3Request[]

  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: string) => Promise<void>
  sendTransaction: (transaction: any) => Promise<string>
  signMessage: (message: string) => Promise<string>
  approveRequest: (requestId: string) => Promise<void>
  rejectRequest: (requestId: string) => void
  refreshBalance: () => Promise<void>

  // dApp connection
  connectedDApp: string | null
  setConnectedDApp: (dapp: string | null) => void
}

const CarbonFiWeb3Context = createContext<CarbonFiWeb3ContextType | undefined>(undefined)

const SUPPORTED_CHAINS = {
  "0x1": {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io/"],
  },
  "0xa4b1": {
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
  },
  "0x2105": {
    chainId: "0x2105",
    chainName: "Base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org/"],
  },
  "0x89": {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  "0x38": {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed1.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
  },
}

export function CarbonFiWeb3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [accounts, setAccounts] = useState<string[]>([])
  const [chainId, setChainId] = useState("0x1")
  const [balance, setBalance] = useState("0")
  const [pendingRequests, setPendingRequests] = useState<Web3Request[]>([])
  const [connectedDApp, setConnectedDApp] = useState<string | null>(null)

  // Mock wallet address for demo
  const MOCK_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"

  // Setup window.ethereum object for dApp compatibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ethereumProvider = {
        isMetaMask: false,
        isCarbonFi: true,
        chainId: chainId,
        networkVersion: Number.parseInt(chainId, 16).toString(),
        selectedAddress: accounts[0] || null,

        // Core methods
        request: async ({ method, params }: { method: string; params?: any[] }) => {
          console.log("Web3 Request:", method, params)

          switch (method) {
            case "eth_requestAccounts":
              if (!isConnected) {
                await connect()
              }
              return accounts

            case "eth_accounts":
              return accounts

            case "eth_chainId":
              return chainId

            case "wallet_switchEthereumChain":
              if (params && params[0]?.chainId) {
                await switchChain(params[0].chainId)
                return null
              }
              throw new Error("Invalid chain ID")

            case "eth_sendTransaction":
              if (params && params[0]) {
                return await sendTransaction(params[0])
              }
              throw new Error("Invalid transaction parameters")

            case "personal_sign":
              if (params && params[0]) {
                return await signMessage(params[0])
              }
              throw new Error("Invalid message")

            case "eth_signTypedData_v4":
              if (params && params[1]) {
                return await signMessage(JSON.stringify(params[1]))
              }
              throw new Error("Invalid typed data")

            case "eth_getBalance":
              // Return balance in wei (hex format)
              const balanceWei = Math.floor(Number.parseFloat(balance) * 1e18)
              return "0x" + balanceWei.toString(16)

            default:
              throw new Error(`Method ${method} not supported`)
          }
        },

        // Event handling
        on: (event: string, handler: Function) => {
          console.log("Event listener added:", event)
        },

        removeListener: (event: string, handler: Function) => {
          console.log("Event listener removed:", event)
        },

        // Legacy methods
        enable: async () => {
          await connect()
          return accounts
        },

        send: (method: string, params: any[]) => {
          return ethereumProvider.request({ method, params })
        },
      }

      // Inject into window
      ;(window as any).ethereum = ethereumProvider

      // Dispatch provider detection event
      window.dispatchEvent(new Event("ethereum#initialized"))
    }
  }, [isConnected, accounts, chainId, balance])

  const connect = useCallback(async () => {
    try {
      // Mock connection for demo
      setAccounts([MOCK_ADDRESS])
      setIsConnected(true)
      setBalance("1.5")

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("accountsChanged", { detail: [MOCK_ADDRESS] }))
      }
    } catch (error) {
      console.error("Connection failed:", error)
      throw error
    }
  }, [])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAccounts([])
    setBalance("0")
    setConnectedDApp(null)

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("accountsChanged", { detail: [] }))
    }
  }, [])

  const switchChain = useCallback(async (newChainId: string) => {
    try {
      if (SUPPORTED_CHAINS[newChainId as keyof typeof SUPPORTED_CHAINS]) {
        setChainId(newChainId)

        // Mock balance update for different chains
        const mockBalances: { [key: string]: string } = {
          "0x1": "1.5",
          "0xa4b1": "2.3",
          "0x2105": "0.8",
          "0x89": "1250.0",
          "0x38": "0.5",
        }
        setBalance(mockBalances[newChainId] || "0")

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("chainChanged", { detail: newChainId }))
        }
      } else {
        throw new Error("Unsupported chain")
      }
    } catch (error) {
      console.error("Chain switch failed:", error)
      throw error
    }
  }, [])

  const sendTransaction = useCallback(
    async (transaction: any): Promise<string> => {
      return new Promise((resolve, reject) => {
        const request: Web3Request = {
          id: Date.now().toString(),
          method: "eth_sendTransaction",
          params: [transaction],
          origin: connectedDApp || "Unknown dApp",
          timestamp: Date.now(),
        }

        setPendingRequests((prev) => [...prev, request])

        // Auto-resolve for demo (in real app, user would approve)
        setTimeout(() => {
          const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64)
          resolve(mockTxHash)
          setPendingRequests((prev) => prev.filter((r) => r.id !== request.id))
        }, 2000)
      })
    },
    [connectedDApp],
  )

  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const request: Web3Request = {
          id: Date.now().toString(),
          method: "personal_sign",
          params: [message],
          origin: connectedDApp || "Unknown dApp",
          timestamp: Date.now(),
        }

        setPendingRequests((prev) => [...prev, request])

        // Auto-resolve for demo
        setTimeout(() => {
          const mockSignature = "0x" + Math.random().toString(16).substr(2, 130)
          resolve(mockSignature)
          setPendingRequests((prev) => prev.filter((r) => r.id !== request.id))
        }, 2000)
      })
    },
    [connectedDApp],
  )

  const approveRequest = useCallback(
    async (requestId: string) => {
      const request = pendingRequests.find((r) => r.id === requestId)
      if (request) {
        // Handle approval logic here
        setPendingRequests((prev) => prev.filter((r) => r.id !== requestId))
      }
    },
    [pendingRequests],
  )

  const rejectRequest = useCallback((requestId: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId))
  }, [])

  const refreshBalance = useCallback(async () => {
    // Mock balance refresh
    const currentBalance = Number.parseFloat(balance)
    const variation = (Math.random() - 0.5) * 0.1
    const newBalance = Math.max(0, currentBalance + variation)
    setBalance(newBalance.toFixed(4))
  }, [balance])

  const value: CarbonFiWeb3ContextType = {
    isConnected,
    accounts,
    chainId,
    balance,
    pendingRequests,
    connect,
    disconnect,
    switchChain,
    sendTransaction,
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
