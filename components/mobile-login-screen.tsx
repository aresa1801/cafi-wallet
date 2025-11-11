"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Leaf, Zap, Users, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SustainabilityBackground } from "@/components/sustainability-background"
import Image from "next/image"

interface MobileLoginScreenProps {
  onLogin: (type: "smart" | "self-custody", info?: any) => void
}

export function MobileLoginScreen({ onLogin }: MobileLoginScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<"smart" | "self-custody" | null>(null)

  const handleWalletSelect = async (type: "smart" | "self-custody") => {
    setSelectedWallet(type)
    setIsConnecting(true)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (type === "self-custody") {
      // For self-custody, we'll pass a flag to show setup screen
      onLogin(type, { setupRequired: true })
    } else {
      const mockWalletInfo = {
        type,
        address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        balance: "1.5 ETH",
        network: "Ethereum Mainnet",
      }
      onLogin(type, mockWalletInfo)
    }
    setIsConnecting(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SustainabilityBackground />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-muted-foreground">Eco-Certified</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 md:p-6">
        {/* Logo and Title */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="relative inline-block mb-8">
            <Image
              src="/images/carbonfi-icon.png"
              alt="CarbonFi Logo"
              width={31}
              height={31}
              className="mx-auto"
              priority
            />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Welcome to <span className="text-primary">CarbonFi</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">The sustainable Web3 wallet for a greener future</p>

          <div className="flex justify-center gap-3 flex-wrap">
            <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
              <Leaf className="w-3 h-3 mr-2" />
              Carbon Neutral
            </Badge>
            <Badge className="bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 transition-colors">
              <Shield className="w-3 h-3 mr-2" />
              Secure
            </Badge>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="w-full max-w-md space-y-4 mb-8">
          <Card
            className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 dark:from-primary/25 dark:via-primary/15 dark:to-primary/5 backdrop-blur-sm border border-primary/30 dark:border-primary/40 cursor-pointer transition-all duration-300 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 hover:from-primary/20 hover:via-primary/15 hover:to-primary/10 group"
            onClick={() => handleWalletSelect("smart")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-lg">Smart Wallet</span>
                    <Badge className="ml-2 bg-primary/30 text-primary text-xs border-0">Recommended</Badge>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Advanced features with social recovery and gas optimization
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  Social Recovery
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Gas Optimization
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Multi-sig
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-secondary/15 via-secondary/10 to-secondary/5 dark:from-secondary/25 dark:via-secondary/15 dark:to-secondary/5 backdrop-blur-sm border border-secondary/30 dark:border-secondary/40 cursor-pointer transition-all duration-300 hover:border-secondary/60 hover:shadow-lg hover:shadow-secondary/20 hover:from-secondary/20 hover:via-secondary/15 hover:to-secondary/10 group"
            onClick={() => handleWalletSelect("self-custody")}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/60 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg">Self-Custody Wallet</span>
                </div>
                <ArrowRight className="w-5 h-5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Full control with traditional private key management</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  Private Keys
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Full Control
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Hardware Support
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold text-foreground mb-6 text-center">Why Choose CarbonFi?</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Carbon Tracking</h4>
              <p className="text-xs text-muted-foreground">Monitor your footprint</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary/20 transition-colors duration-300">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">DAO Governance</h4>
              <p className="text-xs text-muted-foreground">Participate in decisions</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isConnecting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-card p-8">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-foreground font-medium">
                  {selectedWallet === "self-custody" ? "Setting up wallet..." : "Connecting to CarbonFi..."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedWallet === "self-custody"
                    ? "Preparing your self-custody wallet"
                    : "Setting up your sustainable wallet"}
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
