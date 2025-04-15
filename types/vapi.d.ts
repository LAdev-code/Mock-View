// TypeScript type definitions for VAPI message and event structures

/**
 * Enum for different types of messages in the VAPI system
 */
enum MessageTypeEnum {
  TRANSCRIPT = "transcript",           // Voice transcription messages
  FUNCTION_CALL = "function-call",    // AI function call requests
  FUNCTION_CALL_RESULT = "function-call-result",  // Function call results
  ADD_MESSAGE = "add-message",        // New message additions
}

/**
 * Enum for different roles in the conversation
 */
enum MessageRoleEnum {
  USER = "user",           // User/candidate messages
  SYSTEM = "system",       // System messages
  ASSISTANT = "assistant", // AI interviewer messages
}

/**
 * Enum for transcript message types
 */
enum TranscriptMessageTypeEnum {
  PARTIAL = "partial", // Interim transcription results
  FINAL = "final",    // Final transcription results
}

/**
 * Base interface for all VAPI messages
 */
interface BaseMessage {
  type: MessageTypeEnum;
}

/**
 * Interface for voice transcription messages
 */
interface TranscriptMessage extends BaseMessage {
  type: MessageTypeEnum.TRANSCRIPT;
  role: MessageRoleEnum;
  transcriptType: TranscriptMessageTypeEnum;
  transcript: string;      // The actual transcribed text
}

/**
 * Interface for AI function call requests
 */
interface FunctionCallMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL;
  functionCall: {
    name: string;          // Name of the function to call
    parameters: unknown;    // Parameters for the function
  };
}

/**
 * Interface for function call results
 */
interface FunctionCallResultMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL_RESULT;
  functionCallResult: {
    forwardToClientEnabled?: boolean;  // Whether to send result to client
    result: unknown;                   // Function result data
    [a: string]: unknown;              // Additional properties
  };
}

/**
 * Union type for all possible message types
 */
type Message =
  | TranscriptMessage
  | FunctionCallMessage
  | FunctionCallResultMessage;
