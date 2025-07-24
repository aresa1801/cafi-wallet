"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Wifi, WifiOff } from "lucide-react"
import { QRWalletScanner } from "./qr-wallet-scanner"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface WalletConnectButtonProps {
  className?: string
}

export function WalletConnectButton({ className }: WalletConnectButtonProps) {
  const [showScanner, setShowScanner] = useState(false)
  const { isConnected, connectedDapp, disconnectDApp } = useCarbonFiWeb3()

  const handleWalletConnect = (connectionData: any) => {
    // This function is now primarily for closing the scanner,
    // the actual connection is handled by the Web3 provider.
    console.log("QR Scanner closed after connection attempt:", connectionData)
    setShowScanner(false)
  }

  const handleDisconnect = () => {
    disconnectDApp() // Disconnect via the Web3 provider
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
