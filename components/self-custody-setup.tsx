"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Copy, Eye, EyeOff, RefreshCw } from "lucide-react"
import { generateSeedPhrase, validateSeedPhrase } from "@/utils/seed-phrase"

interface SelfCustodySetupProps {
  onComplete: (info: any) => void
  onBack: () => void
}

type SetupStep = "choose-action" | "generate-seed" | "confirm-seed" | "import-wallet"

export function SelfCustodySetup({ onComplete, onBack }: SelfCustodySetupProps) {
  const [step, setStep] = useState<SetupStep>("choose-action")
  const [seedPhrase, setSeedPhrase] = useState<string>("")
  const [showSeed, setShowSeed] = useState(false)
  const [confirmedSeed, setConfirmedSeed] = useState(false)
  const [importedSeed, setImportedSeed] = useState("")
  const [derivedAddress, setDerivedAddress] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerateSeed = async () => {
    const phrase = generateSeedPhrase()
    setSeedPhrase(phrase)
    setStep("generate-seed")
  }

  const handleConfirmSeed = () => {
    setConfirmedSeed(true)
    setStep("confirm-seed")
  }

  const handleCreateWallet = () => {
    const address = "0x" + Math.random().toString(16).slice(2, 42)
    setDerivedAddress(address)
    onComplete({
      type: "self-custody",
      address,
      seedPhrase,
      method: "create",
    })
  }

  const handleImportWallet = () => {
    if (validateSeedPhrase(importedSeed)) {
      const address = "0x" + Math.random().toString(16).slice(2, 42)
      setDerivedAddress(address)
      onComplete({
        type: "self-custody",
        address,
        seedPhrase: importedSeed,
        method: "import",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-secondary/5 p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Self-Custody Wallet</h1>
            <p className="text-sm text-muted-foreground">Full control of your private keys</p>
          </div>
        </div>

        {/* Choose Action */}
        {step === "choose-action" && (
          <div className="space-y-4">
            <Card
              className="bg-gradient-to-br from-emerald-400/35 via-emerald-400/25 to-emerald-400/15 dark:from-emerald-500/40 dark:via-emerald-500/30 dark:to-emerald-500/15 border border-emerald-500/60 dark:border-emerald-400/60 hover:border-emerald-500/90 dark:hover:border-emerald-300/90 hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer group backdrop-blur-sm"
              onClick={handleGenerateSeed}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg text-white dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600/50 dark:bg-emerald-500/60 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <RefreshCw className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold">Create New Wallet</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">Generate a new 12-word seed phrase for your wallet</p>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-teal-400/35 via-teal-400/25 to-teal-400/15 dark:from-teal-500/40 dark:via-teal-500/30 dark:to-teal-500/15 border border-teal-500/60 dark:border-teal-400/60 hover:border-teal-500/90 dark:hover:border-teal-300/90 hover:shadow-lg hover:shadow-teal-500/20 transition-all cursor-pointer group backdrop-blur-sm"
              onClick={() => setStep("import-wallet")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg text-white dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600/50 dark:bg-teal-500/60 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold">Import Existing Wallet</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">Import a wallet using an existing seed phrase or private key</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generate Seed */}
        {step === "generate-seed" && !confirmedSeed && (
          <Card className="border border-emerald-500/40 bg-white/95 dark:bg-slate-900/95">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Your Seed Phrase</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Write down these 12 words in order. Keep them safe and never share them!
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-400/30 dark:border-emerald-500/40 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-3">
                  {seedPhrase.split(" ").map((word, i) => (
                    <div
                      key={i}
                      className="bg-white/80 dark:bg-slate-800/80 rounded border border-emerald-300/40 dark:border-emerald-600/40 p-2 text-center hover:border-emerald-400/60 dark:hover:border-emerald-400/60 transition-colors"
                    >
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">
                        {i + 1}
                      </span>
                      <span className={`font-mono text-sm text-foreground font-medium ${showSeed ? "" : "blur-sm"}`}>
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSeed(!showSeed)}
                  className="flex-1 bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-400/50 dark:border-emerald-500/50 text-foreground hover:bg-emerald-100/80 dark:hover:bg-emerald-900/70 hover:border-emerald-500/80 dark:hover:border-emerald-400/80 transition-all"
                >
                  {showSeed ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showSeed ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(seedPhrase)}
                  className="flex-1 bg-teal-50/80 dark:bg-teal-950/50 border-teal-400/50 dark:border-teal-500/50 text-foreground hover:bg-teal-100/80 dark:hover:bg-teal-900/70 hover:border-teal-500/80 dark:hover:border-teal-400/80 transition-all"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>

              <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-300/40 dark:border-red-600/40 rounded-lg p-3">
                <p className="text-xs text-red-700 dark:text-red-300/90">
                  <strong>Warning:</strong> Anyone with your seed phrase can access your funds. Store it securely
                  offline.
                </p>
              </div>

              <Button onClick={handleConfirmSeed} className="w-full bg-emerald-600 hover:bg-emerald-700">
                I've Saved My Seed Phrase
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Confirm Seed */}
        {step === "confirm-seed" && confirmedSeed && (
          <Card className="border border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Confirm Your Seed Phrase</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Select the words in the correct order to verify</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Your seed phrase (for reference):</p>
                <div className="flex flex-wrap gap-2">
                  {seedPhrase.split(" ").map((word, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">Verification Complete</p>
                <p className="text-xs text-muted-foreground">Your wallet is secured with your seed phrase</p>
              </div>

              <Button onClick={handleCreateWallet} className="w-full">
                Create Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Import Wallet */}
        {step === "import-wallet" && (
          <Card className="border border-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg">Import Wallet</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Enter your 12-word seed phrase</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={importedSeed}
                onChange={(e) => setImportedSeed(e.target.value)}
                placeholder="Enter your seed phrase separated by spaces..."
                className="w-full h-24 bg-input text-foreground rounded-lg border border-input p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              <div className="text-xs text-muted-foreground">
                Make sure to enter all 12 words separated by spaces, in the correct order.
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("choose-action")
                    setImportedSeed("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleImportWallet} disabled={!importedSeed.trim()} className="flex-1">
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
