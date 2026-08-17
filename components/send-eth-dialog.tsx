"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Send, CheckCircle2 } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"
import { ethers } from "ethers"

interface SendEthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendEthDialog({ open, onOpenChange }: SendEthDialogProps) {
  const { isConnected, balance, sendTransaction, refreshBalance } = useCarbonFiWeb3()
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const reset = () => {
    setTo("")
    setAmount("")
    setError(null)
    setTxHash(null)
  }

  const handleClose = (open: boolean) => {
    if (!sending) {
      reset()
      onOpenChange(open)
    }
  }

  const handleSend = async () => {
    setError(null)
    if (!ethers.isAddress(to)) {
      setError("Alamat tujuan tidak valid")
      return
    }
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Masukkan jumlah ETH yang valid")
      return
    }
    if (Number.parseFloat(amount) > Number.parseFloat(balance || "0")) {
      setError("Saldo tidak mencukupi")
      return
    }

    setSending(true)
    try {
      const hash = await sendTransaction(to, amount)
      setTxHash(hash)
      await refreshBalance()
      setTimeout(() => {
        reset()
        onOpenChange(false)
      }, 3000)
    } catch (e: any) {
      setError(e?.message?.includes("rejected") ? "Transaksi dibatalkan" : (e?.message ?? "Gagal mengirim"))
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Kirim ETH</DialogTitle>
          <DialogDescription>Kirim Ether ke alamat Ethereum mana pun di Mainnet.</DialogDescription>
        </DialogHeader>

        {txHash ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-3" />
            <p className="font-semibold">Transaksi terkirim!</p>
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 break-all hover:underline"
            >
              {txHash.slice(0, 18)}...
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">Alamat tujuan</Label>
              <Input
                id="to"
                placeholder="0x..."
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Jumlah (ETH)</Label>
                <span className="text-xs text-muted-foreground">
                  Saldo: {Number.parseFloat(balance || "0").toFixed(4)} ETH
                </span>
              </div>
              <Input
                id="amount"
                type="number"
                step="0.0001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {Number.parseFloat(balance || "0") > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setAmount(balance)}
                >
                  Max
                </Button>
              )}
            </div>

            {error && <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}

            <Button onClick={handleSend} disabled={sending || !isConnected} className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Mengirim..." : "Kirim ETH"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
