"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle, Mail, MessageSquare, Menu, X } from 'lucide-react'

export default function Home() {
  const { isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('professionals')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const NavItems = () => (
    <>
      <Link href="#features" className="block py-2 text-lg hover:text-primary transition-colors">Features</Link>
      <Link href="#how-it-works" className="block py-2 text-lg hover:text-primary transition-colors">How It Works</Link>
      <Link href="#pricing" className="block py-2 text-lg hover:text-primary transition-colors">Pricing</Link>
    </>
  )

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Image
              src="/haloweaveLogoHorizontal.svg"
              alt="Haloweave Jobs Logo"
              width={120}
              height={40}
            />
            <div className="hidden md:flex space-x-8 items-center">
              <NavItems />
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition">Dashboard</Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost">Login</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button>Sign Up</Button>
                  </SignUpButton>
                </>
              )}
            </div>
            <button className="md:hidden text-foreground" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-background shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 md:hidden`}>
        <div className="flex flex-col h-full justify-between p-6">
          <div>
            <button className="mb-8 text-foreground" onClick={toggleMenu}>
              <X size={24} />
            </button>
            <nav className="space-y-4">
              <NavItems />
            </nav>
          </div>
          <div className="space-y-4">
            {isSignedIn ? (
              <>
              <UserButton afterSignOutUrl="/"/>
                <Link href="/dashboard" className="block w-full">
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">Login</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 pt-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Simplify Your Job Search with AI-Powered Precision
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Your personal job assistant that analyzes your resume, organizes your emails, and finds tailored opportunities.
                </p>
                <div className="flex space-x-4">
                  {isSignedIn ? (
                    <Button asChild size="lg">
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <SignUpButton mode="modal">
                      <Button size="lg">Start Your Free Trial</Button>
                    </SignUpButton>
                  )}
                  <Button asChild variant="outline" size="lg">
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
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
              {[
                {
                  title: "AI Resume Analysis",
                  description: "Upload your resume, and our AI evaluates your skills, experience, and preferences to suggest the best job opportunities.",
                  icon: <CheckCircle className="h-12 w-12 text-primary" />
                },
                {
                  title: "Seamless Gmail Integration",
                  description: "We automatically categorize job-related emails and responses, labeling follow-ups, interviews, and more for you.",
                  icon: <Mail className="h-12 w-12 text-primary" />
                },
                {
                  title: "Natural Language Interaction",
                  description: "Use conversational AI to ask questions like, 'What's the status of my Google application?' or 'Show me upcoming interviews.'",
                  icon: <MessageSquare className="h-12 w-12 text-primary" />
                }
              ].map((step, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      {step.icon}
                      <span>{step.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-50 dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Features Tailored for You</h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-8xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="professionals">For Professionals</TabsTrigger>
                <TabsTrigger value="employers">For Employers</TabsTrigger>
              </TabsList>
              <TabsContent value="professionals">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                  {[
                    { title: "Resume Analysis", description: "Get tailored job suggestions based on your skills and career goals." },
                    { title: "Email Organization", description: "Never lose track of an application again with auto-categorization and labels." },
                    { title: "Conversational Assistant", description: "Ask questions about your job search and get real-time answers from our custom AI." },
                    { title: "Application Tracking", description: "Keep all your job applications organized in one intuitive dashboard." },
                  ].map((feature, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="employers">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                  {[
                    { title: "AI-Powered Candidate Matching", description: "Find the perfect candidates for your open positions using our advanced AI algorithms." },
                    { title: "Automated Screening", description: "Save time with AI-assisted initial candidate screening and shortlisting." },
                    { title: "Interview Scheduling", description: "Streamline your hiring process with our integrated interview scheduling system." },
                    { title: "Analytics Dashboard", description: "Gain insights into your hiring pipeline with comprehensive analytics and reporting." },
                  ].map((feature, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Take Control of Your Job Search Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals using Haloweave Jobs to streamline their job application process and land their dream roles faster.
            </p>
            <div className="flex justify-center space-x-4">
              <SignUpButton mode="modal">
                <Button size="lg" variant="secondary">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
              <Button asChild size="lg" variant="secondary">
                <Link href="/demo">Book a Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-2xl hover:text-white transition">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-2xl hover:text-white transition">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-2xl hover:text-white transition">
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