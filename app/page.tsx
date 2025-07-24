"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { MobileLoginScreen } from "@/components/mobile-login-screen"
import { MobileWalletDashboard } from "@/components/mobile-wallet-dashboard"
import { CarbonFiWeb3Provider } from "@/providers/carbonfi-web3-provider"

export default function CarbonFiWallet() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [walletType, setWalletType] = useState<"smart" | "self-custody" | null>(null)
  const [walletInfo, setWalletInfo] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect if user is on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLogin = (type: "smart" | "self-custody", info?: any) => {
    setWalletType(type)
    setWalletInfo(info)
    setIsLoggedIn(true)
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  if (!isLoggedIn) {
    return <MobileLoginScreen onLogin={handleLogin} />
  }

  return (
    <CarbonFiWeb3Provider>
      <MobileWalletDashboard walletType={walletType!} walletInfo={walletInfo} />
    </CarbonFiWeb3Provider>
  )
}
