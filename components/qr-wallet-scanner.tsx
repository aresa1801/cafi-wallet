"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, X, Scan, Wifi, Shield, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react"
import { PageHeader } from "./page-header"

interface QRWalletScannerProps {
  onClose: () => void
  onWalletConnect: (connectionData: any) => void
}

interface ConnectionData {
  platform: string
  dapp: string
  chainId: number
  address: string
  uri: string
  methods: string[]
  icon?: string
}

export function QRWalletScanner({ onClose, onWalletConnect }: QRWalletScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock QR code processing function
  const processQRCode = useCallback(async (qrData: string): Promise<ConnectionData> => {
    // Simulate QR processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock different Web3 platforms
    const mockConnections: ConnectionData[] = [
      {
        platform: "WalletConnect",
        dapp: "Uniswap",
        chainId: 1,
        address: "0x1234...5678",
        uri: "wc:1234567890abcdef@2?relay-protocol=irn&symKey=abcd1234",
        methods: ["eth_sendTransaction", "personal_sign"],
        icon: "🦄",
      },
      {
        platform: "WalletConnect",
        dapp: "OpenSea",
        chainId: 1,
        address: "0xabcd...efgh",
        uri: "wc:abcdef1234567890@2?relay-protocol=irn&symKey=efgh5678",
        methods: ["eth_sendTransaction", "eth_signTypedData"],
        icon: "🌊",
      },
      {
        platform: "WalletConnect",
        dapp: "Aave",
        chainId: 1,
        address: "0x9876...5432",
        uri: "wc:9876543210fedcba@2?relay-protocol=irn&symKey=ijkl9012",
        methods: ["eth_sendTransaction", "personal_sign"],
        icon: "👻",
      },
      {
        platform: "WalletConnect",
        dapp: "PancakeSwap",
        chainId: 56,
        address: "0xdef0...1234",
        uri: "wc:def01234567890ab@2?relay-protocol=irn&symKey=mnop3456",
        methods: ["eth_sendTransaction", "personal_sign"],
        icon: "🥞",
      },
    ]

    return mockConnections[Math.floor(Math.random() * mockConnections.length)]
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        setScanError(null)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setScanError("Camera access denied. Please enable camera permissions.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }, [])

  const scanQRCode = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    setIsScanning(true)
    stopCamera()

    try {
      // In real implementation, you would use a QR code library here
      const mockQRData = "wc:1234567890abcdef@2?relay-protocol=irn&symKey=abcd1234"
      const result = await processQRCode(mockQRData)
      setConnectionData(result)
    } catch (error) {
      console.error("Error processing QR code:", error)
      setScanError("Failed to process QR code. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }, [processQRCode, stopCamera])

  const handleConnect = useCallback(async () => {
    if (!connectionData) return

    setIsConnecting(true)

    try {
      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onWalletConnect(connectionData)
      onClose()
    } catch (error) {
      console.error("Connection failed:", error)
      setScanError("Connection failed. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }, [connectionData, onWalletConnect, onClose])

  const resetScanner = useCallback(() => {
    setConnectionData(null)
    setScanError(null)
    setIsScanning(false)
    setIsConnecting(false)
  }, [])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum"
      case 56:
        return "BSC"
      case 137:
        return "Polygon"
      case 42161:
        return "Arbitrum"
      case 8453:
        return "Base"
      default:
        return `Chain ${chainId}`
    }
  }

  const getChainColor = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "text-blue-500"
      case 56:
        return "text-yellow-500"
      case 137:
        return "text-purple-500"
      case 42161:
        return "text-blue-600"
      case 8453:
        return "text-indigo-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary z-50 flex flex-col">
      {/* Header with Back Button */}
      <PageHeader
        title="QR Connect"
        subtitle="Scan QR to connect Web3 dApps"
        onBack={onClose}
        badge="eco-friendly"
        rightContent={
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-text-tertiary dark:text-text-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-4">
        {!connectionData && !isScanning && (
          <div className="space-y-6">
            {/* Camera Scanner */}
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary flex items-center gap-2">
                  <Camera className="w-5 h-5 text-soft-primary" />
                  QR Code Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Scanner overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-soft-primary rounded-lg border-dashed animate-pulse">
                      <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-soft-primary"></div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-soft-primary"></div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-soft-primary"></div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-soft-primary"></div>
                    </div>
                  </div>

                  {/* Instructions overlay */}
                  {!cameraActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="w-12 h-12 mx-auto mb-4 opacity-70" />
                        <p className="text-lg font-semibold mb-2">Camera Not Active</p>
                        <p className="text-sm opacity-80">Tap "Start Camera" to begin scanning</p>
                      </div>
                    </div>
                  )}
                </div>

                {scanError && (
                  <div className="flex items-center space-x-2 p-3 bg-soft-error/10 border border-soft-error/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-soft-error" />
                    <p className="text-sm text-soft-error">{scanError}</p>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  {!cameraActive ? (
                    <Button
                      onClick={startCamera}
                      className="bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium px-8 shadow-soft"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={scanQRCode}
                        className="bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium px-8 shadow-soft"
                      >
                        <Scan className="w-5 h-5 mr-2" />
                        Scan QR Code
                      </Button>
                      <Button
                        variant="outline"
                        onClick={stopCamera}
                        className="border-soft-accent/30 text-soft-accent hover:bg-soft-accent/10 hover:border-soft-accent/50"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary">How to Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-soft-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-soft-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-text-dark-primary">Open Web3 dApp</p>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                        Go to any Web3 platform like Uniswap, OpenSea, or Aave
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-soft-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-soft-accent font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-text-dark-primary">Find Connect Button</p>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                        Look for "Connect Wallet" and select WalletConnect option
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-soft-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-soft-secondary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-text-dark-primary">Scan QR Code</p>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                        Use this scanner to scan the QR code displayed on the website
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported Platforms */}
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary">
                  Supported Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Uniswap", icon: "🦄", desc: "DEX Trading" },
                    { name: "OpenSea", icon: "🌊", desc: "NFT Marketplace" },
                    { name: "Aave", icon: "👻", desc: "DeFi Lending" },
                    { name: "PancakeSwap", icon: "🥞", desc: "BSC DEX" },
                    { name: "Compound", icon: "🏛️", desc: "Money Market" },
                    { name: "1inch", icon: "🔄", desc: "DEX Aggregator" },
                  ].map((platform, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <div>
                        <p className="font-medium text-text-primary dark:text-text-dark-primary text-sm">
                          {platform.name}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{platform.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scanning State */}
        {isScanning && (
          <div className="flex-1 flex items-center justify-center">
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 w-full max-w-sm shadow-soft-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-soft-glow shadow-soft">
                  <Scan className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
                  Processing QR Code
                </h3>
                <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
                  Analyzing connection request...
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-soft-primary to-soft-accent h-2 rounded-full animate-pulse w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Connection Data */}
        {connectionData && (
          <div className="space-y-4">
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full flex items-center justify-center text-2xl shadow-soft">
                      {connectionData.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary">
                        {connectionData.dapp}
                      </CardTitle>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                        via {connectionData.platform}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-soft-success/20 text-soft-success border-soft-success/30">
                    <Wifi className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Connection Details */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary dark:text-text-dark-secondary text-sm">Network</span>
                    <span className={`font-semibold text-sm ${getChainColor(connectionData.chainId)}`}>
                      {getChainName(connectionData.chainId)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary dark:text-text-dark-secondary text-sm">Address</span>
                    <span className="font-mono text-sm text-text-primary dark:text-text-dark-primary">
                      {connectionData.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary dark:text-text-dark-secondary text-sm">Methods</span>
                    <span className="text-sm text-text-primary dark:text-text-dark-primary">
                      {connectionData.methods.length} permissions
                    </span>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2">
                    Requested Permissions
                  </h4>
                  <div className="space-y-2">
                    {connectionData.methods.map((method, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 bg-soft-primary/10 rounded-lg border border-soft-primary/20"
                      >
                        <Shield className="w-4 h-4 text-soft-primary" />
                        <span className="text-sm text-text-primary dark:text-text-dark-primary font-medium">
                          {method}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start space-x-2 p-3 bg-soft-warning/10 border border-soft-warning/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-soft-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-soft-warning">Security Notice</p>
                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                      Only connect to trusted dApps. CarbonFi will never ask for your private keys.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex-1 bg-gradient-to-r from-soft-success to-soft-primary hover:from-soft-success/90 hover:to-soft-primary/90 text-white font-medium shadow-soft"
                  >
                    {isConnecting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetScanner}
                    className="border-neutral-300 dark:border-neutral-600 text-text-secondary dark:text-text-dark-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
