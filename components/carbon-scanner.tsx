"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, CheckCircle, X, Leaf, Loader2, AlertTriangle, Scan } from "lucide-react"
import { PageHeader } from "./page-header"
import { Badge } from "@/components/ui/badge"

interface CarbonScannerProps {
  onClose: () => void
  onOffsetComplete: (amount: number, type: string) => void
}

export function CarbonScanner({ onClose, onOffsetComplete }: CarbonScannerProps) {
  const [scanMode, setScanMode] = useState<"camera" | "upload">("camera")
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "processing" | "complete" | "error">("idle")
  const [scannedData, setScannedData] = useState<any>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        setScanStatus("idle")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setScanStatus("error")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }, [])

  const handleScan = useCallback(async () => {
    if (scanMode === "camera") {
      if (!videoRef.current || !canvasRef.current) return

      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (!context) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      setScanStatus("scanning")
      stopCamera()

      // Simulate OCR processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setScannedData({
        type: "receipt",
        items: [
          { name: "Groceries", co2_kg: 5.2 },
          { name: "Electronics", co2_kg: 12.8 },
        ],
        total_co2_kg: 18.0,
      })
      setScanStatus("complete")
    } else {
      // Handle file upload scan
      if (!fileInputRef.current?.files?.length) return

      setScanStatus("processing")
      // Simulate file upload and processing
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setScannedData({
        type: "invoice",
        items: [
          { name: "Flight (NYC-LAX)", co2_kg: 250.0 },
          { name: "Hotel (3 nights)", co2_kg: 30.0 },
        ],
        total_co2_kg: 280.0,
      })
      setScanStatus("complete")
    }
  }, [scanMode, stopCamera])

  const handleOffset = useCallback(() => {
    if (scannedData) {
      onOffsetComplete(scannedData.total_co2_kg, scannedData.type)
      setScanStatus("idle")
      setScannedData(null)
      onClose() // Close scanner after offset
    }
  }, [scannedData, onOffsetComplete, onClose])

  const resetScanner = useCallback(() => {
    setScanStatus("idle")
    setScannedData(null)
    stopCamera()
  }, [stopCamera])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary z-50 flex flex-col">
      <PageHeader
        title="Carbon Scanner"
        subtitle="Scan receipts or invoices to offset carbon"
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

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {scanStatus === "idle" && (
          <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary flex items-center gap-2">
                <Camera className="w-5 h-5 text-soft-primary" />
                Choose Scan Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={scanMode} onValueChange={(value: "camera" | "upload") => setScanMode(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select scan mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camera">Camera Scan (Receipts)</SelectItem>
                  <SelectItem value="upload">Upload Document (Invoices)</SelectItem>
                </SelectContent>
              </Select>

              {scanMode === "camera" && (
                <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
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
              )}

              {scanMode === "upload" && (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <Upload className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mb-4" />
                  <p className="text-text-secondary dark:text-text-dark-secondary mb-2">Drag & drop or</p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Browse Files
                  </Button>
                  <Input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" />
                </div>
              )}

              {scanStatus === "error" && (
                <div className="flex items-center space-x-2 p-3 bg-soft-error/10 border border-soft-error/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-soft-error" />
                  <p className="text-sm text-soft-error">Failed to access camera or process scan. Please try again.</p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {scanMode === "camera" && !cameraActive && (
                  <Button
                    onClick={startCamera}
                    className="bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium px-8 shadow-soft"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Camera
                  </Button>
                )}
                {(scanMode === "camera" && cameraActive) || scanMode === "upload" ? (
                  <Button
                    onClick={handleScan}
                    disabled={scanStatus === "scanning" || scanStatus === "processing"}
                    className="bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium px-8 shadow-soft"
                  >
                    {scanStatus === "scanning" || scanStatus === "processing" ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Scan className="w-5 h-5 mr-2" />
                    )}
                    {scanStatus === "scanning"
                      ? "Scanning..."
                      : scanStatus === "processing"
                        ? "Processing..."
                        : "Scan Document"}
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )}

        {(scanStatus === "scanning" || scanStatus === "processing") && (
          <div className="flex-1 flex items-center justify-center">
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 w-full max-w-sm shadow-soft-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-soft-glow shadow-soft">
                  <Scan className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
                  {scanStatus === "scanning" ? "Scanning Document" : "Analyzing Carbon Footprint"}
                </h3>
                <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
                  {scanStatus === "scanning" ? "Capturing image..." : "Calculating CO₂ emissions..."}
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-soft-primary to-soft-accent h-2 rounded-full animate-pulse w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {scanStatus === "complete" && scannedData && (
          <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-soft-success" />
                Scan Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-text-dark-secondary text-sm">Document Type</span>
                  <Badge className="bg-soft-primary/20 text-soft-primary border-soft-primary/30 capitalize">
                    {scannedData.type}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary dark:text-text-dark-secondary text-sm">Estimated CO₂</span>
                  <span className="font-bold text-lg text-text-primary dark:text-text-dark-primary">
                    {scannedData.total_co2_kg.toFixed(1)} kg
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2">Breakdown</h4>
                <div className="space-y-2">
                  {scannedData.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-soft-success/10 rounded-lg border border-soft-success/20"
                    >
                      <span className="text-sm text-text-primary dark:text-text-dark-primary font-medium">
                        {item.name}
                      </span>
                      <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
                        {item.co2_kg.toFixed(1)} kg CO₂
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleOffset}
                  className="flex-1 bg-gradient-to-r from-soft-success to-soft-primary hover:from-soft-success/90 hover:to-soft-primary/90 text-white font-medium shadow-soft"
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  Offset Carbon
                </Button>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="border-neutral-300 dark:border-neutral-600 text-text-secondary dark:text-text-dark-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-transparent"
                >
                  <Scan className="w-4 h-4" />
                  Scan Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
