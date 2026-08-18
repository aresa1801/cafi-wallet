"use client"

import { useState } from "react"
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
  const [showSetup, setShowSetup] = useState(false)

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

  let screen
  if (showSplash) {
    screen = <SplashScreen onComplete={() => setShowSplash(false)} />
  } else if (showSetup) {
    screen = <SelfCustodySetup onComplete={handleSetupComplete} onBack={handleBackFromSetup} />
  } else if (!isLoggedIn) {
    screen = <MobileLoginScreen onLogin={handleLogin} onOpenSetup={() => setShowSetup(true)} />
  } else {
    screen = (
      <>
        <MobileWalletDashboard walletType={walletType!} walletInfo={walletInfo} />
        <Web3RequestModal />
      </>
    )
  }

  // Single provider wraps the ENTIRE app so every screen
  // (login, self-custody setup, dashboard) has web3 context.
  return <CarbonFiWeb3Provider>{screen}</CarbonFiWeb3Provider>
}
