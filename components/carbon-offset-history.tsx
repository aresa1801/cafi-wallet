"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
        return "text-emerald-400"
      case "fuel":
        return "text-orange-400"
      case "flight":
        return "text-teal-300"
      case "utility":
        return "text-lime-300"
      default:
        return "text-emerald-400"
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "receipt":
        return "border-emerald-500/20 bg-emerald-500/5"
      case "fuel":
        return "border-orange-500/20 bg-orange-500/5"
      case "flight":
        return "border-teal-500/20 bg-teal-500/5"
      case "utility":
        return "border-lime-500/20 bg-lime-500/5"
      default:
        return "border-emerald-500/20 bg-emerald-500/5"
    }
  }

  const totalOffset = mockOffsetHistory.reduce((sum, record) => sum + record.carbonOffset, 0)
  const totalCost = mockOffsetHistory.reduce((sum, record) => sum + record.cost, 0)

  const statusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
      case "pending":
        return "border-amber-500/40 bg-amber-500/10 text-amber-300"
      default:
        return "border-red-500/40 bg-red-500/10 text-red-300"
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <CardContent className="p-4 text-center">
            <Leaf className="mx-auto mb-2 h-7 w-7 text-emerald-400" />
            <p className="text-2xl font-bold text-white">{totalOffset.toFixed(1)} kg</p>
            <p className="text-xs text-emerald-300">Total CO₂ Offset</p>
          </CardContent>
        </Card>
        <Card className="border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-transparent">
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto mb-2 h-7 w-7 text-teal-300" />
            <p className="text-2xl font-bold text-white">${totalCost.toFixed(2)}</p>
            <p className="text-xs text-teal-300">Total Investment</p>
          </CardContent>
        </Card>
      </div>

      {/* Offset History */}
      <Card className="border border-white/10 bg-white/5">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Offset History</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/50">
              <Filter className="h-3 w-3" /> Filter
            </span>
          </div>

          <div className="space-y-3">
            {mockOffsetHistory.map((record) => {
              const IconComponent = getTypeIcon(record.type)
              const borderColor =
                record.type === "receipt"
                  ? "border-emerald-500/30"
                  : record.type === "fuel"
                    ? "border-orange-500/30"
                    : record.type === "flight"
                      ? "border-teal-500/30"
                      : "border-lime-500/30"
              return (
                <div
                  key={record.id}
                  className={`rounded-xl border p-3.5 transition hover:scale-[1.02] ${getTypeBg(record.type)}`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/20 ring-1 ${borderColor}`}
                      >
                        <IconComponent className={`h-5 w-5 ${getTypeColor(record.type)}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white capitalize">{record.type}</p>
                        <p className="text-xs text-white/40">{record.merchant}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${statusBadge(record.status)}`}>
                      {record.status}
                    </Badge>
                  </div>

                  <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[11px] text-white/40">Purchase</p>
                      <p className="font-semibold text-white">${record.amount}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/40">CO₂ Offset</p>
                      <p className={`font-semibold ${getTypeColor(record.type)}`}>{record.carbonOffset} kg</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/40">Cost</p>
                      <p className="font-semibold text-white">${record.cost}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <p className="text-[11px] text-white/40">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    {record.txHash && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300">
                        <ExternalLink className="h-3 w-3" /> View Tx
                      </span>
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
