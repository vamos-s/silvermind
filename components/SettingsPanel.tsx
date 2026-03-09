'use client'

import { ThemeToggle } from './ThemeToggle'
import { LanguageSelector } from './LanguageSelector'

export function SettingsPanel() {
  return (
    <div className="fixed top-6 right-6 flex items-center gap-2 z-50">
      <LanguageSelector />
      <ThemeToggle />
    </div>
  )
}
