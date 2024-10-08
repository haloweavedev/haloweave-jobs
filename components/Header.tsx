'use client';

import Image from 'next/image'
import Link from 'next/link'
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs'

export default function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-all duration-300">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src="/haloweaveLogoHorizontal.svg"
              alt="Haloweave Jobs Logo"
              width={120}
              height={40}
            />
          </Link>
          <div className="hidden md:flex space-x-8">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary transition duration-300">Dashboard</Link>
                <Link href="/job-search" className="text-gray-600 hover:text-primary transition duration-300">Job Search</Link>
                <Link href="/applications" className="text-gray-600 hover:text-primary transition duration-300">Applications</Link>
              </>
            ) : (
              <>
                <Link href="/#features" className="text-gray-600 hover:text-primary transition duration-300">Features</Link>
                <Link href="/#how-it-works" className="text-gray-600 hover:text-primary transition duration-300">How It Works</Link>
                <Link href="/#pricing" className="text-gray-600 hover:text-primary transition duration-300">Pricing</Link>
              </>
            )}
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-primary transition duration-300">Login</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">Sign Up</button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}