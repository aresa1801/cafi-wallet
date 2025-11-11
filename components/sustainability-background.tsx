"use client"

export function SustainabilityBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-emerald-950 dark:via-green-900/40 dark:to-teal-900/30" />

      {/* Decorative leaf elements - top left */}
      <svg className="absolute -top-20 -left-20 w-80 h-80 opacity-10 dark:opacity-5" viewBox="0 0 200 200" fill="none">
        <path
          d="M100 20Q150 50 160 100Q150 150 100 180Q50 150 40 100Q50 50 100 20Z"
          fill="currentColor"
          className="text-emerald-600"
        />
        <path d="M100 50L120 130M100 50L80 130" stroke="currentColor" strokeWidth="2" className="text-emerald-600" />
      </svg>

      {/* Decorative leaf elements - bottom right */}
      <svg
        className="absolute -bottom-32 -right-32 w-96 h-96 opacity-10 dark:opacity-5"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M100 20Q150 50 160 100Q150 150 100 180Q50 150 40 100Q50 50 100 20Z"
          fill="currentColor"
          className="text-green-600"
        />
        <path d="M100 50L120 130M100 50L80 130" stroke="currentColor" strokeWidth="2" className="text-green-600" />
      </svg>

      {/* Top right leaf accent */}
      <svg
        className="absolute top-32 right-12 w-40 h-40 opacity-15 dark:opacity-8 animate-pulse"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10Q75 25 80 50Q75 75 50 90Q25 75 20 50Q25 25 50 10Z"
          fill="currentColor"
          className="text-teal-500"
        />
        <path d="M50 30L60 70M50 30L40 70" stroke="currentColor" strokeWidth="1.5" className="text-teal-500" />
      </svg>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(16, 185, 129, 0.05) 25%, rgba(16, 185, 129, 0.05) 26%, transparent 27%, transparent 74%, rgba(16, 185, 129, 0.05) 75%, rgba(16, 185, 129, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(16, 185, 129, 0.05) 25%, rgba(16, 185, 129, 0.05) 26%, transparent 27%, transparent 74%, rgba(16, 185, 129, 0.05) 75%, rgba(16, 185, 129, 0.05) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
