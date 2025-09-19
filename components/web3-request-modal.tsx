"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, CheckCircle, X, Send, Edit, FileText } from "lucide-react"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface Web3RequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export function Web3RequestModal({ isOpen, onClose }: Web3RequestModalProps) {
  const { pendingRequest, approveRequest, rejectRequest, connectedDapp, chainId } = useCarbonFiWeb3()
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen || !pendingRequest) return null

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await approveRequest(null) // The provider will handle the actual result
      onClose()
    } catch (error) {
      console.error("Failed to approve request:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = () => {
    rejectRequest(new Error("User rejected the request"))
    onClose()
  }

  const getRequestIcon = () => {
    switch (pendingRequest.method) {
      case "eth_sendTransaction":
        return <Send className="w-6 h-6 text-soft-warning" />
      case "personal_sign":
        return <Edit className="w-6 h-6 text-soft-primary" />
      case "eth_signTypedData":
      case "eth_signTypedData_v4":
        return <FileText className="w-6 h-6 text-soft-accent" />
      default:
        return <Shield className="w-6 h-6 text-soft-secondary" />
    }
  }

  const getRequestTitle = () => {
    switch (pendingRequest.method) {
      case "eth_sendTransaction":
        return "Transaction Request"
      case "personal_sign":
        return "Sign Message"
      case "eth_signTypedData":
      case "eth_signTypedData_v4":
        return "Sign Typed Data"
      default:
        return "Web3 Request"
    }
  }

  const getRequestDescription = () => {
    switch (pendingRequest.method) {
      case "eth_sendTransaction":
        return "This dApp wants to send a transaction from your wallet"
      case "personal_sign":
        return "This dApp wants you to sign a message"
      case "eth_signTypedData":
      case "eth_signTypedData_v4":
        return "This dApp wants you to sign structured data"
      default:
        return "This dApp is requesting an action from your wallet"
    }
  }

  const renderRequestDetails = () => {
    switch (pendingRequest.method) {
      case "eth_sendTransaction":
        const tx = pendingRequest.params[0]
        return (
          <div className="space-y-3">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary dark:text-text-dark-secondary text-sm">To</span>
                <span className="font-mono text-sm text-text-primary dark:text-text-dark-primary">
                  {tx.to || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary dark:text-text-dark-secondary text-sm">Value</span>
                <span className="text-sm text-text-primary dark:text-text-dark-primary">
                  {tx.value ? `${Number.parseInt(tx.value, 16) / 1e18} ETH` : "0 ETH"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary dark:text-text-dark-secondary text-sm">Gas</span>
                <span className="text-sm text-text-primary dark:text-text-dark-primary">
                  {tx.gas ? Number.parseInt(tx.gas, 16).toLocaleString() : "Auto"}
                </span>
              </div>
            </div>
          </div>
        )

      case "personal_sign":
        return (
          <div className="space-y-3">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-2">Message to sign:</p>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 border">
                <p className="text-sm font-mono text-text-primary dark:text-text-dark-primary break-all">
                  {pendingRequest.params[0]}
                </p>
              </div>
            </div>
          </div>
        )

      case "eth_signTypedData":
      case "eth_signTypedData_v4":
        return (
          <div className="space-y-3">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-2">Structured data to sign:</p>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 border max-h-32 overflow-y-auto">
                <pre className="text-xs font-mono text-text-primary dark:text-text-dark-primary">
                  {JSON.stringify(pendingRequest.params[1], null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Method: {pendingRequest.method}</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-bg-dark-secondary/95 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full flex items-center justify-center shadow-soft">
                {getRequestIcon()}
              </div>
              <div>
                <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary">
                  {getRequestTitle()}
                </CardTitle>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">from {connectedDapp}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReject}
              className="text-text-tertiary dark:text-text-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">{getRequestDescription()}</p>

          {renderRequestDetails()}

          {/* Chain Info */}
          <div className="flex items-center justify-between p-3 bg-soft-primary/10 rounded-lg border border-soft-primary/20">
            <span className="text-sm text-text-secondary dark:text-text-dark-secondary">Network</span>
            <Badge className="bg-soft-primary/20 text-soft-primary border-soft-primary/30">Chain {chainId}</Badge>
          </div>

          {/* Security Warning */}
          <div className="flex items-start space-x-2 p-3 bg-soft-warning/10 border border-soft-warning/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-soft-warning mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-soft-warning">Security Notice</p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                Only approve requests from trusted dApps. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex-1 border-soft-error/30 text-soft-error hover:bg-soft-error/10 hover:border-soft-error/50 bg-transparent"
            >
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-soft-success to-soft-primary hover:from-soft-success/90 hover:to-soft-primary/90 text-white font-medium shadow-soft"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
