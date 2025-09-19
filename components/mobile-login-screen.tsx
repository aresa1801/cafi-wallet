"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Leaf, Zap, Users } from "lucide-react"
import { CarbonFiLogo } from "@/components/carbonfi-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { SustainabilityOrnaments } from "@/components/sustainability-ornaments"
import { GreenParticles } from "@/components/green-particles"
import { EcoBadge } from "@/components/eco-badge"

interface MobileLoginScreenProps {
  onLogin: (type: "smart" | "self-custody", info?: any) => void
}

export function MobileLoginScreen({ onLogin }: MobileLoginScreenProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleWalletSelect = async (type: "smart" | "self-custody") => {
    setIsConnecting(true)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockWalletInfo = {
      type,
      address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      balance: "1.5 ETH",
      network: "Ethereum Mainnet",
    }

    onLogin(type, mockWalletInfo)
    setIsConnecting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 relative overflow-hidden">
      <SustainabilityOrnaments />
      <GreenParticles />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <EcoBadge variant="eco-friendly" />
          <EcoBadge variant="carbon-neutral" />
        </div>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <CarbonFiLogo className="w-20 h-20 mx-auto" />
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to CarbonFi</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The sustainable Web3 wallet for a greener future</p>
          <div className="flex justify-center gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Leaf className="w-3 h-3 mr-1" />
              Carbon Neutral
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="w-full max-w-md space-y-4">
          <Card
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800 cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-105"
            onClick={() => handleWalletSelect("smart")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg">Smart Wallet</span>
                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                    Recommended
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
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
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800 cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-105"
            onClick={() => handleWalletSelect("self-custody")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Self-Custody Wallet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Full control with traditional private key management
              </p>
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
        <div className="w-full max-w-md mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Why Choose CarbonFi?</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Carbon Tracking</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">Monitor your carbon footprint</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">DAO Governance</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">Participate in decisions</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isConnecting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white dark:bg-gray-800 p-6">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-900 dark:text-white font-medium">Connecting to CarbonFi...</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Setting up your sustainable wallet</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
