'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Import and initialize i18n on client side
    const initI18n = async () => {
      try {
        const i18n = (await import('@/lib/i18n')).default

        // Detect browser language and set html lang attribute
        const browserLang = navigator.language.split('-')[0]
        const supportedLanguages = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'ru', 'ar']

        const detectedLang = supportedLanguages.includes(browserLang) ? browserLang : 'en'

        // Set html lang attribute
        document.documentElement.lang = detectedLang

        // Sync i18n language with detected language
        if (i18n.language !== detectedLang) {
          await i18n.changeLanguage(detectedLang)
        }
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
      }
    }

    initI18n()
  }, [])

  // Don't render until mounted to prevent hydration mismatch
  // This ensures server-rendered HTML matches client-rendered HTML
  if (!mounted) {
    return <ThemeProvider>{children}</ThemeProvider>
  }

  return <ThemeProvider>{children}</ThemeProvider>
}
