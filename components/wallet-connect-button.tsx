"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

export function WalletConnectButton() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { isConnected, accounts, connect, disconnect, connectedDApp } = useCarbonFiWeb3()

  const handleConnect = async () => {
    if (isConnected) {
      disconnect()
    } else {
      setIsConnecting(true)
      try {
        await connect()
      } catch (error) {
        console.error("Connection failed:", error)
      } finally {
        setIsConnecting(false)
      }
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnecting) {
    return (
      <Button disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="gap-1">
          <Wifi className="h-3 w-3" />
          {accounts[0] ? formatAddress(accounts[0]) : "Connected"}
        </Badge>
        {connectedDApp && <Badge variant="outline">{connectedDApp}</Badge>}
        <Button variant="outline" size="sm" onClick={handleConnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleConnect} className="gap-2 bg-green-600 hover:bg-green-700">
      <WifiOff className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
