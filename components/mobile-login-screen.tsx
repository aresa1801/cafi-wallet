"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Leaf, Shield, Zap, ArrowRight, Loader2, KeyRound, Smartphone, Wallet } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"
import { SmartWalletGoogle } from "@/components/smart-wallet-google"

interface MobileLoginScreenProps {
  onLogin: (type: "smart" | "self-custody", info?: any) => void
  onOpenSetup?: () => void
}

export function MobileLoginScreen({ onLogin, onOpenSetup }: MobileLoginScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showGoogle, setShowGoogle] = useState(false)
  const { connectSmartWallet } = useCarbonFiWeb3()

  const handleSelfCustody = () => {
    setError(null)
    onLogin("self-custody", { setupRequired: true })
    onOpenSetup?.()
  }

  const handleGoogleConnected = (email: string) => {
    onLogin("smart", { type: "smart", connectedVia: "google", email })
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
            <Wallet className="h-3.5 w-3.5" />
            Web3 Carbon Wallet
          </div>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white">
            Manage assets &amp;
            <br />
            offset <span className="bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">carbon</span>
            <br />
            in one wallet 🌿
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            The real Web3 wallet for CarbonFi &amp; Athlas Verity. Carbon, NFTs and digital assets on the Ethereum
            Mainnet.
          </p>
        </div>

        {/* Create new wallet CTA */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">Create a new wallet</p>

          {/* Smart Wallet — Google Auth (primary) */}
          <button
            onClick={() => setShowGoogle(true)}
            className="group mb-3 w-full rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 p-4 text-left backdrop-blur transition hover:border-emerald-400/70 hover:from-emerald-500/25"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/25">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  Smart Wallet
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-300">
                    Google
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                </div>
                <div className="text-xs text-white/40">Continue with Google to create &amp; access your wallet</div>
              </div>
            </div>
          </button>

          {/* Self Custody Wallet */}
          <button
            onClick={handleSelfCustody}
            disabled={isConnecting}
            className="group w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition hover:border-emerald-500/40 hover:bg-white/10 disabled:opacity-60"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20">
                <KeyRound className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  Self-Custody Wallet
                  {isConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white/40" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                  )}
                </div>
                <div className="text-xs text-white/40">Create or import with a private key</div>
              </div>
            </div>
          </button>
        </div>

        {/* Errors */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="mt-auto">
          <div className="mb-4 flex items-center justify-center gap-3 text-[11px] text-white/30">
            <div className="h-px flex-1 bg-white/10" />
            Only Ethereum Mainnet
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="text-center text-[11px] text-white/30">
            By continuing, you agree to the CarbonFi{" "}
            <span className="text-emerald-400/70">Terms of Service</span> and{" "}
            <span className="text-emerald-400/70">Privacy Policy</span>
          </div>
        </div>
      </div>

      <SmartWalletGoogle open={showGoogle} onOpenChange={setShowGoogle} onConnected={handleGoogleConnected} />
    </div>
  )
}
