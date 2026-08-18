"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check, QrCode } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface ReceiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReceiveDialog({ open, onOpenChange }: ReceiveDialogProps) {
  const { isConnected, accounts } = useCarbonFiWeb3()
  const [copied, setCopied] = useState(false)
  const address = accounts[0] ?? ""

  // Simple deterministic QR placeholder — encodes the address as a URI
  const qrUri = address ? `ethereum:${address}` : ""

  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Receive ETH</DialogTitle>
          <DialogDescription>Share this address to receive Ether on the Ethereum Mainnet.</DialogDescription>
        </DialogHeader>

        {isConnected && address ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-2xl border-2 border-emerald-500/40 p-4 bg-white dark:bg-slate-900">
              <QrCode className="h-32 w-32 text-slate-900 dark:text-white" />
            </div>
            <p className="text-xs text-muted-foreground text-center break-all font-mono">{address}</p>
            <Button onClick={handleCopy} variant="outline" className="w-full gap-2">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy address"}
            </Button>
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <p>Wallet not connected.</p>
            <p className="mt-1 text-xs">Connect a wallet first to see your address.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
