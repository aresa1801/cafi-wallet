"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Camera,
  Leaf,
  Zap,
  Car,
  Plane,
  Home,
  ShoppingCart,
  X,
  Check,
  Upload,
  RotateCcw,
  Calculator,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "./page-header"
import { EcoBadge } from "./eco-badge"

interface CarbonScannerProps {
  onClose: () => void
  onOffsetComplete: (amount: number, type: string) => void
}

interface ScanResult {
  type: "receipt" | "fuel" | "flight" | "utility"
  amount: number
  carbonFootprint: number
  details: {
    merchant?: string
    date?: string
    items?: string[]
    distance?: number
    fuelType?: string
    flightRoute?: string
    utilityType?: string
  }
}

export function CarbonScanner({ onClose, onOffsetComplete }: CarbonScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock OCR processing function
  const processImage = useCallback(async (imageData: string): Promise<ScanResult> => {
    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock OCR results - in real implementation, this would use actual OCR
    const mockResults: ScanResult[] = [
      {
        type: "receipt",
        amount: 45.67,
        carbonFootprint: 2.3,
        details: {
          merchant: "Green Grocery Store",
          date: new Date().toLocaleDateString(),
          items: ["Organic vegetables", "Local fruits", "Dairy products"],
        },
      },
      {
        type: "fuel",
        amount: 89.5,
        carbonFootprint: 18.7,
        details: {
          merchant: "Shell Gas Station",
          date: new Date().toLocaleDateString(),
          fuelType: "Gasoline",
          distance: 450,
        },
      },
      {
        type: "flight",
        amount: 299.99,
        carbonFootprint: 125.4,
        details: {
          merchant: "AirAsia",
          date: new Date().toLocaleDateString(),
          flightRoute: "Jakarta → Singapore",
          distance: 900,
        },
      },
      {
        type: "utility",
        amount: 156.78,
        carbonFootprint: 45.2,
        details: {
          merchant: "PLN Indonesia",
          date: new Date().toLocaleDateString(),
          utilityType: "Electricity",
        },
      },
    ]

    return mockResults[Math.floor(Math.random() * mockResults.length)]
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }, [])

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL("image/jpeg")

    setIsProcessing(true)
    stopCamera()

    try {
      const result = await processImage(imageData)
      setScanResult(result)
    } catch (error) {
      console.error("Error processing image:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [processImage, stopCamera])

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        setIsProcessing(true)

        try {
          const result = await processImage(imageData)
          setScanResult(result)
        } catch (error) {
          console.error("Error processing image:", error)
        } finally {
          setIsProcessing(false)
        }
      }
      reader.readAsDataURL(file)
    },
    [processImage],
  )

  const handleOffset = useCallback(() => {
    if (scanResult) {
      onOffsetComplete(scanResult.carbonFootprint, scanResult.type)
      onClose()
    }
  }, [scanResult, onOffsetComplete, onClose])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "receipt":
        return ShoppingCart
      case "fuel":
        return Car
      case "flight":
        return Plane
      case "utility":
        return Home
      default:
        return Leaf
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "receipt":
        return "text-soft-success"
      case "fuel":
        return "text-soft-warning"
      case "flight":
        return "text-soft-accent"
      case "utility":
        return "text-soft-secondary"
      default:
        return "text-soft-primary"
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "receipt":
        return "bg-soft-success/10 border-soft-success/20"
      case "fuel":
        return "bg-soft-warning/10 border-soft-warning/20"
      case "flight":
        return "bg-soft-accent/10 border-soft-accent/20"
      case "utility":
        return "bg-soft-secondary/10 border-soft-secondary/20"
      default:
        return "bg-soft-primary/10 border-soft-primary/20"
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary z-50 flex flex-col">
      {/* Header with Back Button */}
      <PageHeader
        title="Carbon Scanner"
        subtitle="Scan receipts & bills to offset carbon"
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

      <div className="flex-1 overflow-auto">
        {!scanResult && !isProcessing && (
          <div className="p-4 space-y-6">
            {/* Scan Options */}
            <Tabs defaultValue="camera" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/60 dark:bg-bg-dark-secondary/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700">
                <TabsTrigger
                  value="camera"
                  className="data-[state=active]:bg-soft-primary data-[state=active]:text-white"
                  onClick={() => !cameraActive && startCamera()}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:bg-soft-accent data-[state=active]:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="camera" className="mt-4">
                <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
                  <CardContent className="p-4">
                    <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden mb-4">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <canvas ref={canvasRef} className="hidden" />

                      {/* Camera overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-40 border-2 border-soft-primary rounded-lg border-dashed animate-pulse">
                          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-soft-primary"></div>
                          <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-soft-primary"></div>
                          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-soft-primary"></div>
                          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-soft-primary"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={captureImage}
                        disabled={!cameraActive}
                        className="bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium px-8 shadow-soft"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Capture
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cameraActive ? stopCamera : startCamera}
                        className="border-soft-accent/30 text-soft-accent hover:bg-soft-accent/10 hover:border-soft-accent/50"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {cameraActive ? "Stop" : "Start"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
                  <CardContent className="p-6">
                    <div
                      className="border-2 border-dashed border-soft-accent/30 rounded-xl p-8 text-center cursor-pointer hover:bg-soft-accent/5 hover:border-soft-accent/50 transition-colors duration-300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-soft-accent mx-auto mb-4" />
                      <p className="text-text-primary dark:text-text-dark-primary font-medium mb-2">
                        Upload Receipt or Bill
                      </p>
                      <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
                        Click to select image from gallery
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Supported Types */}
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary">
                  Supported Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-soft-success/10 rounded-lg border border-soft-success/20">
                    <ShoppingCart className="w-5 h-5 text-soft-success" />
                    <span className="text-text-primary dark:text-text-dark-primary text-sm font-medium">
                      Shopping Receipts
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-soft-warning/10 rounded-lg border border-soft-warning/20">
                    <Car className="w-5 h-5 text-soft-warning" />
                    <span className="text-text-primary dark:text-text-dark-primary text-sm font-medium">
                      Fuel Bills
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-soft-accent/10 rounded-lg border border-soft-accent/20">
                    <Plane className="w-5 h-5 text-soft-accent" />
                    <span className="text-text-primary dark:text-text-dark-primary text-sm font-medium">
                      Flight Tickets
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-soft-secondary/10 rounded-lg border border-soft-secondary/20">
                    <Home className="w-5 h-5 text-soft-secondary" />
                    <span className="text-text-primary dark:text-text-dark-primary text-sm font-medium">
                      Utility Bills
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 w-full max-w-sm shadow-soft-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-soft-glow shadow-soft">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
                  Processing Image
                </h3>
                <p className="text-text-secondary dark:text-text-dark-secondary mb-4">Analyzing carbon footprint...</p>
                <Progress value={75} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
                <p className="text-xs text-soft-accent mt-2">Using AI-powered OCR technology</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scan Results */}
        {scanResult && (
          <div className="p-4 space-y-4">
            <Card className={`border-2 ${getTypeBg(scanResult.type)} shadow-soft-lg`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const IconComponent = getTypeIcon(scanResult.type)
                      return <IconComponent className={`w-6 h-6 ${getTypeColor(scanResult.type)}`} />
                    })()}
                    <div>
                      <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary capitalize">
                        {scanResult.type} Detected
                      </CardTitle>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                        {scanResult.details.merchant}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-soft-success/20 text-soft-success border-soft-success/30">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Transaction Details */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-secondary dark:text-text-dark-secondary">Amount</p>
                      <p className="text-text-primary dark:text-text-dark-primary font-semibold">
                        ${scanResult.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary dark:text-text-dark-secondary">Date</p>
                      <p className="text-text-primary dark:text-text-dark-primary font-semibold">
                        {scanResult.details.date}
                      </p>
                    </div>
                    {scanResult.details.distance && (
                      <div>
                        <p className="text-text-secondary dark:text-text-dark-secondary">Distance</p>
                        <p className="text-text-primary dark:text-text-dark-primary font-semibold">
                          {scanResult.details.distance} km
                        </p>
                      </div>
                    )}
                    {scanResult.details.flightRoute && (
                      <div>
                        <p className="text-text-secondary dark:text-text-dark-secondary">Route</p>
                        <p className="text-text-primary dark:text-text-dark-primary font-semibold">
                          {scanResult.details.flightRoute}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carbon Footprint */}
                <div className="bg-gradient-to-r from-soft-success/10 to-soft-primary/10 rounded-lg p-4 border border-soft-success/20 relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-5 h-5 text-soft-success" />
                      <span className="text-text-primary dark:text-text-dark-primary font-semibold">
                        Carbon Footprint
                      </span>
                      <EcoBadge variant="carbon-neutral" size="sm" />
                    </div>
                    <span className="text-2xl font-bold text-soft-success">{scanResult.carbonFootprint} kg CO₂</span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                    This activity generated approximately {scanResult.carbonFootprint} kg of CO₂ emissions
                  </p>
                </div>

                {/* Items/Details */}
                {scanResult.details.items && (
                  <div>
                    <p className="text-text-primary dark:text-text-dark-primary font-semibold mb-2">Items Detected:</p>
                    <div className="space-y-1">
                      {scanResult.details.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-soft-success rounded-full"></div>
                          <span className="text-text-secondary dark:text-text-dark-secondary">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Offset Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleOffset}
                    className="flex-1 bg-gradient-to-r from-soft-success to-soft-primary hover:from-soft-success/90 hover:to-soft-primary/90 text-white font-medium shadow-soft"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Offset {scanResult.carbonFootprint} kg CO₂
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setScanResult(null)}
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
