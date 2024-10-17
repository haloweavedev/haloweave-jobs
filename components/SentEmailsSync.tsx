'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SentEmailsSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gmail/sync', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setSyncedCount(data.labeledCount);
      } else {
        throw new Error('Failed to sync sent emails');
      }
    } catch (error) {
      console.error('Error syncing sent emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Sent Job Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Synced emails: {syncedCount}</p>
        <Button onClick={handleSync} disabled={isLoading}>
          {isLoading ? 'Syncing...' : 'Sync Sent Emails'}
        </Button>
      </CardContent>
    </Card>
  );
}