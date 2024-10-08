import './globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'


export const metadata: Metadata = {
  title: 'Haloweave Jobs - AI-Powered Job Application Assistant',
  description: 'Simplify your job search with AI-powered precision. Haloweave Jobs analyzes your resume, organizes your emails, and finds tailored opportunities.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}