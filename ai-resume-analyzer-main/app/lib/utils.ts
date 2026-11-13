import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  // Determine the appropriate unit by calculating the log
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Format with 2 decimal places and round
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();



/**
 * AI models often wrap JSON in ```json fences or add text around it.
 * This extracts the first {...} block and parses it safely.
 */
export function parseFeedback(raw: string): Feedback {
    const cleaned = raw.replace(/```json|```/gi, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("AI did not return JSON");

    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (!parsed?.overallScore && parsed?.overallScore !== 0 || !parsed?.ATS || !parsed?.toneAndStyle || !parsed?.content || !parsed?.structure || !parsed?.skills) {
        throw new Error("AI response is missing required fields");
    }
    return parsed as Feedback;
}
