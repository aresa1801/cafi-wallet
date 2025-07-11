"use client"

export interface MobileWallet {
  name: string
  id: string
  icon: string
  deepLink: string
  downloadUrl: string
  isInstalled: boolean
}

export const detectMobileWallets = (): MobileWallet[] => {
  const wallets: MobileWallet[] = [
    {
      name: "MetaMask",
      id: "metamask",
      icon: "🦊",
      deepLink: "metamask://",
      downloadUrl: "https://metamask.app.link/dapp/carbonfi.app",
      isInstalled: false,
    },
    {
      name: "Trust Wallet",
      id: "trust",
      icon: "🛡️",
      deepLink: "trust://",
      downloadUrl: "https://link.trustwallet.com/open_url?coin_id=60&url=https://carbonfi.app",
      isInstalled: false,
    },
    {
      name: "Rainbow",
      id: "rainbow",
      icon: "🌈",
      deepLink: "rainbow://",
      downloadUrl: "https://rainbow.me/",
      isInstalled: false,
    },
    {
      name: "Coinbase Wallet",
      id: "coinbase",
      icon: "🔵",
      deepLink: "cbwallet://",
      downloadUrl: "https://wallet.coinbase.com/",
      isInstalled: false,
    },
    {
      name: "WalletConnect",
      id: "walletconnect",
      icon: "🔗",
      deepLink: "wc://",
      downloadUrl: "https://walletconnect.com/",
      isInstalled: false,
    },
  ]

  // Check if running on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  if (!isMobile) return wallets

  // Check for installed wallets
  wallets.forEach((wallet) => {
    try {
      // Check if wallet is installed by trying to access its provider
      switch (wallet.id) {
        case "metamask":
          wallet.isInstalled = !!(window as any).ethereum?.isMetaMask
          break
        case "trust":
          wallet.isInstalled = !!(window as any).ethereum?.isTrust
          break
        case "coinbase":
          wallet.isInstalled = !!(window as any).ethereum?.isCoinbaseWallet
          break
        default:
          wallet.isInstalled = false
      }
    } catch (error) {
      wallet.isInstalled = false
    }
  })

  return wallets
}

export const connectToMobileWallet = async (wallet: MobileWallet) => {
  if (wallet.isInstalled) {
    try {
      // Connect to installed wallet
      if ((window as any).ethereum) {
        await (window as any).ethereum.request({ method: "eth_requestAccounts" })
        return true
      }
    } catch (error) {
      console.error("Failed to connect to wallet:", error)
    }
  } else {
    // Redirect to wallet download/deep link
    window.open(wallet.downloadUrl, "_blank")
  }
  return false
}
