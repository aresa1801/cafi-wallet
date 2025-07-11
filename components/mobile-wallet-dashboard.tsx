"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  BarChart3,
  Scan,
  Vote,
  User,
  Send,
  Download,
  Camera,
  Bell,
  Settings,
  Leaf,
  TrendingUp,
  Wallet,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
  History,
} from "lucide-react"
import { MobileChainSelector } from "./mobile-chain-selector"
import { CarbonScanner } from "./carbon-scanner"
import { DAOGovernance } from "./dao-governance"
import { CarbonAnalytics } from "./carbon-analytics"
import { CarbonOffsetHistory } from "./carbon-offset-history"
import { CarbonFiLogo } from "./carbonfi-logo"
import { ThemeToggle } from "./theme-toggle"
import { SustainabilityOrnaments } from "./sustainability-ornaments"
import { GreenParticles } from "./green-particles"
import { EcoBadge } from "./eco-badge"
import { WalletConnectButton } from "./wallet-connect-button"

const CAFI_CONTRACT_ADDRESS = "0xa5359E55423E47Afe93D86b1bdaD827f1C1c16EB"

interface MobileWalletDashboardProps {
  walletType: "smart" | "self-custody"
  walletInfo?: any
}

type TabType = "home" | "offsets" | "analytics" | "dao" | "profile"

