"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Zap } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

export function Web3RequestModal() {
  const { pendingRequests, approveRequest, rejectRequest } = useCarbonFiWeb3()
  const [isOpen, setIsOpen] = useState(true)

  const currentRequest = pendingRequests[0]

  if (!currentRequest) return null

  const handleApprove = async () => {
    await approveRequest(currentRequest.id)
    setIsOpen(false)
  }

  const handleReject = () => {
    rejectRequest(currentRequest.id)
    setIsOpen(false)
  }

  const getRequestIcon = (method: string) => {
    switch (method) {
      case "eth_sendTransaction":
        return <Zap className="h-5 w-5 text-orange-500" />
      case "personal_sign":
      case "eth_signTypedData_v4":
        return <Shield className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getRequestTitle = (method: string) => {
    switch (method) {
      case "eth_sendTransaction":
        return "Transaction Request"
      case "personal_sign":
        return "Sign Message"
      case "eth_signTypedData_v4":
        return "Sign Typed Data"
      default:
        return "Web3 Request"
    }
  }

  const getRequestDescription = (method: string, params: any[]) => {
    switch (method) {
      case "eth_sendTransaction":
        const tx = params[0]
        return `Send ${tx.value ? `${Number.parseInt(tx.value, 16) / 1e18} ETH` : "transaction"} to ${tx.to}`
      case "personal_sign":
        return `Sign message: "${params[0]}"`
      case "eth_signTypedData_v4":
        return "Sign structured data for this dApp"
      default:
        return `Execute ${method} with provided parameters`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getRequestIcon(currentRequest.method)}
            {getRequestTitle(currentRequest.method)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">From:</span>
            <Badge variant="outline">{currentRequest.origin}</Badge>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm">{getRequestDescription(currentRequest.method, currentRequest.params)}</p>
          </div>

          {currentRequest.method === "eth_sendTransaction" && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Gas Fee:</span>
                <span>~$2.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total:</span>
                <span className="font-semibold">
                  {currentRequest.params[0]?.value
                    ? `${(Number.parseInt(currentRequest.params[0].value, 16) / 1e18).toFixed(4)} ETH`
                    : "0 ETH"}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Only approve if you trust this dApp and understand the request.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReject} className="flex-1 bg-transparent">
              Reject
            </Button>
            <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
