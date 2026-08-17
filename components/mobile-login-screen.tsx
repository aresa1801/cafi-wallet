"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Leaf, Zap, Users, ArrowRight, Loader2, Chrome, KeyRound } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SustainabilityBackground } from "@/components/sustainability-background"
import Image from "next/image"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface MobileLoginScreenProps {
  onLogin: (type: "smart" | "self-custody", info?: any) => void
  onOpenSetup?: () => void
}

export function MobileLoginScreen({ onLogin, onOpenSetup }: MobileLoginScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { connectInjected, connectPrivateKey } = useCarbonFiWeb3()

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
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden">
      <SustainabilityBackground />
      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">CarbonFi Wallet</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Hero */}
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Selamat datang di
            <br />
            <span className="text-primary">Wallet Hijau</span> kamu 🌿
          </h1>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed max-w-sm">
            Dompet Web3 asli dengan dukungan penuh platform CarbonFi &amp; Athlas Verity.
            Satu dompet untuk karbon, NFT, dan aset digitalmu di Ethereum.
          </p>
        </div>

        {/* Feature badges */}
        <div className="px-6 pt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1.5 bg-primary/10 text-primary">
            <Leaf className="h-3.5 w-3.5" /> Karbon Offset
          </Badge>
          <Badge variant="secondary" className="gap-1.5 bg-secondary/10">
            <Zap className="h-3.5 w-3.5" /> Fast &amp; Gas-less
          </Badge>
          <Badge variant="secondary" className="gap-1.5 bg-secondary/10">
            <Shield className="h-3.5 w-3.5" /> Self-Custody
          </Badge>
          <Badge variant="secondary" className="gap-1.5 bg-secondary/10">
            <Users className="h-3.5 w-3.5" /> DAO Ready
          </Badge>
        </div>

        {/* Wallet options */}
        <div className="flex-1 flex items-end px-5 pb-8 pt-10">
          <Card className="w-full border-2 border-primary/20 bg-card/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pilih metode masuk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {error && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
              )}

              {/* Injected / extension wallet */}
              <button
                onClick={handleInjectedConnect}
                disabled={isConnecting}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-left transition hover:border-primary/50 hover:bg-primary/5 disabled:opacity-60"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {isConnecting ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Chrome className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm">Metamask / Rabby / WalletConnect</div>
                  <div className="text-xs text-muted-foreground">Hubungkan dompet web3 yang terpasang</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </button>

              {/* Self-custody */}
              <button
                onClick={handleSelfCustody}
                disabled={isConnecting}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-left transition hover:border-primary/50 hover:bg-primary/5 disabled:opacity-60"
              >
                <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                  <KeyRound className="h-5 w-5 text-secondary" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm">Self-Custody Wallet</div>
                  <div className="text-xs text-muted-foreground">Buat atau impor dengan seed phrase</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </button>

              <p className="pt-1 text-center text-[11px] text-muted-foreground">
                Hanya mendukung <span className="font-semibold text-foreground">Ethereum Mainnet</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
