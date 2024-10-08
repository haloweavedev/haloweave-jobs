'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, ReactNode } from 'react'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { initSmoothScroll } from '../utils/smoothScroll'
import { initAnimations } from '../utils/animations'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    initSmoothScroll();
    initAnimations();
  }, []);

  return (
    <div className="min-h-screen bg-white font-poppins">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-all duration-300">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Image
              src="/haloweaveLogoHorizontal.svg"
              alt="Haloweave Jobs Logo"
              width={120}
              height={40}
            />
            <div className="hidden md:flex space-x-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#contact">Contact</NavLink>
            </div>
            <div className="hidden md:flex space-x-4 items-center">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-primary transition duration-300">Dashboard</Link>
                  <UserButton afterSignOutUrl="/" />
                </>
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
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#contact">Contact</NavLink>
              <div className="mt-4 space-y-2">
                {isSignedIn ? (
                  <>
                    <Link href="/dashboard" className="block text-gray-600 hover:text-primary transition duration-300">Dashboard</Link>
                    <UserButton afterSignOutUrl="/" />
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="block text-gray-600 hover:text-primary transition duration-300">Login</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="block bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 text-center">Sign Up</button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-white py-20 pt-[10rem]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-[30px]">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simplify Your Job Search with AI-Powered Precision</h1>
                <p className="text-xl text-gray-600 mb-8">Your personal job assistant that analyzes your resume, organizes your emails, and finds tailored opportunities.</p>
                <div className="flex space-x-4">
                  <Link href="/signup" className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">Start Your Free Trial</Link>
                  <Link href="#how-it-works" className="border border-primary text-primary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">Learn More</Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/hero-artwork.jpg"
                  alt="Haloweave Jobs Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Haloweave Jobs Empowers Your Job Hunt</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number={1}
                title="AI Resume Analysis"
                description="Upload your resume, and our AI evaluates your skills, experience, and preferences to suggest the best job opportunities."
              />
              <StepCard
                number={2}
                title="Seamless Gmail Integration"
                description="We automatically categorize job-related emails and responses, labeling follow-ups, interviews, and more for you."
              />
              <StepCard
                number={3}
                title="Natural Language Interaction"
                description="Use conversational AI to ask questions like, 'What's the status of my Google application?' or 'Show me upcoming interviews.'"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-blue-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Features Tailored for Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Resume Analysis"
                description="Tailored job suggestions based on your skills and career goals."
                icon="🎯"
              />
              <FeatureCard
                title="Email Organization"
                description="Never lose track of an application again with auto-categorization and labels."
                icon="📨"
              />
              <FeatureCard
                title="Conversational Assistant"
                description="Ask questions about your job search, and get real-time answers from our custom AI."
                icon="💬"
              />
              <FeatureCard
                title="Real-Time Notifications"
                description="Get notified instantly when there's a job-related email or follow-up."
                icon="🔔"
              />
              <FeatureCard
                title="Intuitive Dashboard"
                description="Manage all your job applications, emails, and tasks from one sleek interface."
                icon="📊"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Haloweave Jobs?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ReasonCard
                title="Increase Callback Rates"
                description="With our AI's precision job matching, you'll apply for jobs that truly fit your profile."
              />
              <ReasonCard
                title="Efficiency"
                description="Spend less time sifting through emails and applications, and focus on what matters—your career."
              />
              <ReasonCard
                title="Personalized Assistance"
                description="It's like having a dedicated job assistant available 24/7."
              />
              <ReasonCard
                title="Scalable Solution"
                description="Whether you're managing one application or 100, Haloweave Jobs adapts effortlessly."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Take Control of Your Job Search Today</h2>
            <p className="text-xl mb-8">Join thousands of professionals using Haloweave Jobs to streamline their job application process.</p>
            <div className="flex justify-center space-x-4">
              <Link href="/signup" className="bg-white text-primary px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">Get Started Now</Link>
              <Link href="/demo" className="border border-white text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition">Book a Demo</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-blue-300">About Us</Link></li>
                <li><Link href="/features" className="hover:text-blue-300">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-300">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-blue-300">Blog</Link></li>
                <li><Link href="/support" className="hover:text-blue-300">Support</Link></li>
                <li><Link href="/contact" className="hover:text-blue-300">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-blue-300">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-300">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-2xl hover:text-blue-300">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-2xl hover:text-blue-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-2xl hover:text-blue-300">
                  <i className="fab fa-facebook"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 Haloweave Jobs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link href={href} className="text-gray-600 hover:text-primary">{children}</Link>
  )
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

interface ReasonCardProps {
  title: string;
  description: string;
}

function ReasonCard({ title, description }: ReasonCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}