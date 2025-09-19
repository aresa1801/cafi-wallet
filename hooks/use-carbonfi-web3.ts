"use client"

import { useContext } from "react"
import { CarbonFiWeb3Context, type CarbonFiWeb3ContextType } from "@/providers/carbonfi-web3-provider"

export const useCarbonFiWeb3 = (): CarbonFiWeb3ContextType => {
  const context = useContext(CarbonFiWeb3Context)
  if (context === undefined) {
    throw new Error("useCarbonFiWeb3 must be used within a CarbonFiWeb3Provider")
  }
  return context
}

export default useCarbonFiWeb3
