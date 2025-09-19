"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Shield, Wallet, Clock, CheckCircle, XCircle } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

export function Web3RequestModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { pendingRequests, approveRequest, rejectRequest } = useCarbonFiWeb3()

  const currentRequest = pendingRequests[0]

  useEffect(() => {
    setIsOpen(!!currentRequest)
  }, [currentRequest])

  const handleApprove = async () => {
    if (!currentRequest) return

    setIsProcessing(true)
    try {
      await approveRequest(currentRequest.id)
    } catch (error) {
      console.error("Failed to approve request:", error)
    } finally {
      setIsProcessing(false)
      setIsOpen(false)
    }
  }

  const handleReject = () => {
    if (!currentRequest) return

    rejectRequest(currentRequest.id)
    setIsOpen(false)
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

  const getRequestDescription = (method: string) => {
    switch (method) {
      case "eth_sendTransaction":
        return "A dApp is requesting to send a transaction from your wallet."
      case "personal_sign":
        return "A dApp is requesting you to sign a message."
      case "eth_signTypedData_v4":
        return "A dApp is requesting you to sign structured data."
      default:
        return "A dApp is making a request to your wallet."
    }
  }

  const getRequestIcon = (method: string) => {
    switch (method) {
      case "eth_sendTransaction":
        return <Wallet className="h-6 w-6 text-blue-500" />
      case "personal_sign":
      case "eth_signTypedData_v4":
        return <Shield className="h-6 w-6 text-green-500" />
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    }
  }

  if (!currentRequest) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getRequestIcon(currentRequest.method)}
            <div>
              <DialogTitle>{getRequestTitle(currentRequest.method)}</DialogTitle>
              <DialogDescription>{getRequestDescription(currentRequest.method)}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Details */}
          <Card className="bg-gray-50 dark:bg-gray-800">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Origin</span>
                <Badge variant="outline">{currentRequest.origin}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Method</span>
                <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{currentRequest.method}</code>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Time</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(currentRequest.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details (if applicable) */}
          {currentRequest.method === "eth_sendTransaction" && currentRequest.params[0] && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Transaction Details</h4>
                <div className="space-y-1 text-sm">
                  {currentRequest.params[0].to && (
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">To:</span>
                      <code className="text-blue-800 dark:text-blue-200 text-xs">{currentRequest.params[0].to}</code>
                    </div>
                  )}
                  {currentRequest.params[0].value && (
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Value:</span>
                      <span className="text-blue-800 dark:text-blue-200">
                        {Number.parseInt(currentRequest.params[0].value, 16) / 1e18} ETH
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Warning */}
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Security Notice</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Only approve requests from trusted dApps. CarbonFi will never ask for your private keys.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleReject} disabled={isProcessing} className="flex-1 bg-transparent">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing} className="flex-1 bg-green-600 hover:bg-green-700">
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
