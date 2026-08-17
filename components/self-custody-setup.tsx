"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Copy, Eye, EyeOff, RefreshCw, Loader2 } from "lucide-react"
import { ethers } from "ethers"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface SelfCustodySetupProps {
  onComplete: (info: any) => void
  onBack: () => void
}

type SetupStep = "choose-action" | "generate" | "import"

export function SelfCustodySetup({ onComplete, onBack }: SelfCustodySetupProps) {
  const [step, setStep] = useState<SetupStep>("choose-action")
  const [privateKey, setPrivateKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [address, setAddress] = useState("")
  const [importedKey, setImportedKey] = useState("")
  const [copied, setCopied] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { connectPrivateKey } = useCarbonFiWeb3()

  const handleGenerate = () => {
    setError(null)
    const wallet = ethers.Wallet.createRandom()
    setPrivateKey(wallet.privateKey)
    setAddress(wallet.address)
    setStep("generate")
  }

  const handleConnect = async () => {
    setError(null)
    setConnecting(true)
    try {
      const key = importStep ? importedKey : privateKey
      if (!key) throw new Error("Private key kosong")
      await connectPrivateKey(key)
      onComplete({ type: "self-custody", connectedVia: "private-key" })
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setConnecting(false)
    }
  }

  const importStep = step === "import"
  const keyToUse = importStep ? importedKey : privateKey
  const isReady = (importStep ? importedKey.trim().startsWith("0x") : privateKey.length > 0)

  const handleCopy = () => {
    navigator.clipboard.writeText(keyToUse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-dark-bg to-dark-surface relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-carbon-primary/10 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-carbon-accent/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-[100dvh] flex flex-col p-5">
        <div className="flex items-center justify-between py-2">
          <Button variant="ghost" size="sm" onClick={onBack} disabled={connecting} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
          <Badge variant="secondary" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Self-Custody
          </Badge>
        </div>

        <div className="pt-4">
          <h1 className="text-2xl font-bold tracking-tight">Self-Custody Wallet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kamu memegang penuh kunci dompet. Simpan private key dengan aman — tidak bisa dipulihkan jika hilang.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
        )}

        <div className="mt-6 space-y-4">
          {step === "choose-action" && (
            <>
              <button
                onClick={handleGenerate}
                className="w-full flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 text-left transition hover:border-primary/60"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Buat wallet baru</div>
                  <div className="text-xs text-muted-foreground">Generasi private key asli via ethers (BIP-39)</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setError(null)
                  setStep("import")
                }}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-4 text-left transition hover:border-primary/50"
              >
                <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold">Impor wallet</div>
                  <div className="text-xs text-muted-foreground">Masukkan private key yang sudah ada</div>
                </div>
              </button>
            </>
          )}

          {(step === "generate" || step === "import") && (
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{importStep ? "Impor Private Key" : "Private Key Baru"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!importStep && address && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs">
                    <span className="text-muted-foreground">Address:</span>{" "}
                    <span className="font-mono text-xs break-all">{address}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Private key</span>
                    {keyToUse && (
                      <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 gap-1 px-2 text-xs">
                        <Copy className="h-3 w-3" /> {copied ? "Tersalin" : "Salin"}
                      </Button>
                    )}
                  </div>

                  {importStep ? (
                    <textarea
                      value={importedKey}
                      onChange={(e) => setImportedKey(e.target.value)}
                      placeholder="0x..."
                      rows={2}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs"
                    />
                  ) : (
                    <div className="relative">
                      <textarea
                        readOnly
                        value={privateKey}
                        rows={2}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKey((s) => !s)}
                        className="absolute right-2 top-2 h-6 w-6 p-0"
                      >
                        {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  )}
                </div>

                {!importStep && (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-[11px] text-amber-600 dark:text-amber-400">
                    ⚠️ Jangan bagikan private key ini ke siapa pun. Simpan di tempat aman (password manager).
                  </div>
                )}

                <Button onClick={handleConnect} className="w-full gap-2" disabled={!isReady || connecting}>
                  {connecting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {importStep ? "Impor & Hubungkan" : "Hubungkan Wallet"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
