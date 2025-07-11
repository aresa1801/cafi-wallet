"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface PortfolioStatsProps {
  portfolioData: {
    arbitrum: { balance: string; symbol: string; usd: string; cafi: string; change: string }
    base: { balance: string; symbol: string; usd: string; cafi: string; change: string }
    polygon: { balance: string; symbol: string; usd: string; cafi: string; change: string }
  }
}

export function PortfolioStats({ portfolioData }: PortfolioStatsProps) {
  const totalUSD = Object.values(portfolioData).reduce(
    (sum, data) => sum + Number.parseFloat(data.usd.replace(",", "")),
    0,
  )
  const totalCAFI = Object.values(portfolioData).reduce(
    (sum, data) => sum + Number.parseFloat(data.cafi.replace(",", "")),
    0,
  )

  const getChangeIcon = (change: string) => {
    if (change.startsWith("+")) return <TrendingUp className="w-4 h-4 text-soft-success" />
    if (change.startsWith("-")) return <TrendingDown className="w-4 h-4 text-soft-error" />
    return <Minus className="w-4 h-4 text-text-secondary" />
  }

  const getChangeColor = (change: string) => {
    if (change.startsWith("+")) return "text-soft-success"
    if (change.startsWith("-")) return "text-soft-error"
    return "text-text-secondary"
  }

  const portfolioAllocation = [
    {
      name: "ETH (Arbitrum)",
      value: Number.parseFloat(portfolioData.arbitrum.usd.replace(",", "")),
      percentage: (Number.parseFloat(portfolioData.arbitrum.usd.replace(",", "")) / totalUSD) * 100,
      color: "bg-blue-500",
      lightColor: "bg-blue-500/20",
    },
    {
      name: "ETH (Base)",
      value: Number.parseFloat(portfolioData.base.usd.replace(",", "")),
      percentage: (Number.parseFloat(portfolioData.base.usd.replace(",", "")) / totalUSD) * 100,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-500/20",
    },
    {
      name: "MATIC (Polygon)",
      value: Number.parseFloat(portfolioData.polygon.usd.replace(",", "")),
      percentage: (Number.parseFloat(portfolioData.polygon.usd.replace(",", "")) / totalUSD) * 100,
      color: "bg-purple-500",
      lightColor: "bg-purple-500/20",
    },
    {
      name: "CAFI Token",
      value: totalCAFI * 0.85,
      percentage: ((totalCAFI * 0.85) / totalUSD) * 100,
      color: "bg-soft-primary",
      lightColor: "bg-soft-primary/20",
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
              <Progress value={asset.percentage} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">
                ${totalUSD.toLocaleString()}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Total Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-soft-primary">{totalCAFI.toLocaleString()}</p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">CAFI Tokens</p>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                {getChangeIcon("+11.2%")}
                <p className={`text-2xl font-bold ${getChangeColor("+11.2%")}`}>+11.2%</p>
              </div>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">24h Change</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
