"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, Wifi, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { useCarbonFiWeb3 } from "@/hooks/use-carbonfi-web3"

interface QRWalletScannerProps {
  onBack: () => void
}

export function QRWalletScanner({ onBack }: QRWalletScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "failed">("idle")
  const videoRef = useRef<HTMLVideoElement>(null)
  const { connect, setConnectedDApp, isConnected } = useCarbonFiWeb3()

  const startScanning = async () => {
    try {
      setIsScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const simulateQRScan = () => {
    // Simulate scanning a WalletConnect QR code
    const mockWalletConnectUri = "wc:example-session@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=example-key"
    setScanResult(mockWalletConnectUri)
    setConnectionStatus("connecting")

    // Simulate connection process
    setTimeout(async () => {
      try {
        await connect()
        setConnectedDApp("Uniswap")
        setConnectionStatus("connected")
        stopScanning()
      } catch (error) {
        setConnectionStatus("failed")
      }
    }, 2000)
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connecting":
        return <Wifi className="h-5 w-5 text-blue-500 animate-pulse" />
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <QrCode className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connecting":
        return "Connecting to dApp..."
      case "connected":
        return "Successfully connected!"
      case "failed":
        return "Connection failed"
      default:
        return "Scan QR code to connect"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <PageHeader title="Connect dApp" subtitle="Scan QR code to connect with Web3 applications" onBack={onBack} />

      <div className="p-4 space-y-6">
        {/* Scanner Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-600" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera View */}
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
              {isScanning ? (
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Camera not active</p>
                  </div>
                </div>
              )}

              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-green-500 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startScanning} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="outline" className="flex-1 bg-transparent">
                  Stop Scanning
                </Button>
              )}

              <Button onClick={simulateQRScan} variant="outline">
                Demo Scan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div className="flex-1">
                <p className="font-medium">{getStatusText()}</p>
                {scanResult && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{scanResult}</p>}
              </div>
              <Badge variant={connectionStatus === "connected" ? "default" : "secondary"}>{connectionStatus}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">How to connect:</h3>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Open a Web3 dApp (like Uniswap, OpenSea, etc.)</li>
                  <li>Click "Connect Wallet" and select "WalletConnect"</li>
                  <li>Scan the QR code displayed on the dApp</li>
                  <li>Approve the connection in CarbonFi Wallet</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Connections */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-lg">Recent Connections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isConnected ? (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                  <div>
                    <p className="font-medium">Uniswap</p>
                    <p className="text-sm text-gray-500">Connected now</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent connections</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
