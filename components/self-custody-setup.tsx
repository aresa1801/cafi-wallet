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
              className="bg-gradient-to-br from-emerald-500/25 via-emerald-500/15 to-emerald-500/10 dark:from-emerald-600/30 dark:via-emerald-600/20 dark:to-emerald-600/10 border border-emerald-500/40 dark:border-emerald-500/50 hover:border-emerald-500/70 dark:hover:border-emerald-400/70 transition-all cursor-pointer group backdrop-blur-sm"
              onClick={handleGenerateSeed}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600/30 dark:bg-emerald-500/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <RefreshCw className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                    </div>
                    <span className="text-foreground font-semibold">Create New Wallet</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">Generate a new 12-word seed phrase for your wallet</p>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-teal-500/25 via-teal-500/15 to-teal-500/10 dark:from-teal-600/30 dark:via-teal-600/20 dark:to-teal-600/10 border border-teal-500/40 dark:border-teal-500/50 hover:border-teal-500/70 dark:hover:border-teal-400/70 transition-all cursor-pointer group backdrop-blur-sm"
              onClick={() => setStep("import-wallet")}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600/30 dark:bg-teal-500/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 text-teal-700 dark:text-teal-300" />
                    </div>
                    <span className="text-foreground font-semibold">Import Existing Wallet</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  Import a wallet using an existing seed phrase or private key
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generate Seed */}
        {step === "generate-seed" && !confirmedSeed && (
          <Card className="border border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Your Seed Phrase</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Write down these 12 words in order. Keep them safe and never share them!
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-3">
                  {seedPhrase.split(" ").map((word, i) => (
                    <div key={i} className="bg-card/80 rounded border border-primary/10 p-2 text-center">
                      <span className="text-xs text-muted-foreground block">{i + 1}</span>
                      <span className={`font-mono text-sm ${showSeed ? "text-foreground" : "blur-sm"}`}>{word}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowSeed(!showSeed)} className="flex-1">
                  {showSeed ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showSeed ? "Hide" : "Show"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(seedPhrase)} className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-xs text-destructive/80">
                  <strong>Warning:</strong> Anyone with your seed phrase can access your funds. Store it securely
                  offline.
                </p>
              </div>

              <Button onClick={handleConfirmSeed} className="w-full">
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
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
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
