import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <Image
          src="/haloweaveLogoHorizontal.svg"
          alt="Haloweave Jobs Logo"
          width={150}
          height={50}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-primary mb-2">Haloweave Jobs</h1>
        <p className="text-xl text-gray-600">Your AI-powered job application assistant</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Find Your Dream Job</h2>
          <p className="text-gray-600 mb-4">
            Our AI matches you with perfect opportunities based on your skills and preferences.
          </p>
          <Link href="/dashboard" className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Get Started
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Smart Resume Analysis</h2>
          <p className="text-gray-600">
            Our AI analyzes your resume and suggests improvements to increase your chances.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Email Management</h2>
          <p className="text-gray-600">
            Automatically categorize and prioritize your job-related emails.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-2xl font-semibold mb-4">AI Chat Assistant</h2>
          <p className="text-gray-600 mb-4">
            Get instant answers to your job search questions with our AI-powered chat.
          </p>
          <Link href="/chat" className="text-primary hover:underline">Try it now &rarr;</Link>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; 2024 Haloweave Jobs. All rights reserved.</p>
      </footer>
    </div>
  )
}