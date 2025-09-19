"use client"

import { Badge } from "@/components/ui/badge"
import { Leaf, Recycle, Sun, Wind } from "lucide-react"

interface EcoBadgeProps {
  variant?: "eco-friendly" | "carbon-neutral" | "sustainable" | "green-energy"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function EcoBadge({ variant = "eco-friendly", size = "md", className = "" }: EcoBadgeProps) {
  const getIcon = () => {
    switch (variant) {
      case "eco-friendly":
        return <Leaf className="w-3 h-3" />
      case "carbon-neutral":
        return <Recycle className="w-3 h-3" />
      case "sustainable":
        return <Sun className="w-3 h-3" />
      case "green-energy":
        return <Wind className="w-3 h-3" />
    }
  }

  const getLabel = () => {
    switch (variant) {
      case "eco-friendly":
        return "Eco-Friendly"
      case "carbon-neutral":
        return "Carbon Neutral"
      case "sustainable":
        return "Sustainable"
      case "green-energy":
        return "Green Energy"
    }
  }

  const getColors = () => {
    switch (variant) {
      case "eco-friendly":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "carbon-neutral":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "sustainable":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "green-energy":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
    }
  }

  const sizeClass = size === "sm" ? "text-xs px-2 py-1" : size === "lg" ? "text-sm px-3 py-2" : "text-xs px-2 py-1"

  return (
    <Badge className={`${getColors()} ${sizeClass} ${className} flex items-center gap-1`}>
      {getIcon()}
      {getLabel()}
    </Badge>
  )
}
