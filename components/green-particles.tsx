"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

interface GreenParticlesProps {
  count?: number
  className?: string
}

export function GreenParticles({ count = 20, className }: GreenParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const colors = [
      "bg-soft-success/20",
      "bg-soft-primary/20",
      "bg-soft-accent/20",
      "bg-emerald-400/20",
      "bg-green-400/20",
      "bg-teal-400/20",
    ]

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))

    setParticles(newParticles)
  }, [count])

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn("absolute rounded-full animate-gentle-bounce", particle.color)}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
