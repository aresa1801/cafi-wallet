"use client"

import { useEffect, useState } from "react"
import { Leaf } from "lucide-react"

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
          setTimeout(onComplete, 400)
          return 100
        }
        return prev + 2
      })
    }, 45)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060B09] flex items-center justify-center">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-teal-500/10 blur-[90px]" />
      </div>

      <div className="relative z-10 text-center">
        <div className="relative mx-auto mb-6 inline-block">
          <div className="flex h-24 w-24 items-center justify-center">
            <img src="/images/carbonfi-logo-new.png" alt="CarbonFi" className="h-24 w-24 object-contain drop-shadow-[0_0_25px_rgba(52,211,153,0.35)]" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white">CarbonFi</h1>
        <p className="mt-1 text-sm text-emerald-300/70">Web3 Carbon Wallet</p>

        <div className="mx-auto mt-8 w-56">
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-white/40">Loading... {progress}%</p>
        </div>
      </div>
    </div>
  )
}
