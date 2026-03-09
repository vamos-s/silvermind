'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Immediately set mounted to allow rendering
    setMounted(true)

    // Import and initialize i18n synchronously if possible
    const initI18n = async () => {
      try {
        const i18n = (await import('@/lib/i18n')).default

        // Check localStorage for saved language first, then use default (ko)
        const savedLang = localStorage.getItem('language')
        const supportedLanguages = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'ru', 'ar']

        // Default to Korean (service default) unless saved language exists
        let targetLang = 'ko'
        if (savedLang && supportedLanguages.includes(savedLang)) {
          targetLang = savedLang
        }

        // Set html lang attribute
        document.documentElement.lang = targetLang

        // Sync i18n language with target language
        if (i18n.language !== targetLang) {
          await i18n.changeLanguage(targetLang)
        }
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
      }
    }

    initI18n()
  }, [])

  // Render immediately after mount - children will re-render when language changes
  return <ThemeProvider>{children}</ThemeProvider>
}
