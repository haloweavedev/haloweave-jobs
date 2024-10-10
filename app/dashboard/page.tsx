'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mail, Briefcase, User, Building } from "lucide-react";
import Header from '@/components/Header';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import Chatbot from '@/components/Chatbot';
import { getEmails } from '@/app/actions';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState<any>({});
  const [labeledCount, setLabeledCount] = useState<number>(0);
  const [jobRelatedEmails, setJobRelatedEmails] = useState<number>(0);
  const [sentApplications, setSentApplications] = useState<number>(0);
  const [receivedResponses, setReceivedResponses] = useState<number>(0);

  useEffect(() => {
    if (isLoaded && user) {
      checkGmailStatus();
      fetchJobApplicationStats();
      fetchEmails();
    }

    const errorParam = searchParams.get('error');
    const errorMessage = searchParams.get('message');
    if (errorParam) {
      setError(`Error: ${errorParam}${errorMessage ? ` - ${decodeURIComponent(errorMessage)}` : ''}`);
    }

    const successParam = searchParams.get('success');
    if (successParam === 'GmailConnected') {
      setIsGmailConnected(true);
      setSuccessMessage('Gmail connected successfully!');
      setError(null);
      router.replace('/dashboard'); // Clear URL params
    }
  }, [isLoaded, user, searchParams, router]);

  const checkGmailStatus = async () => {
    try {
      const response = await fetch('/api/gmail/sync-status');
      if (response.ok) {
        const { isSynced } = await response.json();
        setIsGmailConnected(isSynced);
      } else {
        throw new Error('Failed to check Gmail status');
      }
    } catch (error) {
      console.error('Error checking Gmail status:', error);
      setError('Failed to check Gmail status');
    }
  };

  const handleConnectGmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gmail/connect');
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to initiate Gmail connection');
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      setError('Failed to connect Gmail');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncGmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gmail/sync', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setLabeledCount(data.labeledCount);
        setJobRelatedEmails(data.jobRelatedEmailsCount);
        setSentApplications(data.sentApplicationsCount);
        setReceivedResponses(data.receivedResponsesCount);
        setSuccessMessage(`Successfully labeled ${data.labeledCount} emails and processed ${data.jobRelatedEmailsCount} job-related emails`);
        await checkGmailStatus();
        await fetchJobApplicationStats();
        await fetchEmails(); // Add this line to fetch updated emails after syncing
      } else {
        throw new Error('Failed to sync Gmail');
      }
    } catch (error) {
      console.error('Error syncing Gmail:', error);
      setError('Failed to sync Gmail');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectGmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gmail/disconnect', { method: 'POST' });
      if (response.ok) {
        setIsGmailConnected(false);
        setLabeledCount(0);
        setJobRelatedEmails(0);
        setSentApplications(0);
        setReceivedResponses(0);
        setSuccessMessage('Gmail disconnected successfully');
      } else {
        throw new Error('Failed to disconnect Gmail');
      }
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
      setError('Failed to disconnect Gmail');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this new function to fetch emails
  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const fetchedEmails = await getEmails();
      console.log('Fetched emails in component:', fetchedEmails);
      setEmails(fetchedEmails);
    } catch (err) {
      console.error('Error fetching emails in component:', err);
      setError('Failed to fetch emails');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobApplicationStats = async () => {
    try {
      const response = await fetch('/api/job-applications/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching job application stats:', error);
      setError('Failed to fetch job application stats. Please try again.');
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  console.log('Clerk User ID:', user?.id);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gmail Integration</CardTitle>
            <CardDescription>Connect and sync your Gmail account</CardDescription>
          </CardHeader>
          <CardContent>
            {isGmailConnected ? (
              <div>
                <p className="mb-4">Gmail is connected and synced.</p>
                <p className="mb-2">Labeled job-related emails: {labeledCount}</p>
                <p className="mb-2">Processed job-related emails: {jobRelatedEmails}</p>
                <p className="mb-2">Sent job applications: {sentApplications}</p>
                <p className="mb-4">Received responses: {receivedResponses}</p>
                <div className="flex space-x-4">
                  <Button onClick={handleSyncGmail} disabled={isLoading}>
                    {isLoading ? 'Syncing...' : 'Sync Gmail'}
                  </Button>
                  <Button onClick={handleDisconnectGmail} disabled={isLoading} variant="destructive">
                    Disconnect Gmail
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleConnectGmail} disabled={isLoading}>
                {isLoading ? 'Connecting...' : 'Connect Gmail'}
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Applications"
            value={stats?.totalApplications || 0}
            icon={<Briefcase className="h-8 w-8 text-blue-500" />}
          />
          <StatCard
            title="Response Rate"
            value={`${((stats?.responseRate || 0) * 100).toFixed(1)}%`}
            icon={<Mail className="h-8 w-8 text-green-500" />}
          />
          <StatCard
            title="Interviews Scheduled"
            value={stats?.statusBreakdown?.find(s => s.status === 'INTERVIEW_SCHEDULED')?._count || 0}
            icon={<User className="h-8 w-8 text-purple-500" />}
          />
          <StatCard
            title="Offers Received"
            value={stats?.statusBreakdown?.find(s => s.status === 'OFFER_RECEIVED')?._count || 0}
            icon={<Building className="h-8 w-8 text-yellow-500" />}
          />
        </div>

        {/* Emails Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Job-Related Emails</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading emails...</p>
            ) : emails.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {emails.map((email) => (
                  <div key={email.id} className="border p-4 rounded">
                    <h3 className="font-bold">{email.subject}</h3>
                    <p>From: {email.from}</p>
                    <p>Date: {new Date(email.sentDate).toLocaleString()}</p>
                    <p className="truncate">{email.snippet}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No job-related emails found. Try syncing your Gmail account.</p>
            )}
          </CardContent>
        </Card>

        {/* Application Status Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.statusBreakdown?.map((status) => (
              <div key={status.status} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>{status.status.replace('_', ' ')}</span>
                  <span>{status._count}</span>
                </div>
                <Progress 
                  value={(status._count / (stats.totalApplications || 1)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chatbot */}
        {emails.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
               <Chatbot />
            </CardContent>
          </Card>
        )}

        {/* Resume Analyzer */}
        <ResumeAnalyzer />

        {/* AI Assistant */}
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

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}