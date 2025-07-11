"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Wifi, WifiOff } from "lucide-react"
import { QRWalletScanner } from "./qr-wallet-scanner"

interface WalletConnectButtonProps {
  className?: string
}

export function WalletConnectButton({ className }: WalletConnectButtonProps) {
  const [showScanner, setShowScanner] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectedDapp, setConnectedDapp] = useState<string | null>(null)

  const handleWalletConnect = (connectionData: any) => {
    setIsConnected(true)
    setConnectedDapp(connectionData.dapp)
    console.log("Connected to:", connectionData)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectedDapp(null)
  }

  if (showScanner) {
    return <QRWalletScanner onClose={() => setShowScanner(false)} onWalletConnect={handleWalletConnect} />
  }

  return (
    <div className={className}>
      {!isConnected ? (
        <Button
          onClick={() => setShowScanner(true)}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 border-soft-primary/30 text-soft-primary hover:bg-soft-primary/10 hover:border-soft-primary/50 transition-all duration-300 shadow-soft"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">Connect dApp</span>
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <Badge className="bg-soft-success/20 text-soft-success border-soft-success/30 flex items-center space-x-1">
            <Wifi className="w-3 h-3" />
            <span className="text-xs">{connectedDapp}</span>
          </Badge>
          <Button
            onClick={handleDisconnect}
            variant="ghost"
            size="sm"
            className="text-text-tertiary dark:text-text-dark-tertiary hover:text-soft-error hover:bg-soft-error/10"
          >
            <WifiOff className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
