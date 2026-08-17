"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, ArrowUpDown, ExternalLink, Leaf, Clock } from "lucide-react"

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
    color: "text-carbon-primary",
    bgColor: "bg-carbon-primary/10",
    borderColor: "border-carbon-primary/20",
  },
  {
    id: "2",
    type: "send",
    amount: "100 CAFI",
    status: "success",
    time: "1 day ago",
    hash: "0xabcd...efgh",
    icon: ArrowUpRight,
    color: "text-carbon-orange",
    bgColor: "bg-carbon-orange/10",
    borderColor: "border-carbon-orange/20",
  },
  {
    id: "3",
    type: "receive",
    amount: "0.5 ETH",
    status: "success",
    time: "2 days ago",
    hash: "0x9876...5432",
    icon: ArrowDownLeft,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
]

export function TransactionHistory({ selectedChain }: TransactionHistoryProps) {
  const transactions = mockTransactions

  return (
    <Card className="bg-dark-card border-dark-border">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center space-x-2">
          <Clock className="w-5 h-5 text-carbon-accent" />
          <span>Recent Transactions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-dark-muted">
            <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-dark-muted" />
            </div>
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm mt-1">Your transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const IconComponent = tx.icon
              return (
                <div
                  key={tx.id}
                  className={`flex items-center justify-between p-4 ${tx.bgColor} rounded-xl border ${tx.borderColor} hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-dark-card flex items-center justify-center ${tx.color} border ${tx.borderColor}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-white capitalize">{tx.type.replace("-", " ")}</p>
                      <p className="text-sm text-dark-muted">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{tx.amount}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant={tx.status === "success" ? "default" : "secondary"}
                        className={`text-xs font-semibold ${
                          tx.status === "success" ? "bg-success text-dark-bg" : "bg-warning text-dark-bg"
                        }`}
                      >
                        {tx.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-dark-muted hover:text-carbon-accent"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
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
