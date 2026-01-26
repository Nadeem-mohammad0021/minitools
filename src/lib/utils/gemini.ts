import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in environment variables");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Generate text content using Gemini
 */
export async function generateText(prompt: string, options?: {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: options?.model || "gemini-1.5-flash" 
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate content with AI");
  }
}

/**
 * Analyze text for SEO and content insights
 */
export async function analyzeText(text: string): Promise<{
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  readability: 'easy' | 'medium' | 'hard';
  summary: string;
  suggestions: string[];
}> {
  const prompt = `
    Analyze the following text and provide:
    1. Top 10 important keywords (comma-separated)
    2. Sentiment (positive/negative/neutral)
    3. Readability level (easy/medium/hard)
    4. A brief summary (1-2 sentences)
    5. 3-5 improvement suggestions
    
    Text: "${text}"
    
    Respond in JSON format:
    {
      "keywords": ["keyword1", "keyword2", ...],
      "sentiment": "positive|negative|neutral",
      "readability": "easy|medium|hard",
      "summary": "brief summary",
      "suggestions": ["suggestion1", "suggestion2", ...]
    }
  `;

  const response = await generateText(prompt, { maxTokens: 1000 });
  
  try {
    // Clean up the response to extract JSON
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}') + 1;
    const jsonStr = response.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to analyze text");
  }
}

/**
 * Generate SEO meta tags
 */
export async function generateMetaTags(title: string, description: string, content: string): Promise<{
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  openGraphTitle: string;
  openGraphDescription: string;
}> {
  const prompt = `
    Generate SEO meta tags for the following content:
    Title: "${title}"
    Description: "${description}"
    Content: "${content.substring(0, 1000)}..."
    
    Provide optimized meta tags:
    - Meta title (50-60 characters)
    - Meta description (150-160 characters)
    - Keywords (comma-separated, 5-10 keywords)
    - Open Graph title (same as meta title)
    - Open Graph description (same as meta description)
    
    Respond in JSON format:
    {
      "metaTitle": "optimized title",
      "metaDescription": "optimized description",
      "keywords": "keyword1, keyword2, ...",
      "openGraphTitle": "OG title",
      "openGraphDescription": "OG description"
    }
  `;

  const response = await generateText(prompt, { maxTokens: 800 });
  
  try {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}') + 1;
    const jsonStr = response.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to generate meta tags");
  }
}

/**
 * Generate URL slug from text
 */
export async function generateSlug(text: string): Promise<string> {
  const prompt = `
    Convert the following text into a SEO-friendly URL slug:
    - Use lowercase letters
    - Replace spaces with hyphens
    - Remove special characters
    - Keep it concise (3-5 words max)
    - Make it readable and descriptive
    
    Text: "${text}"
    
    Respond with only the slug, no extra text.
  `;

  const slug = await generateText(prompt, { maxTokens: 50 });
  return slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

/**
 * Analyze image content (if image analysis is supported)
 */
export async function analyzeImage(imageBase64: string, mimeType: string): Promise<{
  description: string;
  objects: string[];
  colors: string[];
  text: string;
}> {
  // Note: Gemini's image analysis requires the image to be sent as part of the prompt
  // This is a placeholder for future implementation
  throw new Error("Image analysis not yet implemented");
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}