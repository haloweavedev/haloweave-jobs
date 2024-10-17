'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JobAlertsSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gmail/sync-job-alerts', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setSyncedCount(data.jobAlertsCount);
      } else {
        throw new Error('Failed to sync job alerts');
      }
    } catch (error) {
      console.error('Error syncing job alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      </CardContent>
    </Card>
  );
}