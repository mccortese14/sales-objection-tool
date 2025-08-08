import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Cocktail Maker',
  description: 'AI-powered cocktail making app that identifies ingredients from photos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-cocktail-light min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-cocktail-light via-white to-cocktail-accent/20">
          {children}
        </div>
      </body>
    </html>
  )
}