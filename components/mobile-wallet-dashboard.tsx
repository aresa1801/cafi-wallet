"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Send,
  Leaf,
  RefreshCw,
  Eye,
  EyeOff,
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Settings,
  Copy,
  Check,
  Sparkles,
  LogOut,
  ShieldCheck,
  Activity,
  ScanLine,
  Globe,
} from "lucide-react"
import { PortfolioStats } from "@/components/portfolio-stats"
import { TransactionHistory } from "@/components/transaction-history"
import { CarbonAnalytics } from "@/components/carbon-analytics"
import { CarbonOffsetHistory } from "@/components/carbon-offset-history"
import { QRWalletScanner } from "@/components/qr-wallet-scanner"
import { SendEthDialog } from "@/components/send-eth-dialog"
import { ReceiveDialog } from "@/components/receive-dialog"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface MobileWalletDashboardProps {
  walletType: "smart" | "self-custody"
  walletInfo?: any
}

type TabKey = "home" | "activity" | "carbon" | "settings"

export function MobileWalletDashboard({ walletType, walletInfo }: MobileWalletDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("home")
  const [showBalance, setShowBalance] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [carbonOffset, setCarbonOffset] = useState(12.5)
  const [sendOpen, setSendOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const { isConnected, accounts, balance, refreshBalance, disconnect } = useCarbonFiWeb3()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleCopyAddress = () => {
    if (!accounts[0]) return
    navigator.clipboard.writeText(accounts[0])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const portfolioData = {
    balance: balance ? Number.parseFloat(balance).toFixed(4) : "0",
    symbol: "ETH",
    usd: "—",
    cafi: "0",
    change: "+0.0%",
  }

  const navItems: { key: TabKey; label: string; icon: typeof Home }[] = [
    { key: "home", label: "Home", icon: Home },
    { key: "activity", label: "Activity", icon: Activity },
    { key: "carbon", label: "Carbon", icon: Leaf },
    { key: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#0B1210] text-foreground relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-green-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-md px-4 pb-32 pt-5">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/30">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">CarbonFi Wallet</p>
              <p className="mt-0.5 text-[11px] text-emerald-400/80">Ethereum Mainnet</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`gap-1.5 border-emerald-500/40 text-[11px] ${
              isConnected ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-400"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-gray-400"}`} />
            {isConnected ? "Connected" : "Offline"}
          </Badge>
        </div>

        {/* ======================= HOME TAB ======================= */}
        {activeTab === "home" && (
          <>
            {/* Balance Hero Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-green-700/20 to-black p-5 shadow-2xl shadow-emerald-900/40">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-teal-400/10 blur-3xl" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-200/60">
                    Total Balance
                  </span>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="rounded-lg p-1.5 text-emerald-200/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <div className="mb-1 flex items-center gap-2">
                  <span className="text-4xl font-extrabold tracking-tight text-white">
                    {showBalance ? `${balance} ` : "•••••• "}
                  </span>
                  <span className="text-xl font-bold text-emerald-300">ETH</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="ml-1 rounded-lg p-1.5 text-emerald-200/70 transition hover:bg-white/10 hover:text-white"
                  >
                    {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mb-5 flex items-center gap-1.5 text-sm text-emerald-100/70">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Carbon-Neutral Portfolio</span>
                </div>

                <button
                  onClick={handleCopyAddress}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {accounts[0] ? formatAddress(accounts[0]) : "Not connected"}
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-white/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-5 grid grid-cols-4 gap-3">
              <button
                onClick={() => setSendOpen(true)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-4 transition hover:bg-white/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/20">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-white/80">Send</span>
              </button>
              <button
                onClick={() => setReceiveOpen(true)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-4 transition hover:bg-white/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 shadow-lg shadow-teal-500/20">
                  <ArrowDownLeft className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-white/80">Receive</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-4 transition hover:bg-white/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-emerald-600 shadow-lg shadow-lime-500/20">
                  <Repeat className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-white/80">Swap</span>
              </button>
              <button
                onClick={() => setActiveTab("carbon")}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-4 transition hover:bg-white/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-lg shadow-green-500/20">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-white/80">Carbon</span>
              </button>
            </div>

            {/* Portfolio Allocation */}
            <div className="mt-5">
              <PortfolioStats portfolioData={portfolioData} />
            </div>

            {/* Assets */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold text-white">Assets</span>
                <button
                  onClick={() => setActiveTab("activity")}
                  className="text-[11px] font-medium text-emerald-400/80 hover:text-emerald-300"
                >
                  View all →
                </button>
              </div>
              <button
                onClick={() => setActiveTab("activity")}
                className="flex w-full items-center gap-3 border-t border-white/5 px-4 py-3.5 transition hover:bg-white/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#627EEA]/20 ring-1 ring-[#627EEA]/40">
                  <span className="text-sm font-bold text-[#8ea7ff]">Ξ</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">Ethereum</p>
                  <p className="text-xs text-white/40">ETH</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{showBalance ? balance : "••••"}</p>
                  <p className="text-xs text-white/40">— USD</p>
                </div>
              </button>
              <div className="flex w-full items-center gap-3 border-t border-white/5 px-4 py-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/40">
                  <Leaf className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">CarbonFi Token</p>
                  <p className="text-xs text-white/40">CAFI</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">0</p>
                  <p className="text-xs text-white/40">— USD</p>
                </div>
              </div>
            </div>

            {/* Carbon summary */}
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-4">
              <div className="mb-2 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-200">Carbon Offset</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {carbonOffset} <span className="text-sm font-medium text-emerald-300">ton CO₂</span>
              </p>
              <p className="mt-1 text-xs text-white/50">
                Offset karbon lewat dMRV &amp; verifikasi Athlas Verity
              </p>
            </div>
          </>
        )}

        {/* ======================= ACTIVITY TAB ======================= */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Activity</h2>
              <p className="text-xs text-white/40">Riwayat transaksi Ethereum Mainnet</p>
            </div>
            <TransactionHistory selectedChain="ethereum" />
          </div>
        )}

        {/* ======================= CARBON TAB ======================= */}
        {activeTab === "carbon" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Carbon Hub</h2>
                <p className="text-xs text-white/40">Offset &amp; verifikasi karbon</p>
              </div>
              <Button
                onClick={() => setScannerOpen(true)}
                variant="outline"
                size="sm"
                className="gap-1.5 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
              >
                <ScanLine className="h-4 w-4" />
                Scan
              </Button>
            </div>
            <CarbonAnalytics carbonOffset={carbonOffset} />
            <CarbonOffsetHistory />
          </div>
        )}

        {/* ======================= SETTINGS TAB ======================= */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Settings</h2>
              <p className="text-xs text-white/40">Manajemen wallet &amp; account</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">Account</p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white">
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {accounts[0] ? formatAddress(accounts[0]) : "Not connected"}
                  </p>
                  <p className="text-xs text-emerald-400/80">{walletType === "self-custody" ? "Self-Custody" : "Smart Wallet"}</p>
                </div>
                <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  Secure
                </Badge>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Globe className="h-4 w-4 text-emerald-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Network</p>
                  <p className="text-xs text-white/40">Ethereum Mainnet (chainId 1)</p>
                </div>
              </div>
            </div>

            <Button
              onClick={disconnect}
              variant="outline"
              className="w-full gap-2 border-red-500/40 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Disconnect Wallet
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-white/10 bg-[#0B1210]/90 backdrop-blur-xl">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`relative flex flex-col items-center gap-1 py-3 transition ${
                  active ? "text-emerald-400" : "text-white/40 hover:text-white/70"
                }`}
              >
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-emerald-400" />
                )}
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <SendEthDialog open={sendOpen} onOpenChange={setSendOpen} />
      <ReceiveDialog open={receiveOpen} onOpenChange={setReceiveOpen} />
      {scannerOpen && <QRWalletScanner onBack={() => setScannerOpen(false)} />}
    </div>
  )
}
