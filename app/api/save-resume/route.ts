import { NextResponse } from 'next/server';
import { saveResume } from '@/app/actions';

export async function POST(req: Request) {
  const { userId, resumeText } = await req.json();

  try {
    const result = await saveResume(userId, resumeText);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving resume data:', error);
    return NextResponse.json({ error: 'Failed to save resume data' }, { status: 500 });
  }
}
