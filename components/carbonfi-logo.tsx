"use client"

import { cn } from "@/lib/utils"
import { Leaf } from "lucide-react"

interface CarbonFiLogoProps {
  variant?: "icon" | "full" | "text"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showGlow?: boolean
}

export function CarbonFiLogo({ variant = "icon", size = "md", className, showGlow = false }: CarbonFiLogoProps) {
  const sizeClasses = {
    sm: variant === "full" ? "h-8" : "w-6 h-6",
    md: variant === "full" ? "h-12" : "w-8 h-8",
    lg: variant === "full" ? "h-16" : "w-10 h-10",
    xl: variant === "full" ? "h-24" : "w-12 h-12",
  }

  const containerClasses = cn("relative flex items-center justify-center", showGlow && "animate-glow-pulse", className)

  if (variant === "full") {
    return (
      <div className={containerClasses}>
        <img
          src="/images/carbonfi-logo-full.png"
          alt="CarbonFi - Decentralized Carbon Finance"
          className={cn("object-contain", sizeClasses[size])}
        />
        {showGlow && (
          <div className="absolute inset-0 bg-gradient-to-br from-carbon-primary/20 to-carbon-accent/20 rounded-lg blur-xl -z-10"></div>
        )}
      </div>
    )
  }

  if (variant === "text") {
    return (
      <div className={containerClasses}>
        <h1
          className={cn(
            "font-bold bg-neon-gradient bg-clip-text text-transparent",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl",
            size === "xl" && "text-4xl",
          )}
        >
          CarbonFi
        </h1>
      </div>
    )
  }

  // Default icon variant
  return (
    <div className={containerClasses}>
      <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
        <Leaf className="w-1/2 h-1/2 text-white" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/50 to-emerald-500/50 rounded-lg blur-sm"></div>
    </div>
  )
}
