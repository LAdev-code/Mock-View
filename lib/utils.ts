// Utility functions for classnames, tech icon lookup, and random cover selection
import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and twMerge for proper Tailwind class merging
 * @param inputs Array of class values or conditional class objects
 * @returns Merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Base URL for tech stack icons from devicon CDN
const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

/**
 * Normalizes technology names to match devicon naming conventions
 * @param tech Technology name to normalize (e.g., 'React.js' -> 'react')
 * @returns Normalized technology name from mappings
 */
const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase()
    .replace(/\.js$/, "")     // Remove .js suffix
    .replace(/\s+/g, "");     // Remove spaces
  return mappings[key as keyof typeof mappings];
};

/**
 * Checks if a tech stack icon exists in the devicon CDN
 * @param url Full URL to the icon
 * @returns Boolean indicating if the icon exists
 */
const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Fetches tech stack icons for display
 * Falls back to a default icon if the specific tech icon isn't found
 * @param techArray Array of technology names
 * @returns Array of objects containing tech name and icon URL
 */
export const getTechLogos = async (techArray: string[]) => {
  // Map each tech to its potential icon URL
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  // Check each URL and fall back to default if needed
  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

/**
 * Gets a random cover image for interviews from predefined list
 * @returns Path to random cover image
 */
export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
