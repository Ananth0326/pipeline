import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GROQ_API_KEY is not configured on the server.' }, { status: 500 });
        }

        // 1. Fetch the raw HTML from the target URL
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch URL. Status: ${response.status}` }, { status: 400 });
        }

        const html = await response.text();

        // 2. Parse HTML and clean up junk using cheerio
        const $ = cheerio.load(html);
        $('script, style, noscript, iframe, img, svg, footer, header, nav').remove();

        const rawText = $('body').text()
            .replace(/\s+/g, ' ')
            .trim();

        // Take up to 15,000 characters to ensure we fit in fast context limits
        const truncatedText = rawText.slice(0, 15000);

        // 3. Setup Groq API
        const groq = new Groq({ apiKey });

        const prompt = `
You are a highly precise AI assistant designed for a job tracker application.
I am going to provide you with the raw text extracted from a job posting webpage.
Your singular goal is to extract the pertinent information and return it EXACTLY as a raw JSON object. 
DO NOT wrap the output in markdown code blocks (like \`\`\`json). Just output the pure JSON object directly.

Extract to this exact JSON schema:
{
  "company_name": "String. The name of the company hiring. Infer from the text or URL.",
  "role_title": "String. The job title being offered.",
  "location": "String. Job location, e.g., 'Remote', 'New York, NY', etc. Empty if unknown.",
  "jd_text": "String. Create a neatly summarized and easy to read description of the role, responsibilities, and requirements using bullet points (e.g. use '- ' for bullets). Max 1000 characters."
}

Here is the extracted text from the URL (${url}):

${truncatedText}
`;

        // 4. Generate the response using LLaMA 3.3
        const result = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
            max_tokens: 1024,
        });

        const responseText = result.choices[0]?.message?.content || '';

        // 5. Parse JSON (strip potential markdown wrapping)
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
            const parsedData = JSON.parse(cleanJsonString);
            return NextResponse.json({ data: parsedData });
        } catch (jsonError) {
            console.error('Failed to parse Groq output as JSON:', responseText);
            return NextResponse.json({ error: 'AI failed to return valid structured data.' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Extraction Error:', error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred during extraction.' }, { status: 500 });
    }
}
