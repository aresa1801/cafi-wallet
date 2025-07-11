"use client"

import { Badge } from "@/components/ui/badge"
import { Leaf, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface EcoBadgeProps {
  variant?: "carbon-neutral" | "eco-friendly" | "sustainable" | "green-energy"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function EcoBadge({ variant = "carbon-neutral", size = "md", className }: EcoBadgeProps) {
  const variants = {
    "carbon-neutral": {
      icon: Leaf,
      text: "Carbon Neutral",
      colors: "bg-soft-success/20 text-soft-success border-soft-success/30",
    },
    "eco-friendly": {
      icon: Sparkles,
      text: "Eco Friendly",
      colors: "bg-soft-primary/20 text-soft-primary border-soft-primary/30",
    },
    sustainable: {
      icon: Leaf,
      text: "Sustainable",
      colors: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
    },
    "green-energy": {
      icon: Sparkles,
      text: "Green Energy",
      colors: "bg-soft-accent/20 text-soft-accent border-soft-accent/30",
    },
  }

  const config = variants[variant]
  const IconComponent = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <Badge
      className={cn(
        "font-medium border transition-all duration-300 hover:scale-105",
        config.colors,
        sizeClasses[size],
        className,
      )}
    >
      <IconComponent className={cn("mr-1.5", iconSizes[size])} />
      {config.text}
    </Badge>
  )
}
