"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Leaf, Zap, ArrowRight, Loader2, KeyRound, Chrome, Sparkles } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface MobileLoginScreenProps {
  onLogin: (type: "smart" | "self-custody", info?: any) => void
  onOpenSetup?: () => void
}

export function MobileLoginScreen({ onLogin, onOpenSetup }: MobileLoginScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { connectInjected } = useCarbonFiWeb3()

  const handleInjectedConnect = async () => {
    setError(null)
    setIsConnecting(true)
    try {
      await connectInjected()
      onLogin("smart", { type: "smart", connectedVia: "injected" })
    } catch (e: any) {
      const msg = e?.message ?? String(e)
      if (msg.includes("No injected")) {
        setError("Tidak ada Web3 wallet terpasang. Install MetaMask / Rabby, atau pakai Self-Custody wallet.")
      } else if (msg.includes("rejected") || msg.includes("denied")) {
        setError("Koneksi dibatalkan oleh pengguna.")
      } else {
        setError(msg)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSelfCustody = () => {
    setError(null)
    onLogin("self-custody", { setupRequired: true })
    onOpenSetup?.()
  }

  return (
    <div className="min-h-[100dvh] relative overflow-hidden bg-[#0B1210] flex flex-col">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-emerald-500/15 blur-[100px]" />
        <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-green-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/30">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-base font-bold leading-none">CarbonFi Wallet</p>
              <p className="mt-0.5 text-[11px] text-emerald-400/70">Powered by Ethereum</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5 border-emerald-500/40 text-emerald-300">
            <Shield className="h-3.5 w-3.5" /> Secure
          </Badge>
        </div>

        {/* Hero */}
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Web3 Carbon Wallet
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white">
            Kelola aset &
            <br />
            offset <span className="bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">karbon</span>
            <br />
            dalam satu dompet 🌿
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Dompet Web3 asli untuk CarbonFi &amp; Athlas Verity. Karbon, NFT, dan aset digital di Ethereum Mainnet.
          </p>
        </div>

        {/* Feature pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] text-white/60 ring-1 ring-white/10">
            <Leaf className="h-3.5 w-3.5 text-emerald-400" /> Carbon Offset
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] text-white/60 ring-1 ring-white/10">
            <Zap className="h-3.5 w-3.5 text-emerald-400" /> Fast &amp; Secure
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] text-white/60 ring-1 ring-white/10">
            <Shield className="h-3.5 w-3.5 text-emerald-400" /> Self-Custody
          </span>
        </div>

        {/* Wallet options */}
        <div className="mt-auto">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={handleInjectedConnect}
            disabled={isConnecting}
            className="group mb-3 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition hover:border-emerald-500/40 hover:bg-white/10 disabled:opacity-60"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 shadow-lg shadow-orange-500/20">
                {isConnecting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <Chrome className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  MetaMask / Rabby
                  <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                </div>
                <div className="text-xs text-white/40">Hubungkan dompet Web3 yang terpasang</div>
              </div>
            </div>
          </button>

          <button
            onClick={handleSelfCustody}
            disabled={isConnecting}
            className="group mb-3 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition hover:border-emerald-500/40 hover:bg-white/10 disabled:opacity-60"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/20">
                <KeyRound className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  Self-Custody Wallet
                  <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                </div>
                <div className="text-xs text-white/40">Buat atau impor dengan private key</div>
              </div>
            </div>
          </button>

          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-white/30">
            <div className="h-px flex-1 bg-white/10" />
            Hanya Ethereum Mainnet
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <Button
            variant="ghost"
            className="mt-4 w-full gap-1.5 text-emerald-300/80 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            <Leaf className="h-4 w-4" />
            Tentang CarbonFi
          </Button>
        </div>
      </div>
    </div>
  )
}
