"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Minus } from "lucide-react"

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
      percentage: total > 0 ? (ethValue / total) * 100 : 0,
      color: "bg-[#627EEA]",
      lightColor: "bg-[#627EEA]/20",
    },
    {
      name: "CAFI Token",
      value: totalCAFI * 0.85,
      percentage: total > 0 ? ((totalCAFI * 0.85) / total) * 100 : 0,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-500/20",
    },
  ]

  return (
    <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4">
          Portfolio Allocation
        </h3>

        <div className="space-y-4">
          {portfolioAllocation.map((asset, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${asset.color}`}></div>
                  <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                    {asset.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary dark:text-text-dark-primary">
                    ${asset.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                    {asset.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <Progress value={Math.max(0, Math.min(100, asset.percentage))} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">
                ${total.toLocaleString()}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Total Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {ethBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {portfolioData.symbol}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">ETH Balance</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <p className="text-2xl font-bold text-emerald-500">+0.0%</p>
              </div>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">24h Change</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
