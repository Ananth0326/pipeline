import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
        }

        // 1. Fetch the raw HTML from the target URL
        // Warning: Some sites block raw fetch requests.
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch URL. Status: ${response.status}` }, { status: 400 });
        }

        const html = await response.text();

        // 2. Parse HTML and clean up junk to save AI tokens using cheerio
        const $ = cheerio.load(html);
        
        // Remove structural junk that doesn't contain job data
        $('script, style, noscript, iframe, img, svg, footer, header, nav').remove();

        const rawText = $('body').text()
            .replace(/\s+/g, ' ') // Collapse multiple whitespace to a single space
            .trim();

        // Take up to 15,000 characters to ensure we fit in fast/cheap context limits while getting the JD
        const truncatedText = rawText.slice(0, 15000);

        // 3. Setup Gemini API
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
You are a highly precise AI assistant designed for a job tracker application.
I am going to provide you with the raw text extracted from a job posting webpage.
Your singular goal is to extract the pertinent information and return it EXACTLY as a raw JSON object. 
DO NOT wrap the output in markdown code blocks (like \`\`\`json). Just output the raw JSON object.

Extract to this exact JSON schema:
{
  "company_name": "String. The name of the company hiring. Infer from the text or URL.",
  "role_title": "String. The job title being offered.",
  "location": "String. Job location, e.g., 'Remote', 'New York, NY', etc. Empty if unknown.",
  "jd_text": "String. Create a neatly summarized and easy to read description of the role, responsibilities, and requirements using bullet points (e.g. use '- ' for bullets). Do not include massive boilerplate text. Max 1000 characters."
}

Here is the extracted text from the URL (${url}):

${truncatedText}
`;

        // 4. Generate the response
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 5. Parse JSON (strip potential markdown wrapping just in case Gemini disobeys)
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
            const parsedData = JSON.parse(cleanJsonString);
            return NextResponse.json({ data: parsedData });
        } catch (jsonError) {
            console.error('Failed to parse Gemini output as JSON:', responseText);
            return NextResponse.json({ error: 'AI failed to return valid structured data.' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Extraction Error:', error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred during extraction.' }, { status: 500 });
    }
}
