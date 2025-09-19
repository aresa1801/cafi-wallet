"use client"

import { useEffect, useState } from "react"
import { CarbonFiLogo } from "@/components/carbonfi-logo"
import { SustainabilityOrnaments } from "@/components/sustainability-ornaments"
import { GreenParticles } from "@/components/green-particles"

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 flex items-center justify-center relative overflow-hidden">
      <SustainabilityOrnaments />
      <GreenParticles count={20} />

      <div className="text-center relative z-10">
        <div className="relative inline-block mb-8">
          <CarbonFiLogo className="w-24 h-24 mx-auto animate-pulse" />
          <div className="absolute inset-0 bg-green-400/30 rounded-full blur-2xl animate-ping"></div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">CarbonFi</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Sustainable Web3 Wallet</p>

        <div className="w-64 mx-auto">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading... {progress}%</p>
        </div>
      </div>
    </div>
  )
}
