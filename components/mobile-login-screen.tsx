"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { detectMobileWallets, connectToMobileWallet, type MobileWallet } from "@/utils/wallet-detection"
import { Smartphone, Shield, Download, Sparkles, ChevronRight, Wallet } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { SustainabilityOrnaments } from "./sustainability-ornaments"
import { GreenParticles } from "./green-particles"
import { EcoBadge } from "./eco-badge"

interface MobileLoginScreenProps {
  onLogin: (type: "smart" | "self-custody", walletInfo?: any) => void
}

export function MobileLoginScreen({ onLogin }: MobileLoginScreenProps) {
  const [detectedWallets, setDetectedWallets] = useState<MobileWallet[]>([])
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [showAllOptions, setShowAllOptions] = useState(false)

  useEffect(() => {
    const wallets = detectMobileWallets()
    setDetectedWallets(wallets)
  }, [])

  const handleWalletConnect = async (wallet: MobileWallet) => {
    setIsConnecting(wallet.id)
    try {
      const connected = await connectToMobileWallet(wallet)
      if (connected) {
        onLogin("self-custody", { wallet: wallet.name, address: "0x1234...5678" })
      }
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setIsConnecting(null)
    }
  }

  const installedWallets = detectedWallets.filter((w) => w.isInstalled)
  const availableWallets = detectedWallets.filter((w) => !w.isInstalled)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-soft-primary/10 rounded-full blur-3xl animate-gentle-bounce"></div>
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-soft-accent/10 rounded-full blur-3xl animate-gentle-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-soft-secondary/10 rounded-full blur-3xl animate-gentle-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="pt-16 pb-12 px-6 text-center relative">
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          {/* Sustainability Ornaments */}
          <SustainabilityOrnaments variant="floating" />
          <GreenParticles count={15} />

          <div className="relative z-10">
            <div className="relative inline-block mb-6">
              <div className="relative z-10">
                <img
                  src="/images/carbonfi-logo-full.png"
                  alt="CarbonFi"
                  className="h-32 w-auto object-contain mx-auto filter drop-shadow-lg"
                />
              </div>
              <div className="absolute inset-0 bg-soft-primary/20 rounded-2xl blur-2xl animate-soft-glow scale-110"></div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary">Welcome to CarbonFi</h1>
              <div className="flex items-center justify-center gap-3">
                <p className="text-text-secondary dark:text-text-dark-secondary flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-soft-primary" />
                  Sustainable Web3 Wallet
                </p>
                <EcoBadge variant="carbon-neutral" size="sm" />
              </div>
              <SustainabilityOrnaments variant="decorative" className="justify-center mt-2" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 space-y-6">
          {/* Smart Wallet Option */}
          <div className="space-y-4">
            <h3 className="text-text-primary dark:text-text-dark-primary font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-soft-primary" />
              Quick Start
            </h3>

            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-md hover:shadow-soft-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-0">
                <Button
                  onClick={() => onLogin("smart")}
                  className="w-full h-auto p-6 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left justify-start border-0 shadow-none"
                  variant="ghost"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-soft-primary to-soft-secondary rounded-xl flex items-center justify-center shadow-soft">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-text-primary dark:text-text-dark-primary">Smart Wallet</p>
                        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                          Google backup & recovery
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-tertiary dark:text-text-dark-tertiary" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Available Wallets */}
          {availableWallets.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-text-primary dark:text-text-dark-primary font-semibold text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-text-secondary dark:text-text-dark-secondary" />
                  Connect Wallet
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllOptions(!showAllOptions)}
                  className="text-soft-primary hover:text-soft-primary/80 hover:bg-soft-primary/10"
                >
                  {showAllOptions ? "Show Less" : "Show All"}
                </Button>
              </div>

              <div className="space-y-3">
                {(showAllOptions ? availableWallets : availableWallets.slice(0, 2)).map((wallet) => (
                  <Card
                    key={wallet.id}
                    className="bg-white/60 dark:bg-bg-dark-secondary/60 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-soft-md transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                    onClick={() => handleWalletConnect(wallet)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-lg border border-neutral-200 dark:border-neutral-700">
                            {wallet.icon}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary dark:text-text-dark-primary text-sm">
                              {wallet.name}
                            </p>
                            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Tap to install</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-soft-accent" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 space-y-4 relative">
          <SustainabilityOrnaments variant="background" />
          <div className="text-center space-y-3 relative z-10">
            <div className="flex items-center justify-center gap-6 text-xs text-text-tertiary dark:text-text-dark-tertiary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-soft-success rounded-full animate-pulse"></div>
                <span>Secured by blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-soft-primary" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <EcoBadge variant="eco-friendly" size="sm" />
              <EcoBadge variant="sustainable" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
