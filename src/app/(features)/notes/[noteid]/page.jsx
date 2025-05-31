"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";


const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then(mod => mod.Editor),
  { ssr: false, loading: () => <p>Loading editor...</p> }
);

export default function NoteEditPage({ params }) {
  params = React.use(params);
  const noteId = params.noteid;
  const router = useRouter();
  const [note, setNote] = useState({
    title: "Untitled Note",
    content: "",
    tags: [],
    summary: "",
    folder_id: null,
  });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [generatingSummary, setGeneratingSummary] = useState(false);
    const [generatingLinks, setGeneratingLinks] = useState(false);
    const [usefulLinks, setUsefulLinks] = useState([]);
    const editorRef = useRef(null);
    const supabase = createClient();

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        // First fetch the note itself
        const { data: noteData, error: noteError } = await supabase
          .from('notes')
          .select('*')
          .eq('id', noteId)
          .single();

        if (noteError) {
          console.error('Error fetching note:', noteError);
          return;
        }

        // Then fetch the tags for this note
        const { data: tagData, error: tagError } = await supabase
          .from('note_tags')
          .select('name')
          .eq('note_id', noteId);

        if (tagError) {
          console.error('Error fetching tags:', tagError);
        }

        // Then fetch any links for this note
        const { data: linkData, error: linkError } = await supabase
          .from('note_links')
          .select('title, url')
          .eq('note_id', noteId);

        if (linkError) {
          console.error('Error fetching links:', linkError);
        }

        if (noteData) {
          // Extract tag names from the tag objects
          const tags = tagData ? tagData.map(tag => tag.name) : [];
          // Set links separately
          setUsefulLinks(linkData || []);
          
          setNote({
            title: noteData.title || "Untitled Note",
            content: noteData.content || "",
            tags: tags,
            summary: noteData.summary || "",
            folder_id: noteData.folder_id,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId, supabase]);

  // Add this useEffect hook for auto-saving
  useEffect(() => {
    // Add a debounced auto-save
    const timeoutId = setTimeout(() => {
      if (!isLoading && (note.title !== "Untitled Note" || note.content !== "")) {
        saveNote();
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [note.title, note.content, note.summary]);

  // Save note changes
  const saveNote = async () => {
    try {
      setIsSaving(true);
      
      // First update the note itself
      const { error: noteError } = await supabase
        .from('notes')
        .update({
          title: note.title,
          content: note.content,
          summary: note.summary,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId);

      if (noteError) {
        console.error('Error saving note:', noteError);
        alert('Failed to save note');
        return;
      }

      // Handle tags - this is more complex as we need to sync them
      // First, delete all existing tags for this note
      const { error: tagDeleteError } = await supabase
        .from('note_tags')
        .delete()
        .eq('note_id', noteId);

      if (tagDeleteError) {
        console.error('Error removing existing tags:', tagDeleteError);
      }

      // Then insert new tags if we have any
      if (note.tags.length > 0) {
        const tagRows = note.tags.map(tagName => ({
          note_id: noteId,
          name: tagName
        }));

        const { error: tagInsertError } = await supabase
          .from('note_tags')
          .insert(tagRows);

        if (tagInsertError) {
          console.error('Error saving tags:', tagInsertError);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };
  const handleContentChange = (content) => {
    setNote({ ...note, content: content });
  };

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  // Add tag
  const addTag = async () => {
    if (tagInput.trim() && !note.tags.includes(tagInput.trim())) {
      // Update local state first for UI responsiveness
      const newTags = [...note.tags, tagInput.trim()];
      setNote({ ...note, tags: newTags });
      
      // Then update database
      try {
        const { error } = await supabase
          .from('note_tags')
          .insert([{ note_id: noteId, name: tagInput.trim() }]);
          
        if (error) {
          console.error('Error adding tag:', error);
          // Revert if there was an error
          setNote({ ...note, tags: note.tags });
        }
      } catch (error) {
        console.error('Error:', error);
      }
      
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = async (tagToRemove) => {
    // Update local state first for UI responsiveness
    setNote({
      ...note,
      tags: note.tags.filter(tag => tag !== tagToRemove)
    });
    
    // Then update database
    try {
      const { error } = await supabase
        .from('note_tags')
        .delete()
        .eq('note_id', noteId)
        .eq('name', tagToRemove);
        
      if (error) {
        console.error('Error removing tag:', error);
        // Revert if there was an error
        setNote({ ...note });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };







// Replace the existing generateSummary function with this:
const generateSummary = async () => {
  if (!note.content) {
    alert("Please add some content to your note before generating a summary.");
    return;
  }

  setGeneratingSummary(true);

  try {
    // Strip HTML tags for cleaner content
    const plainTextContent = stripHtmlButPreserveStructure(note.content);
    console.log("Plain text content for summary:", truncateForApi(plainTextContent));

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'summary',
        content: truncateForApi(plainTextContent),
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Generated summary:", data.summary);
    
    // Update note with the generated summary
    const updatedNote = { ...note, summary: data.summary };
    setNote(updatedNote);
    
    // Save the summary to the database
    await supabase
      .from('notes')
      .update({ summary: data.summary })
      .eq('id', noteId);
    
  } catch (error) {
    console.error('Error generating summary:', error);
    alert('Failed to generate summary. Please try again.');
  } finally {
    setGeneratingSummary(false);
  }
};




// Replace the existing generateLinks function with this:
const generateLinks = async () => {
  if (!note.content) {
    alert("Please add some content to your note before generating links.");
    return;
  }

  setGeneratingLinks(true);

  try {
    // Strip HTML tags for cleaner content
    const plainTextContent = stripHtmlButPreserveStructure(note.content);

    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'links',
        content: truncateForApi(plainTextContent),
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Update UI with generated links
    setUsefulLinks(data.links);
    
    // Save links to the database
    await saveLinks(data.links);
    
  } catch (error) {
    console.error('Error generating links:', error);
    alert('Failed to generate useful links. Please try again.');
  } finally {
    setGeneratingLinks(false);
  }
};

  // Save links
  const saveLinks = async (links) => {
    if (!links || links.length === 0) return;
    
    try {
      // First delete existing links
      const { error: deleteError } = await supabase
        .from('note_links')
        .delete()
        .eq('note_id', noteId);
        
      if (deleteError) {
        console.error('Error removing existing links:', deleteError);
      }
      
      // Then add new links
      const linkRows = links.map(link => ({
        note_id: noteId,
        title: link.title,
        url: link.url
      }));
      
      const { error: insertError } = await supabase
        .from('note_links')
        .insert(linkRows);
        
      if (insertError) {
        console.error('Error saving links:', insertError);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


// Add this function to your page.jsx file
const stripHtmlButPreserveStructure = (html) => {
  if (!html) return '';
  
  // Replace common block elements with newlines
  let text = html.replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|blockquote)>/gi, '\n');
  
  // Replace list items with bullet points
  text = text.replace(/<li[^>]*>/gi, '• ');
  
  // Replace horizontal rules with separator
  text = text.replace(/<hr[^>]*>/gi, '\n---\n');
  
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Replace multiple newlines with double newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  
  return text.trim();
};

const truncateForApi = (content, maxChars = 6000) => {
  if (content.length <= maxChars) return content;
  
  // Truncate and add an indicator
  return content.substring(0, maxChars) + 
    "\n\n[Note: Content was truncated due to length limitations.]";
};

  return (
    <div className="p-6 max-w-5xl ml-12">
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-[#9B87F5] hover:text-[#5222D0]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Notes
        </button>
      </div>
      
      {/* Note Title */}
      <div className="mb-6">
        <input
          type="text"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          className="w-full text-3xl font-bold bg-transparent border-b border-gray-700 pb-2 focus:outline-none focus:border-[#9B87F5] text-white"
          placeholder="Note Title"
        />
      </div>





{/* Rich Text Editor */}
<div className="mb-6">
  {!isLoading && (
    <div className="tinymce-wrapper bg-[#1E1E1E] rounded-lg border border-gray-700">

<Editor
  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
  onInit={(evt, editor) => {
    editorRef.current = editor;
  }}
  value={note.content || ""}
  onEditorChange={handleContentChange}
  init={{
    height: 500,
    resize: "both",
    menubar: false,
    skin: 'oxide-dark',
    content_css: 'dark',
    directionality: 'ltr',
    browser_spellcheck: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
      'anchor', 'searchreplace', 'visualblocks', 'code',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatselect | fontselect fontsizeselect | forecolor backcolor | ' +
      'bold italic underline | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'link | removeformat | help',
        font_formats:
    'Arial=arial,helvetica,sans-serif;' +
    'Courier New=courier new,courier,monospace;' +
    'Georgia=georgia,times new roman,times,serif;' +
    'Tahoma=tahoma,arial,helvetica,sans-serif;' +
    'Trebuchet MS=trebuchet ms,geneva,sans-serif;' +
    'Verdana=verdana,geneva,sans-serif',
  fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 36pt',
  textcolor_map: [
    "9B87F5", "Purple (Primary)",
    "5222D0", "Dark Purple",
    "FFFFFF", "White",
    "A1A1AA", "Light Gray", 
    "71717A", "Gray",
    "3F3F46", "Dark Gray",
    "27272A", "Darker Gray",
    "18181B", "Almost Black"
  ],
    content_style: 
    `body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 16px;
        color: #fff;
        background-color: #1E1E1E;
        padding: 10px;
        }

        a { color: #9B87F5; }
        h1, h2, h3, h4, h5, h6 { color: #fff; }
        .mce-content-body [data-mce-selected="inline-boundary"] { background-color: #9B87F5; }
        .mce-content-body img:hover { outline: 2px solid #9B87F5; }
        .mce-content-body td, .mce-content-body th { border: 1px solid #3d3d3d; }
        .mce-content-body table { border-collapse: collapse; }
        .mce-content-body blockquote { border-left: 3px solid #9B87F5; padding-left: 10px; margin-left: 1.5em; }
        .mce-content-body code { background: #0E0E0E; padding: 2px 4px; border-radius: 3px; }
    `,
    formats: {
      removeformat: [
        {
          selector: 'b,strong,em,i,font,u,strike,sub,sup,dfn,code,samp,kbd,var,cite,mark,q,del,ins',
          remove: 'all',
          split: true,
          block_expand: true,
          expand: false,
          deep: true
        },
        {
          selector: 'span',
          attributes: ['style', 'class'],
          remove: 'empty',
          split: true,
          expand: false,
          deep: true
        },
        {
          selector: '*',
          attributes: ['style', 'class'],
          split: false,
          expand: false,
          deep: true
        }
      ]
    }
  }}
/>





      {/* <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={note.content}
        value={note.content}
        onEditorChange={handleContentChange}
        init={{
          height: 500,
          menubar: false,
          skin: 'oxide-dark',
          content_css: 'dark',
          directionality: 'ltr',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap',
            'searchreplace', 'visualblocks', 'code',
            'insertdatetime', 'table', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic underline | h1 h2 h3 | ' +
          'bullist numlist outdent indent | ' +
          'link | removeformat',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px;
              color: #fff;
              background-color: #1E1E1E;
              padding: 10px;
              direction: ltr;
            }
            h1, h2, h3 { color: #fff; }
            p { margin: 0; padding: 0; }
            a { color: #9B87F5; }
          `,
        }}
      /> */}
    </div>
  )}
</div>






      {/* Save indicator */}
      <div className="text-right text-sm text-gray-400 mt-2">
        {isSaving ? 'Saving...' : 'All changes saved'}
      </div>

      {/* AI Summary Section */}
      <div className="mt-8 p-6 bg-[#1E1E1E] rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">AI Summary</h3>
          <button
            onClick={generateSummary}
            disabled={generatingSummary}
            className={`px-4 py-2 rounded-lg ${generatingSummary ? 'bg-gray-600' : 'bg-[#9B87F5] hover:bg-[#5222D0]'} text-white`}
          >
            {generatingSummary ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Summary'
            )}
          </button>
        </div>
        
        <div className={`mt-2 p-4 rounded-lg border bg-[#0E0E0E] ${note.summary ? 'border-green-600' : 'border-gray-700'}`}>
          {note.summary ? (
            <p className="text-white">{note.summary}</p>
          ) : (
            <p className="text-gray-400 italic">Your AI-generated summary will appear here.</p>
          )}
        </div>

        {note.summary && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={generateSummary}
              className="text-[#9B87F5] hover:text-[#5222D0] mr-4"
            >
              Regenerate
            </button>
          </div>
        )}
      </div>

      {/* Useful Links Section */}
      <div className="mt-8 p-6 bg-[#1E1E1E] rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Useful Links</h3>
          <button
            onClick={generateLinks}
            disabled={generatingLinks}
            className={`px-4 py-2 rounded-lg ${generatingLinks ? 'bg-gray-600' : 'bg-[#9B87F5] hover:bg-[#5222D0]'} text-white`}
          >
            {generatingLinks ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Find Useful Links'
            )}
          </button>
        </div>
        
        <div className="mt-2 p-4 rounded-lg border bg-[#0E0E0E] border-gray-700">
          {usefulLinks.length > 0 ? (
            <ul className="space-y-2">
              {usefulLinks.map((link, index) => (
                <li key={index} className="flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-[#9B87F5]">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-[#9B87F5] hover:text-[#5222D0] hover:underline">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">AI-generated relevant links will appear here.</p>
          )}
        </div>

        {usefulLinks.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={generateLinks}
              className="text-[#9B87F5] hover:text-[#5222D0] mr-4"
            >
              Regenerate
            </button>
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="mt-8 p-6 bg-[#1E1E1E] rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#5222D0]/20 text-[#9B87F5] rounded-full flex items-center"
            >
              #{tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-2 text-[#9B87F5] hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </span>
          ))}
        </div>
        
        <div className="flex">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              #
            </span>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              className="w-full pl-8 p-2 bg-[#0E0E0E] border border-gray-700 rounded-lg focus:outline-none focus:border-[#9B87F5] text-white"
              placeholder="Add tag and press Enter"
            />
          </div>
          <button
            onClick={addTag}
            className="ml-2 px-4 py-2 bg-[#9B87F5] text-white rounded-lg hover:bg-[#5222D0]"
          >
            Add
          </button>
        </div>
        
        <p className="text-gray-400 text-sm mt-2">
          Tags help you organize and find your notes easily. Press Enter, space or comma after typing to add a tag.
        </p>
      </div>
    </div>
  );
}