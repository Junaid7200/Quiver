import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { action, content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (action === 'summary') {
      // Generate a summary of the content
      console.log('Generating summary...');
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes text. Provide a concise, informative summary in 2-3 sentences."
          },
          {
            role: "user", 
            content: `Summarize this text: ${content}`
          }
        ],
        model: "llama3-70b-8192",
        temperature: 0.5,
        max_tokens: 150,
      });
      console.log('Parsed response:', { summary: completion.choices[0].message.content.trim() });
      console.log('raw response:', completion.choices[0].message.content);
      console.log('completely raw response:', completion);
      return NextResponse.json({ summary: completion.choices[0].message.content.trim() });
    } 
    else if (action === 'links') {
      // Generate useful links based on the content
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that suggests relevant learning resources. Based on the content provided, suggest 3-5 useful websites or resources for further learning. Format your response as a numbered list with each item containing:
            1. [Title] - URL
            
            Use real, existing websites like Wikipedia, educational sites, documentation, etc. Make sure URLs are valid and relevant.`
          },
          {
            role: "user", 
            content: `Based on this text, suggest useful links for further learning: ${content}`
          }
        ],
        model: "llama3-70b-8192",
        temperature: 0.7,
        max_tokens: 500,
      });
      
      // Process the response to extract links
      const linksText = completion.choices[0].message.content.trim();
      const links = parseLinks(linksText);
      
      return NextResponse.json({ links });
    }
    
    return NextResponse.json(
      { error: "Invalid action. Use 'summary' or 'links'." },
      { status: 400 }
    );
  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

// Enhanced helper function to parse links from the AI response
function parseLinks(text) {
  const links = [];
  
  // Enhanced regex patterns for different formats
  const patterns = [
    // Pattern 1: [Title] - URL or [Title]: URL
    /\[([^\]]+)\]\s*[-:]\s*(https?:\/\/[^\s]+)/gi,
    // Pattern 2: 1. Title - URL
    /\d+\.\s*([^-\n]+?)\s*-\s*(https?:\/\/[^\s\n]+)/gi,
    // Pattern 3: * Title - URL
    /\*\s*([^-\n]+?)\s*-\s*(https?:\/\/[^\s\n]+)/gi,
    // Pattern 4: Title: URL (on same line)
    /([^:\n]+?):\s*(https?:\/\/[^\s\n]+)/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[2]) {
        const title = match[1].trim().replace(/^\d+\.\s*/, '').replace(/^\*\s*/, '');
        const url = match[2].trim();
        
        // Avoid duplicates
        if (!links.some(link => link.url === url)) {
          links.push({
            title: title,
            url: url
          });
        }
      }
    }
  });
  
  // If no links found with structured format, try to extract any URLs and create generic titles
  if (links.length === 0) {
    const urlRegex = /(https?:\/\/[^\s\n]+)/gi;
    const urls = text.match(urlRegex) || [];
    
    urls.forEach((url, index) => {
      // Create a generic title based on domain
      const domain = url.match(/https?:\/\/(?:www\.)?([^\/]+)/)?.[1] || 'Resource';
      links.push({
        title: `Learn more at ${domain}`,
        url: url
      });
    });
  }
  
  // If still no links, create search-based suggestions
  if (links.length === 0) {
    const topics = extractTopics(text);
    links.push(...topics.slice(0, 3).map(topic => ({
      title: `${topic} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`
    })));
    
    // Add a general search link
    if (topics.length > 0) {
      links.push({
        title: `Search for more about ${topics[0]}`,
        url: `https://www.google.com/search?q=${encodeURIComponent(topics[0])}`
      });
    }
  }
  
  return links.slice(0, 5); // Limit to 5 links
}

function extractTopics(text) {
  // Enhanced topic extraction
  const words = text.toLowerCase().split(/\s+/);
  const topics = [];
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'under', 'over']);
  
  // Look for capitalized words and longer meaningful words
  const sentences = text.split(/[.!?]+/);
  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/);
    for (const word of sentenceWords) {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (cleanWord.length > 4 && 
          !stopWords.has(cleanWord.toLowerCase()) && 
          !topics.includes(cleanWord)) {
        topics.push(cleanWord);
      }
    }
  }
  
  return topics.slice(0, 5);
}

// Add this at the end of your route.js file
export async function GET() {
  console.log("GET request received");
  return NextResponse.json({ 
    message: "API is working!", 
    timestamp: new Date().toISOString() 
  });
}