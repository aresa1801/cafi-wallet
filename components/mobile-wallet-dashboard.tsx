"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Send, QrCode, Leaf, TrendingUp, Users, RefreshCw, Wifi, WifiOff, Eye, EyeOff } from "lucide-react"
import { CarbonFiLogo } from "@/components/carbonfi-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { SustainabilityOrnaments } from "@/components/sustainability-ornaments"
import { GreenParticles } from "@/components/green-particles"
import { EcoBadge } from "@/components/eco-badge"
import { PortfolioStats } from "@/components/portfolio-stats"
import { MobileChainSelector } from "@/components/mobile-chain-selector"
import { TransactionHistory } from "@/components/transaction-history"
import { CarbonAnalytics } from "@/components/carbon-analytics"
import { CarbonOffsetHistory } from "@/components/carbon-offset-history"
import { QRWalletScanner } from "@/components/qr-wallet-scanner"
import { CarbonScanner } from "@/components/carbon-scanner"
import { DAOGovernance } from "@/components/dao-governance"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface MobileWalletDashboardProps {
  walletType: "smart" | "self-custody"
  walletInfo?: any
}

export function MobileWalletDashboard({ walletType, walletInfo }: MobileWalletDashboardProps) {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [showBalance, setShowBalance] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { isConnected, accounts, chainId, balance, connectedDApp, refreshBalance, connect, disconnect } =
    useCarbonFiWeb3()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getChainName = (chainId: string) => {
    const chains: { [key: string]: string } = {
      "0x1": "Ethereum",
      "0xa4b1": "Arbitrum",
      "0x2105": "Base",
      "0x89": "Polygon",
      "0x38": "BSC",
    }
    return chains[chainId] || "Unknown"
  }

  const portfolioData = {
    arbitrum: { balance: "1.25", symbol: "ETH", usd: "3,487.50", cafi: "2,500", change: "+5.2%" },
    base: { balance: "0.85", symbol: "ETH", usd: "2,369.50", cafi: "1,800", change: "+3.1%" },
    polygon: { balance: "50.00", symbol: "MATIC", usd: "22.50", cafi: "45", change: "-1.2%" },
  }

  if (activeTab === "scanner") {
    return <QRWalletScanner onBack={() => setActiveTab("portfolio")} />
  }

  if (activeTab === "carbon-scanner") {
    return <CarbonScanner onBack={() => setActiveTab("portfolio")} />
  }

  if (activeTab === "governance") {
    return <DAOGovernance onBack={() => setActiveTab("portfolio")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 relative overflow-hidden">
      <SustainabilityOrnaments />
      <GreenParticles />

      {/* Header */}
      <div className="relative z-10 p-4 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CarbonFiLogo className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">CarbonFi</h1>
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                  {isConnected ? (
                    <>
                      <Wifi className="w-3 h-3 mr-1" /> Connected
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 mr-1" /> Disconnected
                    </>
                  )}
                </Badge>
                {connectedDApp && (
                  <Badge variant="outline" className="text-xs">
                    {connectedDApp}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <EcoBadge />
          </div>
        </div>

        {/* Wallet Info */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {accounts[0] ? formatAddress(accounts[0]) : "Not connected"}
                </span>
                <MobileChainSelector />
              </div>
              <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="p-1">
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {showBalance ? `${balance} ETH` : "••••"}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)} className="p-1">
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {showBalance ? "$2,847.50" : "••••"} • {getChainName(chainId)}
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-1" />
                  Receive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="portfolio" className="flex flex-col gap-1 py-3">
              <Wallet className="h-4 w-4" />
              <span className="text-xs">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="carbon" className="flex flex-col gap-1 py-3">
              <Leaf className="h-4 w-4" />
              <span className="text-xs">Carbon</span>
            </TabsTrigger>
            <TabsTrigger value="defi" className="flex flex-col gap-1 py-3">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">DeFi</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex flex-col gap-1 py-3">
              <Users className="h-4 w-4" />
              <span className="text-xs">Social</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioStats portfolioData={portfolioData} />

            <div className="grid grid-cols-2 gap-4">
              <Card
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800 cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors"
                onClick={() => setActiveTab("scanner")}
              >
                <CardContent className="p-4 text-center">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold text-sm">Connect dApp</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scan QR code</p>
                </CardContent>
              </Card>

              <Card
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800 cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors"
                onClick={() => setActiveTab("carbon-scanner")}
              >
                <CardContent className="p-4 text-center">
                  <Leaf className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold text-sm">Carbon Scanner</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scan receipts</p>
                </CardContent>
              </Card>
            </div>

            <TransactionHistory />
          </TabsContent>

          <TabsContent value="carbon" className="space-y-4">
            <CarbonAnalytics />
            <CarbonOffsetHistory />
          </TabsContent>

          <TabsContent value="defi" className="space-y-4">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  DeFi Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">DeFi features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800 cursor-pointer hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors"
              onClick={() => setActiveTab("governance")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  DAO Governance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Participate in CarbonFi governance and vote on proposals.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">View Proposals</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
