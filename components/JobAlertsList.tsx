'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Job {
  companyLogoURL: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  applyLink: string;
  ifEasyApply: boolean;
}

interface JobAlert {
  date: string;
  jobs: Job[];
}

export default function JobAlertsList() {
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

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

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="space-y-8 mb-8">
      <h2 className="text-2xl font-bold">Latest Job Alerts</h2>
      {isLoading ? (
        <p>Loading job alerts...</p>
      ) : jobAlerts.length > 0 ? (
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {jobAlerts.map((alert, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <Card className="m-4">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">{alert.date}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {alert.jobs.slice(0, 6).map((job, jobIndex) => (
                          <JobCard key={jobIndex} job={job} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <p>No job alerts found.</p>
      )}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
    return (
      <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 group overflow-hidden">
        <CardContent className="p-4 flex flex-col justify-center h-full relative">
          <div className="transition-all duration-300 transform group-hover:-translate-y-2">
            <img src={job.companyLogoURL} alt={`${job.companyName} logo`} className="w-12 h-12 mb-2 rounded object-contain mx-auto" />
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:line-clamp-none text-center">{job.jobTitle}</h3>
            <p className="text-xs mb-1 text-gray-600 text-center">{job.companyName}</p>
            <p className="text-xs mb-1 text-gray-600 text-center">{job.location}</p>
            <p className="text-xs mb-1 text-gray-600 text-center">{job.jobType}</p>
          </div>
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
            <Button asChild className="w-full text-xs" variant={job.ifEasyApply ? "default" : "outline"}>
              <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                {job.ifEasyApply ? "Easy Apply" : "Apply"}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }