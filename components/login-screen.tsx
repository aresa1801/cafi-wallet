"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Shield, Smartphone, Key, Sparkles } from "lucide-react"

interface LoginScreenProps {
  onLogin: (type: "smart" | "self-custody") => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showMnemonic, setShowMnemonic] = useState(false)

  const mockMnemonic =
    "forest green carbon offset sustainable future blockchain decentralized finance ecology nature environment clean energy"

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-carbon-primary/10 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-carbon-accent/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-carbon-purple/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md space-y-6 animate-fade-in relative z-10">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img src="/images/carbonfi-logo-full.png" alt="CarbonFi Logo" className="h-24 w-auto object-contain" />
              <div className="absolute inset-0 bg-gradient-to-br from-carbon-primary/20 to-carbon-accent/20 rounded-lg blur-xl animate-glow-pulse"></div>
            </div>
          </div>
          <div>
            <p className="text-dark-muted text-sm mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-carbon-accent" />
              Sustainable Web3 Wallet
            </p>
          </div>
        </div>

        {!showMnemonic ? (
          <div className="space-y-4">
            {/* Smart Wallet Option */}
            <Card
              className="border-2 border-dark-border bg-dark-card hover:border-carbon-primary transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-carbon-primary/20"
              onClick={() => onLogin("smart")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-carbon-primary to-carbon-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6 text-dark-bg" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Smart Wallet</CardTitle>
                    <CardDescription className="text-carbon-accent">Google Backup & Recovery</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-dark-muted mb-4">
                  Easy setup with Google account backup. Perfect for beginners.
                </p>
                <Button className="w-full bg-gradient-to-r from-carbon-primary to-carbon-secondary hover:from-carbon-secondary hover:to-carbon-primary text-dark-bg font-semibold transition-all duration-300 hover:scale-105">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </CardContent>
            </Card>

            {/* Self-Custody Option */}
            <Card
              className="border-2 border-dark-border bg-dark-card hover:border-carbon-accent transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-carbon-accent/20"
              onClick={() => setShowMnemonic(true)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-carbon-accent to-carbon-purple rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Self-Custody Wallet</CardTitle>
                    <CardDescription className="text-carbon-purple">Full control with seed phrase</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-dark-muted mb-4">
                  Maximum security with your own seed phrase. For advanced users.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-2 border-carbon-accent text-carbon-accent hover:bg-carbon-accent hover:text-dark-bg transition-all duration-300 hover:scale-105"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Generate Seed Phrase
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-2 border-carbon-primary bg-dark-card animate-neon-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Shield className="w-6 h-6 text-carbon-primary" />
                <span>Your Seed Phrase</span>
              </CardTitle>
              <CardDescription className="text-dark-muted">
                Write down these 12 words in order. Keep them safe and never share them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 p-4 bg-dark-surface rounded-xl border border-dark-border">
                {mockMnemonic.split(" ").map((word, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm p-2 bg-dark-card rounded-lg">
                    <span className="text-carbon-accent font-mono text-xs">{index + 1}.</span>
                    <span className="font-medium text-white">{word}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-carbon-primary to-carbon-secondary hover:from-carbon-secondary hover:to-carbon-primary text-dark-bg font-semibold transition-all duration-300 hover:scale-105"
                  onClick={() => onLogin("self-custody")}
                >
                  I've Saved My Seed Phrase
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-dark-border text-dark-muted hover:bg-dark-surface"
                  onClick={() => setShowMnemonic(false)}
                >
                  Back to Options
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-xs text-dark-muted space-y-2">
          <p className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-carbon-primary rounded-full animate-pulse"></div>
            Secured by blockchain technology
          </p>
          <p className="flex items-center justify-center gap-1">
            <Leaf className="w-3 h-3 text-carbon-primary" />
            Carbon neutral transactions
          </p>
        </div>
      </div>
    </div>
  )
}
