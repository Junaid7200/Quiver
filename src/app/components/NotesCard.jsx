import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

export default function NotesCard({ note_heading, notes_body, notes_tags, notes_date, onDelete, noteId }) {
  
    const stripHtmlTags = (html) => {
    if (!html) return "";
    
    // Create a temporary div to parse HTML and get text content
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const textOnly = temp.textContent || temp.innerText || "";
    
    return truncateText(textOnly);
  };
  
  
  // Function to truncate text to 30 characters (excluding spaces)
const truncateText = (text) => {
    if (!text) return "";
    const textWithoutSpaces = text.replace(/\s/g, '');
    if (textWithoutSpaces.length <= 30) return text;
    
    let charCount = 0;
    let truncated = '';
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== ' ') charCount++;
      truncated += text[i];
      if (charCount >= 30) break;
    }
    return truncated + '...';
  };

  return (
    <div className="relative my-6 mx-12">
      {/* Purple background div */}
      <div className="absolute -left-1 inset-0 bg-[#9B87F5] rounded-2xl w-100 z-0"></div>
      
      <div className="notes-card bg-[#27272A] rounded-2xl p-6 relative group">
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(noteId);
            }}
            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-700"
            title="Delete note"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            </svg>
          </button>
        </div>
      
        <div className="heading-date-div flex justify-between">
          <h2 className="note_heading text-white text-lg">{note_heading || "heading"}</h2>
          <p className="notes_date text-[#A1A1AA]">{notes_date || "date"}</p>
        </div>
        <p className="notes_body text-[#A1A1AA]">{stripHtmlTags(notes_body) || "body"}</p>
        <p className="notes_tags text-[#A1A1AA]">{notes_tags && notes_tags.length > 0 ? notes_tags.join(", ") : "tags"}</p>
      </div>
    </div>
  );
}