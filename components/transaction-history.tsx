"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Leaf, Clock } from "lucide-react"

interface TransactionHistoryProps {
  selectedChain: "ethereum"
}

const mockTransactions = [
  {
    id: "1",
    type: "carbon-offset",
    amount: "2.5 tons CO₂",
    status: "success",
    time: "2 hours ago",
    hash: "0x1234...5678",
    icon: Leaf,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/40",
  },
  {
    id: "2",
    type: "send",
    amount: "100 CAFI",
    status: "success",
    time: "1 day ago",
    hash: "0xabcd...efgh",
    icon: ArrowUpRight,
    color: "text-orange-400",
    bgColor: "bg-orange-500/15",
    borderColor: "border-orange-500/30",
  },
  {
    id: "3",
    type: "receive",
    amount: "0.5 ETH",
    status: "success",
    time: "2 days ago",
    hash: "0x9876...5432",
    icon: ArrowDownLeft,
    color: "text-teal-300",
    bgColor: "bg-teal-500/15",
    borderColor: "border-teal-500/30",
  },
]

export function TransactionHistory({ selectedChain }: TransactionHistoryProps) {
  const transactions = mockTransactions

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-semibold text-white">Recent Transactions</span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-10 text-center text-white/40">
            <Clock className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-sm font-medium text-white/60">No transactions yet</p>
            <p className="text-xs mt-1">Your transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const IconComponent = tx.icon
              return (
                <div
                  key={tx.id}
                  className={`flex items-center justify-between rounded-xl border p-3.5 ${tx.bgColor} ${tx.borderColor} transition hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/20 ${tx.color} ring-1 ${tx.borderColor}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white capitalize">{tx.type.replace("-", " ")}</p>
                      <p className="text-xs text-white/40">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{tx.amount}</p>
                    <Badge
                      variant="outline"
                      className="mt-1 border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-300"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
