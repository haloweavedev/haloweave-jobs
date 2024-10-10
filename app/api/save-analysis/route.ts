import { NextResponse } from 'next/server';
import { saveAnalysis } from '@/app/actions';

export async function POST(req: Request) {
  const { userId, analysis } = await req.json();

  try {
    const result = await saveAnalysis(userId, analysis);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving resume analysis:', error);
    return NextResponse.json({ error: 'Failed to save resume analysis' }, { status: 500 });
  }
}
