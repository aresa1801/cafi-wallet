"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, Car, Plane, Home, ShoppingCart, Calendar, TrendingUp, ExternalLink, Filter } from "lucide-react"

interface OffsetRecord {
  id: string
  type: "receipt" | "fuel" | "flight" | "utility"
  amount: number
  carbonOffset: number
  cost: number
  date: string
  merchant: string
  status: "completed" | "pending" | "failed"
  txHash?: string
}

const mockOffsetHistory: OffsetRecord[] = [
  {
    id: "1",
    type: "flight",
    amount: 299.99,
    carbonOffset: 125.4,
    cost: 12.54,
    date: "2024-01-15",
    merchant: "AirAsia",
    status: "completed",
    txHash: "0x1234...5678",
  },
  {
    id: "2",
    type: "fuel",
    amount: 89.5,
    carbonOffset: 18.7,
    cost: 1.87,
    date: "2024-01-14",
    merchant: "Shell Gas Station",
    status: "completed",
    txHash: "0xabcd...efgh",
  },
  {
    id: "3",
    type: "utility",
    amount: 156.78,
    carbonOffset: 45.2,
    cost: 4.52,
    date: "2024-01-12",
    merchant: "PLN Indonesia",
    status: "pending",
  },
  {
    id: "4",
    type: "receipt",
    amount: 45.67,
    carbonOffset: 2.3,
    cost: 0.23,
    date: "2024-01-10",
    merchant: "Green Grocery Store",
    status: "completed",
    txHash: "0x9876...5432",
  },
]

export function CarbonOffsetHistory() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "receipt":
        return ShoppingCart
      case "fuel":
        return Car
      case "flight":
        return Plane
      case "utility":
        return Home
      default:
        return Leaf
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "receipt":
        return "text-carbon-primary"
      case "fuel":
        return "text-carbon-orange"
      case "flight":
        return "text-carbon-accent"
      case "utility":
        return "text-carbon-purple"
      default:
        return "text-carbon-primary"
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "receipt":
        return "bg-carbon-primary/10 border-carbon-primary/20"
      case "fuel":
        return "bg-carbon-orange/10 border-carbon-orange/20"
      case "flight":
        return "bg-carbon-accent/10 border-carbon-accent/20"
      case "utility":
        return "bg-carbon-purple/10 border-carbon-purple/20"
      default:
        return "bg-carbon-primary/10 border-carbon-primary/20"
    }
  }

  const totalOffset = mockOffsetHistory.reduce((sum, record) => sum + record.carbonOffset, 0)
  const totalCost = mockOffsetHistory.reduce((sum, record) => sum + record.cost, 0)

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-carbon-primary/10 to-carbon-secondary/10 border-carbon-primary/20">
          <CardContent className="p-4 text-center">
            <Leaf className="w-8 h-8 text-carbon-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalOffset.toFixed(1)} kg</p>
            <p className="text-xs text-carbon-primary">Total CO₂ Offset</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-carbon-accent/10 to-carbon-purple/10 border-carbon-accent/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-carbon-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${totalCost.toFixed(2)}</p>
            <p className="text-xs text-carbon-accent">Total Investment</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Options */}
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-carbon-primary" />
              <span>Offset History</span>
            </CardTitle>
            <Button variant="outline" size="sm" className="border-dark-border text-dark-muted hover:bg-dark-surface">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockOffsetHistory.map((record) => {
              const IconComponent = getTypeIcon(record.type)
              return (
                <div
                  key={record.id}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${getTypeBg(record.type)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-dark-card flex items-center justify-center border ${record.type === "receipt" ? "border-carbon-primary/20" : record.type === "fuel" ? "border-carbon-orange/20" : record.type === "flight" ? "border-carbon-accent/20" : "border-carbon-purple/20"}`}
                      >
                        <IconComponent className={`w-5 h-5 ${getTypeColor(record.type)}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white capitalize">{record.type}</p>
                        <p className="text-sm text-dark-muted">{record.merchant}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`text-xs font-semibold ${
                          record.status === "completed"
                            ? "bg-success text-dark-bg"
                            : record.status === "pending"
                              ? "bg-warning text-dark-bg"
                              : "bg-error text-white"
                        }`}
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-dark-muted">Purchase</p>
                      <p className="text-white font-semibold">${record.amount}</p>
                    </div>
                    <div>
                      <p className="text-dark-muted">CO₂ Offset</p>
                      <p className="text-carbon-primary font-semibold">{record.carbonOffset} kg</p>
                    </div>
                    <div>
                      <p className="text-dark-muted">Cost</p>
                      <p className="text-white font-semibold">${record.cost}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-dark-muted">{new Date(record.date).toLocaleDateString()}</p>
                    {record.txHash && (
                      <Button variant="ghost" size="sm" className="h-6 text-carbon-accent hover:text-white">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        <span className="text-xs">View Tx</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
