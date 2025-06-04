import { NextResponse } from 'next/server';
import axios from 'axios';

const GROK_API_ENDPOINT = 'YOUR_GROK_API_ENDPOINT';
const GROK_API_KEY = process.env.GROK_API_KEY;

export async function POST(request) {
    try {
        const { deckName, flashcards } = await request.json();

        // Format the flashcards content for the prompt
        const flashcardsContent = flashcards
            .map(f => `Q: ${f.front_content}\nA: ${f.back_content}`)
            .join('\n\n');

        // Construct the prompt for Grok
        const prompt = `Analyze this flashcard deck named "${deckName}":
            
${flashcardsContent}

Based on the content above, suggest ONE important subtopic that's missing from this deck.
Format your response as a natural suggestion like this example:
"Your deck covers X and Y, but doesn't include Z which is important for this topic."
Keep your response concise and friendly.`;

        // Make request to Grok API
        const response = await axios.post(GROK_API_ENDPOINT, {
            messages: [{
                role: 'user',
                content: prompt
            }],
            temperature: 0.7,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${GROK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extract the suggestion from Grok's response
        const suggestion = response.data.choices[0].message.content.trim();

        return NextResponse.json({ suggestion });

    } catch (error) {
        console.error('Error generating suggestion:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestion' },
            { status: 500 }
        );
    }
}