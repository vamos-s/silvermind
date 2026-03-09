'use client'

import { useEffect, useState } from 'react'
import { I18nProvider } from '@/components/I18nProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    // Detect browser language and set html lang attribute
    const browserLang = navigator.language.split('-')[0]
    const supportedLanguages = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'ru', 'ar']

    const detectedLang = supportedLanguages.includes(browserLang) ? browserLang : 'en'
    setLang(detectedLang)

    // Set html lang attribute
    document.documentElement.lang = detectedLang
  }, [])

  return (
    <I18nProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </I18nProvider>
  )
}
