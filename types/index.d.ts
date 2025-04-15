// TypeScript type definitions for core app data structures

/**
 * Interview feedback data structure
 * Contains detailed assessment of an interview performance
 */
interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;     // Category name (e.g., "Communication Skills")
    score: number;    // Score out of 100
    comment: string;  // Detailed feedback for this category
  }>;
  strengths: string[];           // List of candidate's strong points
  areasForImprovement: string[]; // List of areas needing improvement
  finalAssessment: string;       // Overall interview assessment
  createdAt: string;             // ISO timestamp
}

/**
 * Interview session data structure
 * Represents a complete interview configuration
 */
interface Interview {
  id: string;
  role: string;              // Job role (e.g., "Frontend Developer")
  level: string;             // Experience level (e.g., "Junior", "Senior")
  questions: string[];       // List of interview questions
  techstack: string[];      // Required technologies
  createdAt: string;        // ISO timestamp
  userId: string;           // Interview creator's ID
  type: string;             // Interview type (e.g., "Technical", "Behavioral")
  finalized: boolean;       // Whether interview is ready to take
}

/**
 * Parameters for creating interview feedback
 */
interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[]; // Interview conversation
  feedbackId?: string;     // Optional - for updating existing feedback
}

/**
 * User profile data structure
 */
interface User {
  name: string;
  email: string;
  id: string;
}

/**
 * Props for the InterviewCard component
 */
interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  loading?: boolean;  // Optional loading state for skeleton display
}

/**
 * Props for the Agent component (AI interviewer)
 */
interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview"; // Whether to generate questions or conduct interview
  questions?: string[];
}

/**
 * Next.js route parameters
 */
interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

/**
 * Parameters for fetching feedback by interview ID
 */
interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

/**
 * Parameters for fetching latest interviews
 */
interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

/**
 * Parameters for user sign-in
 */
interface SignInParams {
  email: string;
  idToken: string;
}

/**
 * Parameters for user sign-up
 */
interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

/**
 * Form type identifier for authentication forms
 */
type FormType = "sign-in" | "sign-up";

/**
 * Props for the interview form component
 */
interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

/**
 * Props for the tech stack icons component
 */
interface TechIconProps {
  techStack: string[];
}
