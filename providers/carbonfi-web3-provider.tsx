"use client"

import { useRef } from "react"

import type React from "react"
import { createContext, useState, useEffect, useCallback } from "react"

interface CarbonFiWeb3ContextType {
  isConnected: boolean
  accounts: string[]
  connectedDapp: string | null
  connectDApp: (dappInfo: { name: string; address: string; chainId: number }) => Promise<void>
  disconnectDApp: () => void
  pendingRequest: { method: string; params: any[] } | null
  approveRequest: (result: any) => void
  rejectRequest: (error: Error) => void
}

export const CarbonFiWeb3Context = createContext<CarbonFiWeb3ContextType | undefined>(undefined)

interface CarbonFiWeb3ProviderProps {
  children: React.ReactNode
}

export function CarbonFiWeb3Provider({ children }: CarbonFiWeb3ProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [accounts, setAccounts] = useState<string[]>([])
  const [connectedDapp, setConnectedDapp] = useState<string | null>(null)
  const [pendingRequest, setPendingRequest] = useState<{ method: string; params: any[] } | null>(null)
  const pendingRequestResolve = useRef<(value: any) => void>()
  const pendingRequestReject = useRef<(reason?: any) => void>()

  const mockAccount = "0xCarbonFiWalletAddress1234567890abcdef" // Mock wallet address

  const connectDApp = useCallback(async (dappInfo: { name: string; address: string; chainId: number }) => {
    // Simulate connection approval
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsConnected(true)
    setAccounts([mockAccount])
    setConnectedDapp(dappInfo.name)
    console.log(`CarbonFi Wallet connected to ${dappInfo.name}`)
  }, [])

  const disconnectDApp = useCallback(() => {
    setIsConnected(false)
    setAccounts([])
    setConnectedDapp(null)
    console.log("CarbonFi Wallet disconnected.")
  }, [])

  const request = useCallback(async (args: { method: string; params?: any[] }) => {
    console.log("CarbonFi Web3 Provider: Request received", args)
    return new Promise((resolve, reject) => {
      setPendingRequest(args as { method: string; params: any[] })
      pendingRequestResolve.current = resolve
      pendingRequestReject.current = reject
    })
  }, [])

  const approveRequest = useCallback((result: any) => {
    if (pendingRequestResolve.current) {
      pendingRequestResolve.current(result)
    }
    setPendingRequest(null)
  }, [])

  const rejectRequest = useCallback((error: Error) => {
    if (pendingRequestReject.current) {
      pendingRequestReject.current(error)
    }
    setPendingRequest(null)
  }, [])

  useEffect(() => {
    // Simulate window.ethereum for dApp interaction
    if (typeof window !== "undefined") {
      ;(window as any).ethereum = {
        isCarbonFi: true, // Custom flag for CarbonFi Wallet
        isMetaMask: false, // Indicate it's not MetaMask
        request: request,
        on: (event: string, callback: (...args: any[]) => void) => {
          // Mock event listeners if needed, e.g., 'accountsChanged', 'chainChanged'
          console.log(`Event listener registered: ${event}`)
        },
        removeListener: (event: string, callback: (...args: any[]) => void) => {
          console.log(`Event listener removed: ${event}`)
        },
        // Add other properties/methods as needed for dApp compatibility
        selectedAddress: isConnected ? mockAccount : undefined,
        chainId: isConnected ? "0x1" : undefined, // Mock Ethereum Mainnet
      }
      console.log("CarbonFi Web3 Provider initialized on window.ethereum")
    }
  }, [isConnected, request]) // Re-initialize if connection status changes

  const value = {
    isConnected,
    accounts,
    connectedDapp,
    connectDApp,
    disconnectDApp,
    pendingRequest,
    approveRequest,
    rejectRequest,
  }

  return <CarbonFiWeb3Context.Provider value={value}>{children}</CarbonFiWeb3Context.Provider>
}
