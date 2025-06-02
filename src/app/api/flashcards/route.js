import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI tutor that creates flashcards. Generate 5-7 question-answer pairs based on the provided content. 
          Format each pair as a JSON object with 'question' and 'answer' fields. 
          Make questions that test understanding, not just memorization.
          Keep answers concise (max 2 sentences).
          Return only the array of flashcard objects.`
        },
        {
          role: "user", 
          content: `Create flashcards from this content: ${content}`
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0].message.content.trim();
    let flashcards;
    
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      flashcards = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
      
      if (!Array.isArray(flashcards) || !flashcards.every(card => 
        card.question && card.answer && 
        typeof card.question === 'string' && 
        typeof card.answer === 'string'
      )) {
        throw new Error('Invalid flashcard format');
      }
    } catch (parseError) {
      console.error('Error parsing flashcards:', parseError);
      return NextResponse.json(
        { error: "Failed to generate valid flashcards" },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcards });

  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: "An error occurred while generating flashcards" },
      { status: 500 }
    );
  }
}