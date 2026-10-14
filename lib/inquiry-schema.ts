import { z } from "zod";

export const serviceOptions = [
  "UGC videos",
  "Product photos",
  "Post on her TikTok",
  "TikTok Shop collab",
  "Paid usage / Spark Ads",
  "Monthly retainer",
] as const;

export const budgetOptions = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $3,000",
  "$3,000+",
  "Not sure yet",
] as const;

export const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  brand: z.string().min(2, "Please enter your brand or company"),
  website: z.string().optional(),
  services: z.array(z.string()).min(1, "Pick at least one"),
  budget: z.string().min(1, "Pick a budget range"),
  timeline: z.string().optional(),
  message: z.string().min(10, "Tell me a little more (10+ characters)"),
  // Honeypot — bots tend to fill every field. Deliberately unvalidated so a
  // filled value reaches the API route, which then fakes success silently.
  company_website: z.string().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
