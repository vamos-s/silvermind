'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Initialize i18n on client side
    const initI18n = async () => {
      try {
        const { default: i18nConfig } = await import('@/lib/i18n')
        // i18n is already initialized by the import
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
      }
    }

    initI18n()
  }, [])

  return <>{children}</>
}
