import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Route segment config for larger request bodies
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Parse JSON with error handling
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid request format. The video might be too large.' },
        { status: 400 }
      );
    }

    const frames = body.frames as string[];

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json(
        { error: 'No video frames provided' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are an expert martial arts instructor analyzing a student's form performance.

I'm providing you with ${frames.length} sequential frames from a martial arts form video. Analyze these images to provide comprehensive feedback covering:

## Technique Analysis
- Evaluate stance, balance, and body positioning across the sequence
- Assess the execution of techniques (punches, kicks, blocks, strikes)
- Comment on transitions between movements
- Note any incorrect form or alignment issues

## Strengths
- Highlight what the practitioner is doing well
- Identify areas showing good technique or improvement

## Areas for Improvement
- Point out specific techniques that need work
- Explain what corrections should be made
- Provide actionable advice for improvement

## Overall Assessment
- Give an overall rating and summary
- Suggest specific drills or exercises to improve

Be encouraging but constructively critical. Focus on practical, actionable feedback that will help them improve.`;

    // Prepare the content with all frames
    const imageParts = frames.map(frame => ({
      inlineData: {
        data: frame,
        mimeType: 'image/jpeg',
      },
    }));

    // Try multiple models with fallbacks
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
    let result;
    let lastError;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent([prompt, ...imageParts]);
        console.log(`Success with model: ${modelName}`);
        break; // Success, exit loop
      } catch (modelError: any) {
        console.error(`Error with ${modelName}:`, modelError.message);
        lastError = modelError;

        // If it's a 503 (overloaded), try the next model
        if (modelError.message?.includes('503') || modelError.message?.includes('overloaded')) {
          continue;
        } else {
          // For other errors, don't retry
          throw modelError;
        }
      }
    }

    if (!result) {
      throw new Error('All models are currently overloaded. Please try again in a few moments.');
    }

    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing video:', error);

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error && 'response' in error
      ? JSON.stringify((error as any).response)
      : 'No additional details';

    console.error('Error details:', errorDetails);

    return NextResponse.json(
      {
        error: 'Failed to analyze video. Please try again.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
