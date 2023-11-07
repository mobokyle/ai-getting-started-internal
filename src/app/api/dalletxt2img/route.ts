import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

dotenv.config({ path: `.env.local` });

export async function POST(request: Request) {
  let promptData;

  // Attempt to parse the request body and catch any JSON parsing errors
  try {
    promptData = await request.json();
  } catch (parseError) {
    console.error('Failed to parse JSON body:', parseError);
    return NextResponse.json({ error: 'Bad Request. Failed to parse JSON body.' }, { status: 400 });
  }

  const { prompt } = promptData;

  // Validate the prompt input
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return NextResponse.json({ error: 'Bad Request. Prompt is required and must be a non-empty string.' }, { status: 400 });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt,
        n: 1,  // Number of images to generate (optional)
        size: "256x256",  // Size of the generated images (optional)
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    // Check if the error is an AxiosError and has a response
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response from OpenAI API:', error.response.data);
      // Respond with the status code from the OpenAI API response if available
      return NextResponse.json({ error: error.message }, { status: error.response.status });
    } else {
      // For non-Axios errors or Axios errors without a response, log the error and return a 500 status code
      console.error('Server error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
}

