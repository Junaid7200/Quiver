export default function NotesCard({ note_heading, notes_body, notes_tags, notes_date}) {
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
    <div className="relative mb-6">
      {/* Purple background div */}
      <div className="absolute -left-1 inset-0 bg-[#9B87F5] rounded-2xl w-100 z-0"></div>
      
      <div className="notes-card bg-[#27272A] rounded-2xl p-6 relative">
      
      <div className="heading-date-div flex justify-between">
        <h2 className="note_heading text-white text-lg">{note_heading || "heading"}</h2>
        <p className="notes_date text-[#A1A1AA]">{notes_date || "date"}</p>
      </div>
      <p className="notes_body text-[#A1A1AA]">{truncateText(notes_body) || "body"}</p>
      <p className="notes_tags text-[#A1A1AA]">{notes_tags && notes_tags.length > 0 ? notes_tags.join(", ") : "tags"}</p>
      </div>
    </div>
  );
}