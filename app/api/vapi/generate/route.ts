// API route for generating interview questions using AI and saving to Firestore
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

/**
 * POST handler for generating interview questions
 * Generates customized interview questions based on role, level, and tech stack
 * Creates a new interview document in Firestore with the generated questions
 */
export async function POST(request: Request) {
  // Extract interview parameters from request body
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    // Use Google's Gemini AI to generate interview questions
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    // Create new interview document in Firestore
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),    // Convert comma-separated string to array
      questions: JSON.parse(questions),    // Parse generated questions string to array
      userId: userid,
      finalized: true,                    // Mark as ready for taking
      coverImage: getRandomInterviewCover(), // Assign random cover image
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

/**
 * GET handler - simple health check endpoint
 */
export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
