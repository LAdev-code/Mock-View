// Vapi SDK initialization for voice interview functionality
import Vapi from "@vapi-ai/web";

// Create a new instance of Vapi with API token from environment variables
// This enables voice-based interactions and AI interview capabilities
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);
