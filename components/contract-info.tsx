"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Shield, Coins } from "lucide-react"

export const CAFI_CONTRACT_ADDRESS = "0xa5359E55423E47Afe93D86b1bdaD827f1C1c16EB"

interface ContractInfoProps {
  className?: string
}

export function ContractInfo({ className }: ContractInfoProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const openInExplorer = (address: string) => {
    // This would open the appropriate block explorer based on the current chain
    window.open(`https://etherscan.io/address/${address}`, "_blank")
  }

  return (
    <Card className={`bg-dark-card border-dark-border ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Coins className="w-5 h-5 text-carbon-primary" />
          <span>CAFI Token Contract</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-dark-surface rounded-lg p-4 border border-dark-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-muted">Contract Address</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(CAFI_CONTRACT_ADDRESS)}
                className="text-carbon-accent hover:text-white p-1"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openInExplorer(CAFI_CONTRACT_ADDRESS)}
                className="text-carbon-accent hover:text-white p-1"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-white font-mono text-sm break-all">{CAFI_CONTRACT_ADDRESS}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-carbon-primary/10 rounded-lg border border-carbon-primary/20">
            <Shield className="w-6 h-6 text-carbon-primary mx-auto mb-1" />
            <p className="text-xs text-carbon-primary font-semibold">Verified Contract</p>
          </div>
          <div className="text-center p-3 bg-carbon-accent/10 rounded-lg border border-carbon-accent/20">
            <Coins className="w-6 h-6 text-carbon-accent mx-auto mb-1" />
            <p className="text-xs text-carbon-accent font-semibold">ERC-20 Token</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark-muted">Token Name:</span>
            <span className="text-white font-semibold">CarbonFi</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-muted">Symbol:</span>
            <span className="text-white font-semibold">CAFI</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-muted">Decimals:</span>
            <span className="text-white font-semibold">18</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
