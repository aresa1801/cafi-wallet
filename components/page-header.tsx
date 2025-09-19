"use client"

import type React from "react"

import { ArrowLeft, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  showLogo?: boolean
  rightContent?: React.ReactNode
}

export function PageHeader({ title, subtitle, onBack, showLogo = true, rightContent }: PageHeaderProps) {
  const { isConnected, connectedDApp } = useCarbonFiWeb3()

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {showLogo && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-gray-400" />}
          {connectedDApp && <span className="text-xs text-green-600 dark:text-green-400">{connectedDApp}</span>}
        </div>

        {rightContent}
      </div>
    </div>
  )
}
