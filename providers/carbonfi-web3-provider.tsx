"use client"

import { createContext, useState, useEffect, useCallback, useRef } from "react"
import type React from "react"

// Ethers.js types and utilities
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, callback: (...args: any[]) => void) => void
  removeListener: (event: string, callback: (...args: any[]) => void) => void
  selectedAddress?: string
  chainId?: string
  isConnected?: () => boolean
  isCarbonFi?: boolean
  isMetaMask?: boolean
}

interface Web3Transaction {
  to: string
  value?: string
  data?: string
  gas?: string
  gasPrice?: string
  nonce?: string
}

interface CarbonFiWeb3ContextType {
  isConnected: boolean
  accounts: string[]
  chainId: number
  connectedDapp: string | null
  balance: string
  connectDApp: (dappInfo: { name: string; address: string; chainId: number }) => Promise<void>
  disconnectDApp: () => void
  switchChain: (chainId: number) => Promise<void>
  sendTransaction: (transaction: Web3Transaction) => Promise<string>
  signMessage: (message: string) => Promise<string>
  pendingRequest: { id: string; method: string; params: any[] } | null
  approveRequest: (result: any) => void
  rejectRequest: (error: Error) => void
  getBalance: () => Promise<string>
}

export const CarbonFiWeb3Context = createContext<CarbonFiWeb3ContextType | undefined>(undefined)

interface CarbonFiWeb3ProviderProps {
  children: React.ReactNode
}

// Mock wallet data - in real implementation, this would come from secure storage
const MOCK_PRIVATE_KEY = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
const MOCK_ADDRESS = "0xCarbonFiWalletAddress1234567890abcdef"

