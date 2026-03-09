import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { LayoutClient } from './layout-client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SilverMind - Brain Training for Seniors',
  description: 'Language-independent brain training games for seniors aged 60-70',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID

  // Detect language from headers for SSR (simplified version)
  // In production, you might want to use cookies or more sophisticated detection
  const getLanguage = () => {
    // Default to Korean since this is a Korean-language service
    return 'ko'
  }

  return (
    <html lang={getLanguage()} suppressHydrationWarning>
      <body className={inter.className}>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
