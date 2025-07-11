"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { SustainabilityOrnaments } from "./sustainability-ornaments"
import { EcoBadge } from "./eco-badge"

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  showBackButton?: boolean
  rightContent?: React.ReactNode
  badge?: "eco-friendly" | "carbon-neutral" | "sustainable" | "green-energy"
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  rightContent,
  badge,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 p-4 sticky top-0 z-50 shadow-soft relative ${className}`}
    >
      <SustainabilityOrnaments variant="floating" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-text-tertiary dark:text-text-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-soft">
            <img src="/images/carbonfi-logo.png" alt="CarbonFi" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-text-primary dark:text-text-dark-primary">{title}</h1>
              {badge && <EcoBadge variant={badge} size="sm" />}
            </div>
            {subtitle && <p className="text-sm text-text-secondary dark:text-text-dark-secondary">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {rightContent}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
