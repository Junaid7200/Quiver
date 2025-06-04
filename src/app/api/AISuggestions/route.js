import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
    try {
        const { deckName, flashcards } = await request.json();

        // Format the flashcards content for the prompt
        const flashcardsContent = flashcards
            .map(f => `Q: ${f.front_content}\nA: ${f.back_content}`)
            .join('\n\n');

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an AI tutor that analyzes flashcard decks and suggests missing topics. 
                    Keep suggestions concise and friendly. Stay to the point and don't add unnecessary phrases.
                    Format your response as a natural suggestion like: "Your deck A covers X and Y, but doesn't include Z which is important for this topic."`
                },
                {
                    role: "user",
                    content: `Analyze this flashcard deck named "${deckName}":\n\n${flashcardsContent}\n\nSuggest ONE important subtopic that's missing from this deck.`
                }
            ],
            model: "llama3-70b-8192",
            temperature: 0.7,
            max_tokens: 150,
        });

        const suggestion = completion.choices[0].message.content.trim();
        return NextResponse.json({ suggestion });

    } catch (error) {
        console.error('Error generating suggestion:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestion' },
            { status: 500 }
        );
    }
}