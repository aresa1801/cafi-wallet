"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"

interface PortfolioStatsProps {
  portfolioData: {
    balance: string
    symbol: string
    usd: string
    cafi: string
    change: string
  }
}

export function PortfolioStats({ portfolioData }: PortfolioStatsProps) {
  const ethValue = Number.parseFloat(portfolioData.usd.replace(",", "")) || 0
  const ethBalance = Number.parseFloat(portfolioData.balance) || 0
  const totalCAFI = Number.parseFloat(portfolioData.cafi.replace(",", "")) || 0
  const total = ethValue + totalCAFI * 0.85

  const portfolioAllocation = [
    {
      name: "Ethereum Mainnet",
      value: ethValue,
      percentage: total > 0 ? (ethValue / total) * 100 : 90,
      color: "bg-[#627EEA]",
      lightColor: "bg-[#627EEA]/20",
    },
    {
      name: "CAFI Token",
      value: totalCAFI * 0.85,
      percentage: total > 0 ? ((totalCAFI * 0.85) / total) * 100 : 10,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-500/20",
    },
  ]

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">Portfolio Allocation</h3>

        <div className="space-y-4">
          {portfolioAllocation.map((asset, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${asset.color}`}></div>
                  <span className="text-sm font-medium text-white/70">{asset.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white/90">
                    ${asset.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-white/40">{asset.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <Progress
                value={Math.max(0, Math.min(100, asset.percentage))}
                className="h-2 bg-white/10"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-white/40">ETH Balance</p>
            <p className="text-lg font-bold text-white">
              {ethBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {portfolioData.symbol}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">24h Change</p>
            <div className="flex items-center justify-end gap-1">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <p className="text-lg font-bold text-emerald-400">0.0%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
