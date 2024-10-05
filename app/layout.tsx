import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Haloweave Jobs',
  description: 'AI-powered job application assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}