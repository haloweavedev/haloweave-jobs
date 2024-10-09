'use server'

import OpenAI from "openai";
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getResumeAnalysis(resumeText: string) {
  try {
    console.log('Analyzing resume...');

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes resumes. Provide a structured JSON response with personal-info, skills, and suggested-job-titles based on the resume text. Do not include any markdown formatting or additional text outside of the JSON structure."
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = chatCompletion.choices[0].message.content;
    console.log('Raw OpenAI Analysis:', analysis);

    if (!analysis) {
      throw new Error('OpenAI returned an empty response');
    }

    // Attempt to parse the response as JSON
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      throw new Error('OpenAI response was not valid JSON');
    }

    return { analysis: parsedAnalysis };
  } catch (error) {
    console.error('Error in getResumeAnalysis:', error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function saveResume(userId: string, resumeData: string) {
    console.log('Attempting to save resume for user:', userId);
    try {
      console.log('Resume data length:', resumeData.length);
      
      // Try to find the user first
      let user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
  
      // If user doesn't exist, create them
      if (!user) {
        console.log('User not found. Creating new user.');
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: 'placeholder@example.com', // You should replace this with the actual email from Clerk
            resumeData: {
              text: resumeData
            }
          },
        });
      } else {
        // If user exists, update their resume data
        user = await prisma.user.update({
          where: { clerkId: userId },
          data: { 
            resumeData: {
              text: resumeData
            }
          },
        });
      }
  
      console.log('Resume saved successfully for user:', userId);
      return { message: 'Resume saved successfully' };
    } catch (error) {
      console.error('Error saving resume:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma error code:', error.code);
        console.error('Prisma error meta:', error.meta);
      }
      throw new Error(`Failed to save resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await prisma.$disconnect();
    }
  }