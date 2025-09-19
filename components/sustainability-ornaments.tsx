"use client"

import { cn } from "@/lib/utils"
import { Leaf, TreePine, Waves, Wind, Sun, Recycle } from "lucide-react"

interface SustainabilityOrnamentsProps {
  variant?: "floating" | "decorative"
  className?: string
}

export function SustainabilityOrnaments({ variant = "floating", className = "" }: SustainabilityOrnamentsProps) {
  if (variant === "floating") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
        {/* Floating leaves */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 text-soft-success/20 animate-gentle-bounce">
          <Leaf className="w-full h-full transform rotate-12" />
        </div>
        <div
          className="absolute top-1/3 right-1/3 w-6 h-6 text-soft-primary/20 animate-gentle-bounce"
          style={{ animationDelay: "1s" }}
        >
          <TreePine className="w-full h-full transform -rotate-12" />
        </div>
        <div
          className="absolute bottom-1/3 left-1/5 w-7 h-7 text-soft-accent/20 animate-gentle-bounce"
          style={{ animationDelay: "2s" }}
        >
          <Waves className="w-full h-full transform rotate-45" />
        </div>
        <div
          className="absolute top-2/3 right-1/4 w-5 h-5 text-soft-warning/20 animate-gentle-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <Wind className="w-full h-full transform rotate-90" />
        </div>
        <div
          className="absolute bottom-1/4 right-1/5 w-6 h-6 text-soft-secondary/20 animate-gentle-bounce"
          style={{ animationDelay: "1.5s" }}
        >
          <Recycle className="w-full h-full transform -rotate-45" />
        </div>
        <div
          className="absolute top-1/5 left-2/3 w-4 h-4 text-soft-warning/30 animate-gentle-bounce"
          style={{ animationDelay: "2.5s" }}
        >
          <Sun className="w-full h-full" />
        </div>
      </div>
    )
  }

  if (variant === "decorative") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Leaf className="w-4 h-4 text-green-500 animate-pulse" />
        <Recycle className="w-4 h-4 text-blue-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <Sun className="w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
    )
  }

  return null
}
