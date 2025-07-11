"use client"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface MobileChainSelectorProps {
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

export function MobileChainSelector({ selectedChain, onChainChange }: MobileChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentChain = chains[selectedChain]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/60 text-text-primary dark:text-text-dark-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 shadow-soft"
        >
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentChain.gradient}`} />
          <span className="text-sm font-medium">{currentChain.name}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="end">
        <Command>
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(chains).map(([key, chain]) => (
                <CommandItem
                  key={key}
                  value={chain.name}
                  onSelect={() => {
                    onChainChange(key as "arbitrum" | "base" | "polygon")
                    setIsOpen(false)
                  }}
                >
                  {chain.icon} {chain.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
