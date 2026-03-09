'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [i18nReady, setI18nReady] = useState(false)

  useEffect(() => {
    // Import and initialize i18n FIRST before setting mounted
    const initI18n = async () => {
      try {
        const i18n = (await import('@/lib/i18n')).default

        // Check localStorage for saved language first, then use default (en)
        const savedLang = localStorage.getItem('language')
        const supportedLanguages = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'ru', 'ar']

        // Default to English unless saved language exists
        let targetLang = 'en'
        if (savedLang && supportedLanguages.includes(savedLang)) {
          targetLang = savedLang
        }

        // Set html lang attribute
        document.documentElement.lang = targetLang

        // Sync i18n language with target language BEFORE rendering
        if (i18n.language !== targetLang) {
          await i18n.changeLanguage(targetLang)
        }

        // Mark i18n as ready and then allow rendering
        setI18nReady(true)
        setMounted(true)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        // Still allow rendering even if i18n fails
        setI18nReady(true)
        setMounted(true)
      }
    }

    initI18n()
  }, [])

  // Don't render anything until i18n is initialized to prevent hydration error
  if (!mounted || !i18nReady) {
    return null
  }

  return <ThemeProvider>{children}</ThemeProvider>
}
