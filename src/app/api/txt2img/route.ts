import dotenv from "dotenv";
import Replicate from "replicate";
import { NextResponse } from "next/server";

dotenv.config({ path: `.env.local` });

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || "",
  });
  try{
    const output = await replicate.run(
      "cjwbw/stable-diffusion-high-resolution:231e401da17b34aac8f8b3685f662f7fdad9ce1cf504ec0828ba4aac19f7882f",
      {
        input: {
          prompt,
        },
      }
    );
    return NextResponse.json(output);
  }
  catch(error:any){
    return NextResponse.json({error:error.message},{status:500});
  }

}
