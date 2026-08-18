"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { MobileLoginScreen } from "@/components/mobile-login-screen"
import { SelfCustodySetup } from "@/components/self-custody-setup"
import { MobileWalletDashboard } from "@/components/mobile-wallet-dashboard"
import { CarbonFiWeb3Provider } from "@/providers/carbonfi-web3-provider"
import { Web3RequestModal } from "@/components/web3-request-modal"

export default function CarbonFiWallet() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [walletType, setWalletType] = useState<"smart" | "self-custody" | null>(null)
  const [walletInfo, setWalletInfo] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  // Optional preview mode: bypass splash/login to show the dashboard directly.
  // Usage: /?preview=dashboard
  const [preview] = useState(() =>
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("preview") : null
  )

  useEffect(() => {
    if (preview === "dashboard") {
      setIsLoggedIn(true)
      setWalletType("self-custody")
      setWalletInfo({ type: "self-custody", connectedVia: "preview" })
      setShowSplash(false)
    }
  }, [preview])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLogin = (type: "smart" | "self-custody", info?: any) => {
    setWalletType(type)
    if (type === "self-custody" && info?.setupRequired) {
      setShowSetup(true)
    } else {
      setWalletInfo(info)
      setIsLoggedIn(true)
    }
  }

  const handleSetupComplete = (info: any) => {
    setWalletInfo(info)
    setIsLoggedIn(true)
    setShowSetup(false)
  }

  const handleBackFromSetup = () => {
    setShowSetup(false)
    setWalletType(null)
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  if (showSetup) {
    return <SelfCustodySetup onComplete={handleSetupComplete} onBack={handleBackFromSetup} />
  }

  if (!isLoggedIn) {
    return (
      <CarbonFiWeb3Provider>
        <MobileLoginScreen onLogin={handleLogin} onOpenSetup={() => setShowSetup(true)} />
      </CarbonFiWeb3Provider>
    )
  }

  return (
    <CarbonFiWeb3Provider>
      <MobileWalletDashboard walletType={walletType!} walletInfo={walletInfo} />
      <Web3RequestModal />
    </CarbonFiWeb3Provider>
  )
}
