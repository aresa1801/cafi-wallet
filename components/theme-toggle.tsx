"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  if (!mounted) {
    return <div className="w-16 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "relative w-16 h-8 rounded-full p-1 transition-all duration-500 ease-in-out",
        "bg-gradient-to-r from-soft-primary/20 to-soft-accent/20 hover:from-soft-primary/30 hover:to-soft-accent/30",
        "border border-soft-primary/30 hover:border-soft-primary/50",
        "shadow-soft hover:shadow-soft-md",
        className,
      )}
    >
      {/* Background gradient that changes with theme */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-500 ease-in-out",
          isDark
            ? "bg-gradient-to-r from-indigo-900/50 to-purple-900/50"
            : "bg-gradient-to-r from-emerald-100/50 to-cyan-100/50",
        )}
      />

      {/* Sliding toggle */}
      <div
        className={cn(
          "relative w-6 h-6 rounded-full transition-all duration-500 ease-in-out transform",
          "bg-white dark:bg-neutral-800 shadow-soft",
          "flex items-center justify-center",
          isDark ? "translate-x-8" : "translate-x-0",
        )}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-indigo-600 transition-all duration-300" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500 transition-all duration-300" />
        )}
      </div>

      {/* Decorative elements */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-500 ease-in-out",
          "before:absolute before:w-1 before:h-1 before:bg-soft-success before:rounded-full",
          "before:top-2 before:left-2 before:animate-pulse",
          "after:absolute after:w-1 after:h-1 after:bg-soft-accent after:rounded-full",
          "after:bottom-2 after:right-2 after:animate-pulse",
          isDark ? "before:opacity-30 after:opacity-30" : "before:opacity-60 after:opacity-60",
        )}
      />
    </Button>
  )
}
