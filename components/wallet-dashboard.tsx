"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  Send,
  Download,
  TrendingUp,
  Wallet,
  History,
  BarChart3,
  Copy,
  Settings,
  Bell,
  Scan,
  Camera,
  Vote,
} from "lucide-react"
import { ChainSelector } from "./chain-selector"
import { TransactionHistory } from "./transaction-history"
import { CarbonAnalytics } from "./carbon-analytics"
import { CarbonScanner } from "./carbon-scanner"
import { CarbonOffsetHistory } from "./carbon-offset-history"
import { DAOGovernance } from "./dao-governance"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface WalletDashboardProps {
  walletType: "smart" | "self-custody"
}

export function WalletDashboard({ walletType }: WalletDashboardProps) {
  const [selectedChain, setSelectedChain] = useState<"ethereum">("ethereum")
  const [carbonOffset, setCarbonOffset] = useState(12.5) // tons of CO2
  const [carbonGoal] = useState(50) // tons of CO2
  const [showScanner, setShowScanner] = useState(false)
  const [showDAO, setShowDAO] = useState(false)

  const { isConnected, accounts, chainId, balance, disconnect } = useCarbonFiWeb3()

  const currentPortfolio = {
    balance: balance ? Number.parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0",
    usd: "—",
    carbonfi: "0.00",
    change: "+0.0%",
  }
  const totalCarbonFi = 0

  const handleOffsetComplete = (amount: number, type: string) => {
    // Convert kg to tons and add to total offset
    setCarbonOffset((prev) => prev + amount / 1000)
    // Here you would also handle the blockchain transaction
    console.log(`Offset completed: ${amount} kg CO₂ from ${type}`)
  }

  if (showScanner) {
    return <CarbonScanner onClose={() => setShowScanner(false)} onOffsetComplete={handleOffsetComplete} />
  }

  if (showDAO) {
    return <DAOGovernance userTokenBalance={totalCarbonFi} onBack={() => setShowDAO(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border p-4 sticky top-0 z-50 backdrop-blur-lg bg-dark-card/80">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <img src="/images/carbonfi-logo.png" alt="CarbonFi" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-white">CarbonFi</h1>
                <Badge
                  variant="outline"
                  className={`text-xs border-carbon-primary text-carbon-primary ${
                    walletType === "smart"
                      ? "bg-carbon-primary/10"
                      : "bg-carbon-accent/10 border-carbon-accent text-carbon-accent"
                  }`}
                >
                  {walletType === "smart" ? "Smart Wallet" : "Self-Custody"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ChainSelector selectedChain={selectedChain} onChainChange={setSelectedChain} />
            <Button variant="ghost" size="sm" className="text-dark-muted hover:text-white">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-dark-muted hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Carbon Offset Progress */}
        <Card className="bg-gradient-to-br from-carbon-primary via-carbon-accent to-carbon-purple text-white border-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-carbon-primary/20 to-carbon-purple/20 backdrop-blur-sm"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center space-x-2">
                <Leaf className="w-6 h-6" />
                <span>Carbon Impact</span>
              </CardTitle>
              <TrendingUp className="w-6 h-6 animate-float" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold">{carbonOffset.toFixed(1)} tons</p>
                  <p className="text-white/80 text-sm">CO₂ Offset This Year</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Goal: {carbonGoal} tons</p>
                  <p className="text-xs text-carbon-yellow font-semibold">
                    {Math.round((carbonOffset / carbonGoal) * 100)}% Complete
                  </p>
                </div>
              </div>
              <Progress value={(carbonOffset / carbonGoal) * 100} className="h-3 bg-white/20" />
              <p className="text-xs text-white/90 flex items-center gap-1">
                🌱 You've planted equivalent of <span className="text-carbon-yellow font-semibold">125 trees</span> this
                year!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Balance */}
        <Card className="bg-dark-card border-dark-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center space-x-2 text-white">
                <Wallet className="w-6 h-6 text-carbon-primary" />
                <span>Portfolio</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-success font-semibold">{currentPortfolio.change}</span>
                <Button variant="ghost" size="sm" className="text-dark-muted hover:text-white">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-white">${currentPortfolio.usd}</p>
              <p className="text-dark-muted text-sm">Total Balance</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-carbon-accent/10 to-carbon-primary/10 rounded-xl border border-carbon-accent/20">
                <p className="font-bold text-lg text-white">{currentPortfolio.balance}</p>
                <p className="text-xs text-carbon-accent uppercase font-semibold">ETH</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-carbon-primary/10 to-carbon-secondary/10 rounded-xl border border-carbon-primary/20">
                <p className="font-bold text-lg text-white">{currentPortfolio.carbonfi}</p>
                <p className="text-xs text-carbon-primary font-semibold">CARBONFI</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <Button className="flex-col h-20 bg-gradient-to-br from-carbon-primary to-carbon-secondary hover:from-carbon-secondary hover:to-carbon-primary text-dark-bg font-semibold transition-all duration-300 hover:scale-105">
                  <Send className="w-6 h-6 mb-1" />
                  <span className="text-sm">Send</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-col h-20 border-2 border-carbon-accent text-carbon-accent hover:bg-carbon-accent hover:text-dark-bg transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-6 h-6 mb-1" />
                  <span className="text-sm">Receive</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowScanner(true)}
                  className="flex-col h-20 bg-gradient-to-br from-carbon-orange to-carbon-pink hover:from-carbon-pink hover:to-carbon-orange text-white font-semibold transition-all duration-300 hover:scale-105 animate-glow-pulse"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-sm">Scan</span>
                </Button>
                <Button
                  onClick={() => setShowDAO(true)}
                  className="flex-col h-20 bg-gradient-to-br from-carbon-purple to-carbon-accent hover:from-carbon-accent hover:to-carbon-purple text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Vote className="w-6 h-6 mb-1" />
                  <span className="text-sm">DAO</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for History, Analytics, and Offsets */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-dark-surface border border-dark-border">
            <TabsTrigger
              value="history"
              className="flex items-center space-x-2 data-[state=active]:bg-carbon-primary data-[state=active]:text-dark-bg"
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2 data-[state=active]:bg-carbon-accent data-[state=active]:text-dark-bg"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="offsets"
              className="flex items-center space-x-2 data-[state=active]:bg-carbon-orange data-[state=active]:text-dark-bg"
            >
              <Scan className="w-4 h-4" />
              <span>Offsets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-4">
            <TransactionHistory selectedChain={selectedChain} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <CarbonAnalytics carbonOffset={carbonOffset} />
          </TabsContent>

          <TabsContent value="offsets" className="mt-4">
            <CarbonOffsetHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