// Chain configurations
const CHAIN_CONFIGS = {
  1: { name: "Ethereum Mainnet", rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/demo", symbol: "ETH" },
  42161: { name: "Arbitrum One", rpcUrl: "https://arb1.arbitrum.io/rpc", symbol: "ETH" },
  8453: { name: "Base", rpcUrl: "https://mainnet.base.org", symbol: "ETH" },
  137: { name: "Polygon", rpcUrl: "https://polygon-rpc.com", symbol: "MATIC" },
  56: { name: "BSC", rpcUrl: "https://bsc-dataseed.binance.org", symbol: "BNB" },
}

export function CarbonFiWeb3Provider({ children }: CarbonFiWeb3ProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [accounts, setAccounts] = useState<string[]>([])
  const [chainId, setChainId] = useState<number>(1) // Default to Ethereum mainnet
  const [connectedDapp, setConnectedDapp] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [pendingRequest, setPendingRequest] = useState<{ id: string; method: string; params: any[] } | null>(null)

  const pendingRequestResolve = useRef<(value: any) => void>()
  const pendingRequestReject = useRef<(reason?: any) => void>()
  const requestIdCounter = useRef(0)

  // Simulate Web3 provider functionality
  const connectDApp = useCallback(async (dappInfo: { name: string; address: string; chainId: number }) => {
    try {
      // Simulate connection approval process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsConnected(true)
      setAccounts([MOCK_ADDRESS])
      setConnectedDapp(dappInfo.name)
      setChainId(dappInfo.chainId)

      // Simulate getting balance
      await getBalance()

      console.log(`CarbonFi Wallet connected to ${dappInfo.name} on chain ${dappInfo.chainId}`)

      // Emit accountsChanged event
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const ethereum = (window as any).ethereum
        if (ethereum._events && ethereum._events.accountsChanged) {
          ethereum._events.accountsChanged.forEach((callback: any) => {
            callback([MOCK_ADDRESS])
          })
        }
      }
    } catch (error) {
      console.error("Failed to connect to dApp:", error)
      throw error
    }
  }, [])

  const disconnectDApp = useCallback(() => {
    setIsConnected(false)
    setAccounts([])
    setConnectedDapp(null)
    setBalance("0")

    console.log("CarbonFi Wallet disconnected")

    // Emit accountsChanged event
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const ethereum = (window as any).ethereum
      if (ethereum._events && ethereum._events.accountsChanged) {
        ethereum._events.accountsChanged.forEach((callback: any) => {
          callback([])
        })
      }
    }
  }, [])

  const switchChain = useCallback(async (newChainId: number) => {
    try {
      // Simulate chain switching
      await new Promise((resolve) => setTimeout(resolve, 500))

      setChainId(newChainId)

      // Update balance for new chain
      await getBalance()

      console.log(`Switched to chain ${newChainId}`)

      // Emit chainChanged event
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const ethereum = (window as any).ethereum
        if (ethereum._events && ethereum._events.chainChanged) {
          ethereum._events.chainChanged.forEach((callback: any) => {
            callback(`0x${newChainId.toString(16)}`)
          })
        }
      }
    } catch (error) {
      console.error("Failed to switch chain:", error)
      throw error
    }
  }, [])

  const getBalance = useCallback(async (): Promise<string> => {
    try {
      // Simulate balance fetching based on chain
      const mockBalances = {
        1: "2.45", // ETH
        42161: "2.45", // ETH on Arbitrum
        8453: "3.78", // ETH on Base
        137: "15420.67", // MATIC
        56: "0.85", // BNB
      }

      const newBalance = mockBalances[chainId as keyof typeof mockBalances] || "0"
      setBalance(newBalance)
      return newBalance
    } catch (error) {
      console.error("Failed to get balance:", error)
      return "0"
    }
  }, [chainId])

  const sendTransaction = useCallback(
    async (transaction: Web3Transaction): Promise<string> => {
      try {
        // Simulate transaction signing and sending
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Generate mock transaction hash
        const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

        console.log("Transaction sent:", {
          hash: txHash,
          to: transaction.to,
          value: transaction.value,
          chainId,
        })

        return txHash
      } catch (error) {
        console.error("Failed to send transaction:", error)
        throw error
      }
    },
    [chainId],
  )

  const signMessage = useCallback(async (message: string): Promise<string> => {
    try {
      // Simulate message signing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate mock signature
      const signature = `0x${Math.random().toString(16).substr(2, 130)}`

      console.log("Message signed:", { message, signature })

      return signature
    } catch (error) {
      console.error("Failed to sign message:", error)
      throw error
    }
  }, [])

  const request = useCallback(
    async (args: { method: string; params?: any[] }) => {
      console.log("CarbonFi Web3 Provider: Request received", args)

      const requestId = `req_${++requestIdCounter.current}`

      // Handle common Web3 methods
      switch (args.method) {
        case "eth_requestAccounts":
          if (!isConnected) {
            // Return empty array if not connected
            return []
          }
          return [MOCK_ADDRESS]

        case "eth_accounts":
          return isConnected ? [MOCK_ADDRESS] : []

        case "eth_chainId":
          return `0x${chainId.toString(16)}`

        case "net_version":
          return chainId.toString()

        case "eth_getBalance":
          return `0x${(Number.parseFloat(balance) * 1e18).toString(16)}`

        case "wallet_switchEthereumChain":
          const newChainId = Number.parseInt(args.params?.[0]?.chainId, 16)
          await switchChain(newChainId)
          return null

        case "eth_sendTransaction":
        case "eth_signTransaction":
        case "personal_sign":
        case "eth_signTypedData":
        case "eth_signTypedData_v4":
          // These require user approval
          return new Promise((resolve, reject) => {
            setPendingRequest({ id: requestId, method: args.method, params: args.params || [] })
            pendingRequestResolve.current = resolve
            pendingRequestReject.current = reject
          })

        default:
          throw new Error(`Unsupported method: ${args.method}`)
      }
    },
    [isConnected, chainId, balance, switchChain],
  )

  const approveRequest = useCallback(
    async (result: any) => {
      if (pendingRequestResolve.current && pendingRequest) {
        try {
          let finalResult = result

          // Handle different request types
          switch (pendingRequest.method) {
            case "eth_sendTransaction":
              finalResult = await sendTransaction(pendingRequest.params[0])
              break
            case "personal_sign":
              finalResult = await signMessage(pendingRequest.params[0])
              break
            case "eth_signTypedData":
            case "eth_signTypedData_v4":
              finalResult = await signMessage(JSON.stringify(pendingRequest.params[1]))
              break
          }

          pendingRequestResolve.current(finalResult)
        } catch (error) {
          if (pendingRequestReject.current) {
            pendingRequestReject.current(error)
          }
        }
      }
      setPendingRequest(null)
    },
    [pendingRequest, sendTransaction, signMessage],
  )

  const rejectRequest = useCallback((error: Error) => {
    if (pendingRequestReject.current) {
      pendingRequestReject.current(error)
    }
    setPendingRequest(null)
  }, [])

  useEffect(() => {
    // Initialize window.ethereum provider
    if (typeof window !== "undefined") {
      const ethereum: EthereumProvider = {
        isCarbonFi: true,
        isMetaMask: false, // Explicitly not MetaMask
        request: request,
        selectedAddress: isConnected ? MOCK_ADDRESS : undefined,
        chainId: `0x${chainId.toString(16)}`,
        isConnected: () => isConnected,
        on: (event: string, callback: (...args: any[]) => void) => {
          // Store event listeners
          if (!(ethereum as any)._events) {
            ;(ethereum as any)._events = {}
          }
          if (!(ethereum as any)._events[event]) {
            ;(ethereum as any)._events[event] = []
          }
          ;(ethereum as any)._events[event].push(callback)
          console.log(`Event listener registered: ${event}`)
        },
        removeListener: (event: string, callback: (...args: any[]) => void) => {
          if ((ethereum as any)._events && (ethereum as any)._events[event]) {
            const index = (ethereum as any)._events[event].indexOf(callback)
            if (index > -1) {
              ;(ethereum as any)._events[event].splice(index, 1)
            }
          }
          console.log(`Event listener removed: ${event}`)
        },
      }
      ;(window as any).ethereum = ethereum
      console.log("CarbonFi Web3 Provider initialized on window.ethereum")

      // Dispatch ethereum provider detection event
      window.dispatchEvent(new Event("ethereum#initialized"))
    }
  }, [isConnected, chainId, request])

  // Update balance when chain changes
  useEffect(() => {
    if (isConnected) {
      getBalance()
    }
  }, [chainId, isConnected, getBalance])

  const value = {
    isConnected,
    accounts,
    chainId,
    connectedDapp,
    balance,
    connectDApp,
    disconnectDApp,
    switchChain,
    sendTransaction,
    signMessage,
    pendingRequest,
    approveRequest,
    rejectRequest,
    getBalance,
  }

  return <CarbonFiWeb3Context.Provider value={value}>{children}</CarbonFiWeb3Context.Provider>
}
