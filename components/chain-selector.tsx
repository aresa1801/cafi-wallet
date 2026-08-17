"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, Gem } from "lucide-react"
import { useState } from "react"

interface ChainSelectorProps {
  selectedChain: "ethereum"
  onChainChange: (chain: "ethereum") => void
}

const chains = {
  ethereum: {
    name: "Ethereum Mainnet",
    color: "bg-[#627EEA]",
    short: "Ethereum",
    icon: "◆",
  },
}

export function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentChain = chains[selectedChain] ?? chains.ethereum

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className={`h-2 w-2 rounded-full ${currentChain.color}`} />
          {currentChain.short}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="end">
        <button
          onClick={() => {
            onChainChange("ethereum")
            setIsOpen(false)
          }}
          className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
        >
          <span className="h-2 w-2 rounded-full bg-[#627EEA]" />
          Ethereum Mainnet
          <span className="ml-auto text-xs text-emerald-500">✓</span>
        </button>
      </PopoverContent>
    </Popover>
  )
}
