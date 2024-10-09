'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs';
import { getResumeAnalysis, saveResume } from '@/app/actions';

export default function ResumeAnalyzer() {
  const { user } = useUser();
  const [resumeData, setResumeData] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to parse PDF');
        }

        const { text } = await response.json();
        setResumeData(text);
        
        if (user?.id) {
          const result = await saveResume(user.id, text);
          console.log('Save result:', result);
          setSuccessMessage(result.message);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setError(`Failed to process the file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const analyzeResume = async () => {
    if (!resumeData) {
      setError('Please upload a resume first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { analysis } = await getResumeAnalysis(resumeData);
      if (!analysis) {
        throw new Error('Received empty analysis from OpenAI');
      }
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(`Failed to analyze the resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>AI Resume Analyzer</CardTitle>
        <CardDescription>Upload your resume for AI-powered analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileUpload} 
          disabled={isLoading} 
          className="mb-4"
        />
        <Button 
          onClick={analyzeResume}
          disabled={isLoading || !resumeData}
          className="w-full mb-4 hover:bg-black"
        >
          Analyze Resume
        </Button>
        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 text-green-500">
            {successMessage}
          </div>
        )}
        {resumeData && (
          <div className="mt-4">
            <h3 className="font-semibold">Extracted Text:</h3>
            <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-auto max-h-60">
              {resumeData}
            </pre>
          </div>
        )}
        {analysis && (
          <div className="mt-4">
            <h3 className="font-semibold">Resume Analysis:</h3>
            <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-auto max-h-60">
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}