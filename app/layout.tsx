import './globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Choose weights based on your design requirements
  style: ['normal', 'italic'],
  variable: '--font-poppins', // Optional: for CSS variable use
});

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
      <html lang="en" className={poppins.className}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}