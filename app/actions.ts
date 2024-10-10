'use server';

import { getOpenAIClient } from '@/lib/openai-utils';
import { PrismaClient } from '@prisma/client';
import { auth, clerkClient } from '@clerk/nextjs/server';

const prisma = new PrismaClient();
const openai = getOpenAIClient();

export async function getResumeAnalysis(resumeText: string) {
  try {
    console.log('Analyzing resume...');

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes resumes. Provide a structured JSON response with personal-info, skills, and 4 suggested-job-titles based on the resume text. Do not include any markdown formatting or additional text outside of the JSON structure."
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

export async function saveResume(userId: string, resumeText: string) {
  console.log('Attempting to save resume for user:', userId);
  try {
    console.log('Resume data length:', resumeText.length);

    // Fetch the user's email from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error('User email not found');
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.log('User not found. Creating new user.');
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
          resumeText: resumeText,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { clerkId: userId },
        data: { 
          email: email, // Update email in case it has changed
          resumeText: resumeText
        },
      });
    }

    console.log('Resume saved successfully for user:', userId);
    return { message: 'Resume saved successfully' };
  } catch (error) {
    console.error('Error saving resume:', error);
    throw new Error(`Failed to save resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function saveAnalysis(userId: string, analysis: any) {
  console.log('Attempting to save analysis for user:', userId);
  try {
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    await prisma.user.update({
      where: { clerkId: userId },
      data: { 
        resumeAnalysis: analysis
      },
    });

    console.log('Analysis saved successfully for user:', userId);
    return { message: 'Analysis saved successfully' };
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error(`Failed to save analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getEmails() {
  const { userId: clerkId } = auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  try {
    console.log('Fetching emails for Clerk user:', clerkId);
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { emails: true },
    });

    if (!user) {
      console.log('User not found in database');
      return [];
    }

    console.log(`Fetched ${user.emails.length} emails for user`);
    return user.emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw new Error(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getChatResponse(input: string) {
  const { userId: clerkId } = auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  try {
    console.log('Fetching emails for Clerk user:', clerkId);
    
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { emails: true },
    });

    if (!user) {
      console.log('User not found in database');
      return "I'm sorry, but I couldn't find your user account. Please make sure you're logged in and try again.";
    }

    console.log(`Total emails for user ${clerkId}: ${user.emails.length}`);

    const emails = user.emails.sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime()).slice(0, 50);

    console.log(`Fetched ${emails.length} emails for user ${clerkId}`);

    if (emails.length === 0) {
      console.log('No emails found for the user');
      return "I'm sorry, but I don't have any email data to work with for your account. Please make sure your emails are synced and try again.";
    }

    const emailContext = emails.map(email => `
      Subject: ${email.subject}
      From: ${email.from}
      Date: ${email.sentDate.toISOString()}
      Content: ${email.snippet}
    `).join('\n\n');

    console.log('Email context (first 500 characters):', emailContext.substring(0, 500));

    const messages = [
      { role: 'system', content: 'You are an AI assistant helping with job application related queries. Use the provided email context to answer questions. Only reference information explicitly stated in the emails.' },
      { role: 'user', content: `Here are my recent job-related emails:\n\n${emailContext}\n\nBased on these emails, please answer the following question: ${input}` }
    ];

    console.log('Sending request to OpenAI');
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 1500,
      temperature: 0.7,
    });

    console.log('OpenAI response received');

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('OpenAI returned an empty response');
    }

    return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error in getChatResponse:', error);
    throw new Error(`Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}