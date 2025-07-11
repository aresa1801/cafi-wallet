"use client"

import { useEffect, useState } from "react"
import { CarbonFiLogo } from "./carbonfi-logo"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-carbon-primary/10 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-carbon-accent/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-carbon-purple/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="text-center space-y-8 animate-fade-in relative z-10">
        {/* Main Logo */}
        <CarbonFiLogo variant="full" size="xl" showGlow className="mx-auto" />

        {/* Tagline */}
        <div className="space-y-2">
          <p className="text-carbon-accent text-lg font-semibold">Decentralized Carbon Finance</p>
          <p className="text-dark-muted text-sm">Building a sustainable future with Web3</p>
        </div>

        {/* Loading Progress */}
        <div className="w-64 mx-auto space-y-2">
          <div className="w-full bg-dark-surface rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-carbon-primary to-carbon-accent transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-dark-muted">Loading... {progress}%</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
          <div className="text-center p-3 bg-carbon-primary/10 rounded-lg border border-carbon-primary/20">
            <div className="text-2xl mb-1">🌱</div>
            <p className="text-xs text-carbon-primary font-semibold">Carbon Offset</p>
          </div>
          <div className="text-center p-3 bg-carbon-accent/10 rounded-lg border border-carbon-accent/20">
            <div className="text-2xl mb-1">🗳️</div>
            <p className="text-xs text-carbon-accent font-semibold">DAO Governance</p>
          </div>
          <div className="text-center p-3 bg-carbon-purple/10 rounded-lg border border-carbon-purple/20">
            <div className="text-2xl mb-1">📱</div>
            <p className="text-xs text-carbon-purple font-semibold">OCR Scanner</p>
          </div>
        </div>
      </div>
    </div>
  )
}
