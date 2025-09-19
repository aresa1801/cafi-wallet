"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { EcoBadge } from "./eco-badge"

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  badge?: "eco-friendly" | "carbon-neutral" | "sustainable" | "green-energy"
  rightContent?: React.ReactNode
}

export function PageHeader({ title, subtitle, onBack, badge, rightContent }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-green-200 dark:border-green-800">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
              {badge && <EcoBadge variant={badge} size="sm" />}
            </div>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>
        {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
      </div>
    </div>
  )
}