export function MobileWalletDashboard({ walletType, walletInfo }: MobileWalletDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [selectedChain, setSelectedChain] = useState<"arbitrum" | "base" | "polygon">("arbitrum")
  const [carbonOffset, setCarbonOffset] = useState(12.5)
  const [carbonGoal] = useState(50)
  const [showScanner, setShowScanner] = useState(false)
  const [showDAO, setShowDAO] = useState(false)

  // Update the portfolioData object to include ETH, BASE, POLYGON, and CAFI assets
  const portfolioData = {
    arbitrum: {
      balance: "2.45",
      symbol: "ETH",
      usd: "6,125.50",
      cafi: "1,250.00",
      change: "+12.5%",
      chainColor: "text-blue-500",
      chainBg: "bg-blue-500/10",
      chainBorder: "border-blue-500/20",
    },
    base: {
      balance: "3.78",
      symbol: "ETH",
      usd: "9,450.00",
      cafi: "850.00",
      change: "+8.3%",
      chainColor: "text-indigo-500",
      chainBg: "bg-indigo-500/10",
      chainBorder: "border-indigo-500/20",
    },
    polygon: {
      balance: "15,420.67",
      symbol: "MATIC",
      usd: "12,336.54",
      cafi: "2,100.00",
      change: "+15.7%",
      chainColor: "text-purple-500",
      chainBg: "bg-purple-500/10",
      chainBorder: "border-purple-500/20",
    },
  }

  const currentPortfolio = portfolioData[selectedChain]
  const totalCafi = Object.values(portfolioData).reduce((sum, data) => sum + Number.parseFloat(data.cafi), 0)

  const handleOffsetComplete = (amount: number, type: string) => {
    setCarbonOffset((prev) => prev + amount / 1000)
    console.log(`Offset completed: ${amount} kg CO₂ from ${type}`)
  }

  const recentTransactions = [
    {
      id: "1",
      type: "carbon-offset",
      amount: "2.5 tons CO₂",
      status: "success",
      time: "2 hours ago",
      icon: Leaf,
      color: "text-soft-success",
    },
    {
      id: "2",
      type: "send",
      amount: "100 CAFI",
      status: "success",
      time: "1 day ago",
      icon: ArrowUpRight,
      color: "text-soft-warning",
    },
    {
      id: "3",
      type: "receive",
      amount: "50 ARB",
      status: "success",
      time: "2 days ago",
      icon: ArrowDownLeft,
      color: "text-soft-accent",
    },
  ]

  if (showScanner) {
    return <CarbonScanner onClose={() => setShowScanner(false)} onOffsetComplete={handleOffsetComplete} />
  }

  if (showDAO) {
    return <DAOGovernance userTokenBalance={totalCafi} onBack={() => setShowDAO(false)} />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="text-center py-8 relative">
              <GreenParticles count={12} />
              <SustainabilityOrnaments variant="floating" />

              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <div className="relative z-10">
                    <img
                      src="/images/carbonfi-logo-full.png"
                      alt="CarbonFi"
                      className="h-24 w-auto object-contain mx-auto filter drop-shadow-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-soft-primary/20 rounded-2xl blur-2xl animate-soft-glow scale-110"></div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-text-primary dark:text-text-dark-primary">Welcome back!</h2>
                  <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                    Building a sustainable future together
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <EcoBadge variant="eco-friendly" size="sm" />
                    <EcoBadge variant="green-energy" size="sm" />
                  </div>
                  <SustainabilityOrnaments variant="decorative" className="justify-center mt-2" />
                </div>
              </div>
            </div>

            {/* Portfolio Balance */}
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-soft-primary" />
                    <span className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">
                      Portfolio
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-soft-success font-medium">{currentPortfolio.change}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-text-tertiary dark:text-text-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-text-primary dark:text-text-dark-primary">
                    ${currentPortfolio.usd}
                  </p>
                  <p className="text-text-secondary dark:text-text-dark-secondary text-sm">Total Balance</p>
                </div>

                {/* Update the portfolio display section in the home tab */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div
                    className={`text-center p-4 bg-gradient-to-br ${currentPortfolio.chainBg} to-soft-primary/10 rounded-xl border ${currentPortfolio.chainBorder}`}
                  >
                    <p className="font-bold text-lg text-text-primary dark:text-text-dark-primary">
                      {currentPortfolio.balance}
                    </p>
                    <p className={`text-xs ${currentPortfolio.chainColor} uppercase font-medium`}>
                      {currentPortfolio.symbol} on {selectedChain}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-soft-primary/10 to-soft-secondary/10 rounded-xl border border-soft-primary/20">
                    <p className="font-bold text-lg text-text-primary dark:text-text-dark-primary">
                      {currentPortfolio.cafi}
                    </p>
                    <p className="text-xs text-soft-primary font-medium">CAFI</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3">
                  <Button className="flex-col h-16 bg-gradient-to-br from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium transition-all duration-300 hover:scale-105 shadow-soft">
                    <Send className="w-5 h-5 mb-1" />
                    <span className="text-xs">Send</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-16 border-soft-accent/30 text-soft-accent hover:bg-soft-accent/10 hover:border-soft-accent/50 transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-5 h-5 mb-1" />
                    <span className="text-xs">Receive</span>
                  </Button>
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="flex-col h-16 bg-gradient-to-br from-soft-warning to-soft-error hover:from-soft-warning/90 hover:to-soft-error/90 text-white font-medium transition-all duration-300 hover:scale-105 shadow-soft"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-xs">Scan</span>
                  </Button>
                  <Button
                    onClick={() => setShowDAO(true)}
                    className="flex-col h-16 bg-gradient-to-br from-soft-secondary to-soft-accent hover:from-soft-secondary/90 hover:to-soft-accent/90 text-white font-medium transition-all duration-300 hover:scale-105 shadow-soft"
                  >
                    <Vote className="w-5 h-5 mb-1" />
                    <span className="text-xs">DAO</span>
                  </Button>
                </div>

                {/* Portfolio Assets Breakdown */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-soft-accent" />
                    Asset Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* ETH on Arbitrum */}
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-blue-500 font-bold text-sm">ETH</span>
                        </div>
                        <p className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
                          {portfolioData.arbitrum.balance}
                        </p>
                        <p className="text-xs text-blue-500 font-medium">Arbitrum</p>
                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                          ${(Number.parseFloat(portfolioData.arbitrum.balance) * 2500).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    {/* ETH on Base */}
                    <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-indigo-500 font-bold text-sm">ETH</span>
                        </div>
                        <p className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
                          {portfolioData.base.balance}
                        </p>
                        <p className="text-xs text-indigo-500 font-medium">Base</p>
                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                          ${(Number.parseFloat(portfolioData.base.balance) * 2500).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    {/* MATIC on Polygon */}
                    <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-purple-500 font-bold text-xs">MATIC</span>
                        </div>
                        <p className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
                          {Number.parseFloat(portfolioData.polygon.balance).toLocaleString()}
                        </p>
                        <p className="text-xs text-purple-500 font-medium">Polygon</p>
                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                          ${(Number.parseFloat(portfolioData.polygon.balance) * 0.8).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>

                    {/* CAFI Token */}
                    <Card className="bg-gradient-to-br from-soft-primary/10 to-soft-secondary/10 border-soft-primary/20 shadow-soft relative overflow-hidden">
                      <GreenParticles count={6} />
                      <CardContent className="p-4 text-center relative z-10">
                        <div className="w-10 h-10 bg-soft-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Leaf className="w-5 h-5 text-soft-primary" />
                        </div>
                        <p className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
                          {totalCafi.toLocaleString()}
                        </p>
                        <p className="text-xs text-soft-primary font-medium">CAFI</p>
                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                          ${(totalCafi * 0.85).toLocaleString()}
                        </p>
                        <EcoBadge variant="carbon-neutral" size="sm" className="mt-1" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carbon Impact Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-soft-success/10 to-soft-primary/10 border-soft-success/20 shadow-soft relative overflow-hidden">
                <SustainabilityOrnaments variant="floating" />
                <CardContent className="p-4 text-center relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Leaf className="w-6 h-6 text-soft-success" />
                    <EcoBadge variant="carbon-neutral" size="sm" />
                  </div>
                  <p className="text-xl font-bold text-text-primary dark:text-text-dark-primary">
                    {carbonOffset.toFixed(1)}
                  </p>
                  <p className="text-xs text-soft-success font-medium">Tons CO₂ Offset</p>
                  <div className="mt-2">
                    <Progress
                      value={(carbonOffset / carbonGoal) * 100}
                      className="h-2 bg-neutral-200 dark:bg-neutral-700"
                    />
                    <p className="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-1">
                      {Math.round((carbonOffset / carbonGoal) * 100)}% of goal
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-soft-accent/10 to-soft-secondary/10 border-soft-accent/20 shadow-soft relative overflow-hidden">
                <GreenParticles count={8} />
                <CardContent className="p-4 text-center relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-6 h-6 text-soft-accent" />
                    <EcoBadge variant="sustainable" size="sm" />
                  </div>
                  <p className="text-xl font-bold text-text-primary dark:text-text-dark-primary">125</p>
                  <p className="text-xs text-soft-accent font-medium">Trees Equivalent</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className="text-xs text-soft-success">+12%</span>
                    <span className="text-xs text-text-tertiary dark:text-text-dark-tertiary">this month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <History className="w-5 h-5 text-soft-accent" />
                    <span className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">
                      Recent Activity
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-soft-primary hover:text-soft-primary/80 hover:bg-soft-primary/10"
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentTransactions.map((tx) => {
                    const IconComponent = tx.icon
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center border border-neutral-200 dark:border-neutral-600 shadow-soft">
                            <IconComponent className={`w-5 h-5 ${tx.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary dark:text-text-dark-primary capitalize text-sm">
                              {tx.type.replace("-", " ")}
                            </p>
                            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{tx.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-text-primary dark:text-text-dark-primary text-sm">
                            {tx.amount}
                          </p>
                          <Badge
                            variant="default"
                            className="text-xs bg-soft-success/20 text-soft-success border-soft-success/30 font-medium mt-1"
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "offsets":
        return <CarbonOffsetHistory />

      case "analytics":
        return <CarbonAnalytics carbonOffset={carbonOffset} />

      case "dao":
        return <DAOGovernance userTokenBalance={totalCafi} onBack={() => setActiveTab("home")} />

      case "profile":
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full flex items-center justify-center shadow-soft">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary">
                      {walletInfo?.wallet || "CarbonFi"} Wallet
                    </h3>
                    <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
                      {walletInfo?.address || "0x1234...5678"}
                    </p>
                    <Badge
                      className={`mt-2 ${
                        walletType === "smart"
                          ? "bg-soft-primary/20 text-soft-primary border-soft-primary/30"
                          : "bg-soft-accent/20 text-soft-accent border-soft-accent/30"
                      }`}
                    >
                      {walletType === "smart" ? "Smart Wallet" : "Self-Custody"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Options */}
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4">Settings</h4>
                <div className="space-y-3">
                  {[
                    { icon: Bell, label: "Notifications", value: "Enabled" },
                    { icon: Settings, label: "Preferences", value: "Customize" },
                    { icon: Leaf, label: "Carbon Goals", value: `${carbonGoal} tons/year` },
                    { icon: Vote, label: "DAO Participation", value: "Active" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 text-soft-primary" />
                        <span className="text-text-primary dark:text-text-dark-primary font-medium">{item.label}</span>
                      </div>
                      <span className="text-text-secondary dark:text-text-dark-secondary text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "offsets", label: "Offsets", icon: Scan },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "dao", label: "DAO", icon: Vote },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary flex flex-col">
      {/* Header */}
      <div className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 p-4 sticky top-0 z-40 shadow-soft relative">
        <SustainabilityOrnaments variant="floating" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <CarbonFiLogo variant="icon" size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-text-primary dark:text-text-dark-primary">CarbonFi</h1>
                <EcoBadge variant="carbon-neutral" size="sm" />
              </div>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Sustainable Web3 Wallet</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MobileChainSelector selectedChain={selectedChain} onChainChange={setSelectedChain} />
            <WalletConnectButton />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-text-tertiary dark:text-text-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 pb-24">{renderTabContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-bg-dark-secondary/90 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-700 p-2 z-50 shadow-soft-lg">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            const isActive = activeTab === tab.id
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-col h-14 w-14 transition-all duration-300 ${
                  isActive
                    ? "text-soft-primary bg-soft-primary/10 hover:bg-soft-primary/20"
                    : "text-text-tertiary dark:text-text-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <IconComponent className={`w-5 h-5 mb-1 ${isActive ? "animate-scale-in" : ""}`} />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-soft-primary rounded-full"></div>
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
