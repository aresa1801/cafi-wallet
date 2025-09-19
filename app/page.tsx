"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { LoginScreen } from "@/components/login-screen"
import { MobileLoginScreen } from "@/components/mobile-login-screen"
import { MobileWalletDashboard } from "@/components/mobile-wallet-dashboard"
import { detectWallets } from "@/utils/wallet-detection"
import { CarbonFiWeb3Provider } from "@/providers/carbonfi-web3-provider"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"splash" | "login" | "mobile-login" | "dashboard">("splash")
  const [walletInfo, setWalletInfo] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen(isMobile ? "mobile-login" : "login")
    }, 3000)

    return () => clearTimeout(timer)
  }, [isMobile])

  const handleWalletConnect = (wallet: any) => {
    setWalletInfo(wallet)
    setCurrentScreen("dashboard")
  }

  const handleAutoDetect = async () => {
    const detectedWallets = await detectWallets()
    if (detectedWallets.length > 0) {
      handleWalletConnect(detectedWallets[0])
    }
  }

  if (currentScreen === "splash") {
    return <SplashScreen />
  }

  if (currentScreen === "login") {
    return <LoginScreen onWalletConnect={handleWalletConnect} onAutoDetect={handleAutoDetect} />
  }

  if (currentScreen === "mobile-login") {
    return <MobileLoginScreen onWalletConnect={handleWalletConnect} onAutoDetect={handleAutoDetect} />
  }

  return (
    <CarbonFiWeb3Provider>
      <MobileWalletDashboard walletType={walletInfo?.type || "smart"} walletInfo={walletInfo} />
    </CarbonFiWeb3Provider>
  )
}
