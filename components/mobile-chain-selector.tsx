"use client"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface MobileChainSelectorProps {
  selectedChain: "ethereum"
  onChainChange: (chain: "ethereum") => void
}

const chains = {
  ethereum: {
    name: "Ethereum",
    color: "bg-[#627EEA]",
    gradient: "from-[#627EEA] to-[#8AA4F5]",
    icon: "◆",
    textColor: "text-[#627EEA]",
  },
}

export function MobileChainSelector({ selectedChain, onChainChange }: MobileChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentChain = chains["ethereum"]

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
      <PopoverContent className="w-44 p-0" align="end">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                value="Ethereum"
                onSelect={() => {
                  onChainChange("ethereum")
                  setIsOpen(false)
                }}
              >
                ◆ Ethereum Mainnet
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
