"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface ChainSelectorProps {
  selectedChain: "arbitrum" | "base" | "polygon"
  onChainChange: (chain: "arbitrum" | "base" | "polygon") => void
}

const chains = {
  arbitrum: {
    name: "Arbitrum",
    color: "bg-blue-500",
    gradient: "from-blue-400 to-blue-600",
    icon: "🔵",
    textColor: "text-blue-400",
  },
  base: {
    name: "Base",
    color: "bg-blue-600",
    gradient: "from-blue-500 to-indigo-600",
    icon: "🔷",
    textColor: "text-blue-300",
  },
  polygon: {
    name: "Polygon",
    color: "bg-purple-500",
    gradient: "from-purple-400 to-purple-600",
    icon: "🟣",
    textColor: "text-purple-400",
  },
}

export function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  const currentChain = chains[selectedChain]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 border-dark-border bg-dark-surface text-white hover:bg-dark-card transition-all duration-300"
        >
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentChain.gradient}`} />
          <span className="text-sm font-medium">{currentChain.name}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-dark-card border-dark-border">
        {Object.entries(chains).map(([key, chain]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChainChange(key as "arbitrum" | "base" | "polygon")}
            className="flex items-center space-x-3 text-white hover:bg-dark-surface cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${chain.gradient}`} />
            <span className="font-medium">{chain.name}</span>
            {key === selectedChain && <span className="ml-auto text-carbon-primary text-lg">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
