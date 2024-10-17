'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Job {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  applyLink: string;
}

interface JobAlert {
  date: string;
  jobs: Job[];
}

export default function JobAlertsList() {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobAlerts();
  }, []);

  const fetchJobAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/job-alerts');
      if (response.ok) {
        const data = await response.json();
        setJobAlerts(data);
      } else {
        throw new Error('Failed to fetch job alerts');
      }
    } catch (error) {
      console.error('Error fetching job alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mb-6">
      <h2 className="text-2xl font-bold">Latest Job Alerts</h2>
      {isLoading ? (
        <p>Loading job alerts...</p>
      ) : jobAlerts.length > 0 ? (
        jobAlerts.map((alert, index) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <CardTitle>{alert.date}</CardTitle>
            </CardHeader>
            <CardContent>
              {alert.jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {alert.jobs.map((job, jobIndex) => (
                    <Card key={jobIndex} className="relative group">
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p>{job.company}</p>
                        <p>{job.location}</p>
                        <p>{job.jobType}</p>
                        <p>{job.salary}</p>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                            <a href={job.applyLink} target="_blank" rel="noopener noreferrer">Apply</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No jobs found in this alert.</p>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No job alerts found.</p>
      )}
    </div>
  );
}