'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobAlert {
  id: string;
  messageId: string;
  threadId: string;
  from: string;
  toRecipients: string[];
  subject: string;
  snippet: string;
  body: string;
  sentDate: string;
  receivedDate: string;
  labels: string[];
}

export default function JobAlertsSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);
  const [latestJobAlert, setLatestJobAlert] = useState<JobAlert | null>(null);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gmail/sync-job-alerts', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setSyncedCount(data.jobAlertsCount);
        fetchLatestJobAlert();
      } else {
        throw new Error('Failed to sync job alerts');
      }
    } catch (error) {
      console.error('Error syncing job alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestJobAlert = async () => {
    try {
      const response = await fetch('/api/job-alerts/');
      if (response.ok) {
        const data = await response.json();
        setLatestJobAlert(data);
      } else {
        throw new Error('Failed to fetch latest job alert');
      }
    } catch (error) {
      console.error('Error fetching latest job alert:', error);
    }
  };

  useEffect(() => {
    fetchLatestJobAlert();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync LinkedIn Job Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Synced job alerts: {syncedCount}</p>
        <Button onClick={handleSync} disabled={isLoading}>
          {isLoading ? 'Syncing...' : 'Sync Job Alerts'}
        </Button>
        {latestJobAlert && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Latest Job Alert</h3>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(latestJobAlert, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}