import './globals.css'
import type { Metadata } from 'next'

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
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}