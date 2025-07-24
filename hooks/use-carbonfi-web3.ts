"use client"

import { useContext } from "react"
import { CarbonFiWeb3Context } from "@/providers/carbonfi-web3-provider"

export function useCarbonFiWeb3() {
  const context = useContext(CarbonFiWeb3Context)
  if (context === undefined) {
    throw new Error("useCarbonFiWeb3 must be used within a CarbonFiWeb3Provider")
  }
  return context
}
