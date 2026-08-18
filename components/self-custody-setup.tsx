"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Copy, Eye, EyeOff, Loader2, PlusCircle, Import } from "lucide-react"
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

  const importStep = step === "import"
  const keyToUse = importStep ? importedKey : privateKey
  const isReady = importStep ? importedKey.trim().startsWith("0x") : privateKey.length > 0

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
      if (!key) throw new Error("Private key is empty")
      await connectPrivateKey(key)
      onComplete({ type: "self-custody", connectedVia: "private-key" })
    } catch (e: any) {
      setError(e?.message ?? String(e))
    } finally {
      setConnecting(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(keyToUse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0B1210] flex flex-col">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-500/12 blur-[100px]" />
        <div className="absolute bottom-1/4 -left-24 h-64 w-64 rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md min-h-[100dvh] flex-col p-5">
        <div className="flex items-center justify-between py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={connecting}
            className="gap-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Badge variant="outline" className="gap-1.5 border-emerald-500/40 text-emerald-300">
            <Shield className="h-3.5 w-3.5" /> Self-Custody
          </Badge>
        </div>

        <div className="pt-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">Self-Custody Wallet</h1>
          <p className="mt-1 text-sm text-white/50">
            You fully control your wallet keys. Keep your private key safe — it cannot be recovered if lost.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {step === "choose-action" && (
            <>
              <button
                onClick={handleGenerate}
                className="group w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-left backdrop-blur transition hover:border-emerald-400/60 hover:bg-emerald-500/15"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/20">
                    <PlusCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white">Create a new wallet</div>
                    <div className="text-xs text-white/50">Generates a real private key via ethers (BIP-39)</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setError(null)
                  setStep("import")
                }}
                className="group w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition hover:border-emerald-500/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20">
                    <Import className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white">Import an existing wallet</div>
                    <div className="text-xs text-white/50">Enter an existing private key</div>
                  </div>
                </div>
              </button>
            </>
          )}

          {(step === "generate" || step === "import") && (
            <div className="rounded-2xl border border-emerald-500/20 bg-white/5 p-5 backdrop-blur">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-white">
                  {importStep ? "Import Private Key" : "New Private Key"}
                </h2>
              </div>

              <div className="space-y-4">
                {!importStep && address && (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs">
                    <span className="text-white/40">Address:</span>{" "}
                    <span className="font-mono break-all text-emerald-300">{address}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/40">Private key</span>
                    {keyToUse && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-6 gap-1 px-2 text-xs text-emerald-300 hover:bg-emerald-500/10"
                      >
                        <Copy className="h-3 w-3" /> {copied ? "Copied" : "Copy"}
                      </Button>
                    )}
                  </div>

                  {importStep ? (
                    <textarea
                      value={importedKey}
                      onChange={(e) => setImportedKey(e.target.value)}
                      placeholder="0x..."
                      rows={2}
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-emerald-500/50 focus:outline-none"
                    />
                  ) : (
                    <div className="relative">
                      <textarea
                        readOnly
                        value={privateKey}
                        rows={2}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-emerald-300 focus:outline-none"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKey((s) => !s)}
                        className="absolute right-2 top-2 h-6 w-6 p-0 text-white/50"
                      >
                        {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  )}
                </div>

                {!importStep && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-300">
                    ⚠️ Never share this private key with anyone. Store it somewhere safe (password manager).
                  </div>
                )}

                <Button
                  onClick={handleConnect}
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                  disabled={!isReady || connecting}
                >
                  {connecting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {importStep ? "Import & Connect" : "Connect Wallet"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
