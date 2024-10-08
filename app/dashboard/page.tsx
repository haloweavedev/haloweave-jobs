'use client';

import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Overview / Summary Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Your job application summary</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Job Emails" value="0" />
          <StatCard title="Applications Sent" value="0" />
          <StatCard title="Callbacks / Interviews" value="0" />
          <StatCard title="Success Rate" value="0%" />
        </CardContent>
      </Card>

      {/* Inbox & Email Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inbox & Email Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Button>Sync Gmail</Button>
            <Button variant="outline">Disconnect Gmail</Button>
          </div>
          <p>Email categorization will be displayed here.</p>
        </CardContent>
      </Card>

      {/* AI-Powered Interaction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chat with Your Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <p>AI chatbot interface will be implemented here.</p>
        </CardContent>
      </Card>

      {/* Application Tracker */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interactive job application timeline and job opportunities board will be displayed here.</p>
        </CardContent>
      </Card>

      {/* Profile & Resume Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile & Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <UserProfile />
          <Separator className="my-4" />
          <p>Resume upload and analysis features will be added here.</p>
        </CardContent>
      </Card>

      {/* Placeholder for other sections */}
      <Card>
        <CardHeader>
          <CardTitle>More Features Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Notifications, Analytics & Insights, and other features will be added in future updates.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}