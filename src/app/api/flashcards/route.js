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
          Return ONLY a valid JSON array of flashcard objects with no additional text or formatting.
          Example format:
          [
            {"question": "What is X?", "answer": "X is Y."},
            {"question": "How does Z work?", "answer": "Z works by doing A and B."}
          ]`
        },
        {
          role: "user", 
          content: `Create flashcards from this content: ${content}`
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.5, // Lowered for more consistent formatting
      max_tokens: 1000,
    });

    const responseText = completion.choices[0].message.content.trim();
    let flashcards;
    
    try {
      // More robust JSON extraction
      let jsonText = responseText;
      
      // Try to extract JSON if surrounded by other text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      
      // Add more logging to help debug
      console.log("Raw LLM response:", responseText.substring(0, 200) + "...");
      console.log("Extracted JSON:", jsonText.substring(0, 200) + "...");
      
      flashcards = JSON.parse(jsonText);
      
      if (!Array.isArray(flashcards)) {
        throw new Error('Response is not an array');
      }
      
      // Validate each flashcard
      for (const card of flashcards) {
        if (!card.question || !card.answer || 
            typeof card.question !== 'string' || 
            typeof card.answer !== 'string') {
          throw new Error('Invalid flashcard format: ' + JSON.stringify(card));
        }
      }
    } 
    catch (parseError) {
      console.error('Error parsing flashcards:', parseError.message);
      console.error('Response text:', responseText);
      
      // Return a more detailed error
      return NextResponse.json(
        { 
          error: "Failed to generate valid flashcards", 
          details: parseError.message,
          rawResponse: responseText.substring(0, 500)  // Include part of the raw response
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcards });

  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { 
        error: "An error occurred while generating flashcards",
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}