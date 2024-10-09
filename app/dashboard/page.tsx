'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Header from '@/components/Header';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import { useState } from 'react';

export default function Dashboard() {
  const [isGmailSynced, setIsGmailSynced] = useState(false);

  const handleGmailSync = () => {
    // Implement Gmail sync logic here
    setIsGmailSynced(true);
  };

  return (
    <>  
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Gmail Sync */}
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Mail className="w-12 h-12 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">Sync your Gmail</h2>
            <p className="text-muted-foreground mb-4 text-center">
              Connect your Gmail account to start organizing your job applications automatically.
            </p>
            <Button 
              className="w-full max-w-xs transition-colors hover:bg-black"
              onClick={handleGmailSync}
              disabled={isGmailSynced}
            >
              {isGmailSynced ? 'Gmail Synced' : 'Sync Gmail'}
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Application Statistics</CardTitle>
            <CardDescription>Your job application summary</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Job Emails" value="0" />
            <StatCard title="Applications Sent" value="0" />
            <StatCard title="Callbacks / Interviews" value="0" />
            <StatCard title="Success Rate" value="0%" />
          </CardContent>
        </Card>

        {/* Resume Analyzer */}
        <ResumeAnalyzer />

        {/* Chatbot */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Chat with your personal job search assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Our AI-powered chatbot is coming soon to help you with your job search!</p>
          </CardContent>
        </Card>

        {/* Suggested Jobs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Suggested Jobs</CardTitle>
            <CardDescription>Personalized job recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We are working on integrating job recommendations from Adzuna. Stay tuned!</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}