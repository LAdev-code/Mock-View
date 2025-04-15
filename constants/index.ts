// Constants for tech mappings, AI interviewer config, feedback schema, and sample data
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

/**
 * Technology name mappings for icon lookup
 * Maps various forms of tech names to their standardized versions
 * Used for displaying correct technology icons
 */
export const mappings = {
  // React variations
  "react.js": "react",
  reactjs: "react",
  react: "react",

  // Next.js variations
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",

  // Vue variations
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",

  // Express variations
  "express.js": "express",
  expressjs: "express",
  express: "express",

  // Node.js variations
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",

  // Database variations
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",

  // DevOps variations
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",

  // Design variations
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",

  // Web technologies
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",

  // Programming languages
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",

  // Frameworks
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",

  // GraphQL
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",

  // Build tools
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",

  // Package managers
  npm: "npm",
  yarn: "yarn",

  // Version control
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",

  // Design tools
  figma: "figma",

  // ORM
  prisma: "prisma",

  // State management
  redux: "redux",
  flux: "flux",

  // Databases
  redis: "redis",

  // Testing
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",

  // Vue state management
  vuex: "vuex",

  // Nuxt.js variations
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",

  // CMS
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",

  // Hosting
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

/**
 * AI Interviewer configuration for VAPI
 * Defines the personality, voice, and behavior of the AI interviewer
 */
export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage: "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  
  // Voice-to-text configuration
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  
  // Text-to-speech configuration
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  
  // AI model configuration
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
- Follow the structured question flow provided in {{questions}}
- Engage naturally & react appropriately
- Be professional, yet warm and welcoming
- Keep responses concise and conversational
- Conclude properly with next steps`
      },
    ],
  },
};

/**
 * Zod schema for interview feedback structure
 * Ensures consistent feedback format with required fields
 */
export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

/**
 * List of available interview cover images
 * Used for visual variety in interview cards
 */
export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

/**
 * Sample interviews for development and testing
 */
export const dummyInterviews: Interview[] = [
    {
        id: "1",
        userId: "user1",
        role: "Frontend Developer",
        type: "Technical",
        techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        level: "Junior",
        questions: ["What is React?"],
        finalized: false,
        createdAt: "2024-03-15T10:00:00Z",
    },
    {
        id: "2",
        userId: "user1",
        role: "Full Stack Developer",
        type: "Mixed",
        techstack: ["Node.js", "Express", "MongoDB", "React"],
        level: "Senior",
        questions: ["What is Node.js?"],
        finalized: false,
        createdAt: "2024-03-14T15:30:00Z",
    },
];
