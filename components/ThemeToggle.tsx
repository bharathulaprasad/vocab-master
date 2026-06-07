'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevents hydration errors by waiting until the component loads
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8"></div> // Empty placeholder

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-amber-200/50 dark:bg-slate-700/50 hover:scale-110 transition-transform text-xl"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}