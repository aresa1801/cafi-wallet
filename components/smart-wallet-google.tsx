"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, Mail } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface SmartWalletGoogleProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnected: (email: string) => void
}

/**
 * Smart Wallet via Google Auth.
 * Uses Google Identity Services (GIS) when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set.
 * Falls back to a simple email identity (still derives a deterministic wallet)
 * so the flow never errors without configuration.
 */
export function SmartWalletGoogle({ open, onOpenChange, onConnected }: SmartWalletGoogleProps) {
  const { connectSmartWallet } = useCarbonFiWeb3()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const connectWithIdentifier = async (identifier: string, name?: string) => {
    setError(null)
    setLoading(true)
    try {
      await connectSmartWallet(identifier, name)
      onConnected(identifier)
    } catch (e: any) {
      setError(e?.message ?? "Failed to connect smart wallet")
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    const cleaned = email.trim().toLowerCase()
    if (!cleaned || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleaned)) {
      setError("Please enter a valid email address.")
      return
    }
    await connectWithIdentifier(cleaned)
  }

  const handleGoogle = () => {
    if (!googleClientId) {
      // No client ID configured — prompt for email identity instead of erroring.
      return
    }
    // Google Identity Services popup (requires GIS SDK loaded in layout).
    const anyWin = window as any
    if (anyWin.google?.accounts?.id) {
      anyWin.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (resp: any) => {
          if (resp?.credential) {
            const payload = JSON.parse(atob(resp.credential.split(".")[1]))
            connectWithIdentifier(payload.email ?? payload.sub, payload.name)
          }
        },
      })
      anyWin.google.accounts.id.prompt()
    } else {
      setError("Google Sign-In is not available on this device. Enter your email below instead.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Smart Wallet</DialogTitle>
          <DialogDescription>
            Sign in to your Google account to access your CarbonFi smart wallet on Ethereum.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {googleClientId ? (
            <Button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
              </svg>
              {loading ? "Connecting..." : "Continue with Google"}
            </Button>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Google Sign-In will appear here once configured. You can still continue with your email to create your
              smart wallet.
            </p>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or use email</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleContinue} disabled={loading || !email.trim()} className="w-full gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
