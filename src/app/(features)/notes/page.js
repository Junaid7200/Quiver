"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "../../../utils/supabase/client";
import NotesCard from "../../components/NotesCard.jsx";
import { useRouter } from "next/navigation";
import ConfirmModal from "../../components/ConfirmModal";




export default function NotesPage() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [userId, setUserId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'folder' or 'note'

const router = useRouter();

  const supabase = createClient();


  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    fetchUser();
  }, []);


useEffect(() => {
  if (userId) {
    fetchFolders();
    // Fetch all notes when component loads
    fetchAllNotes();
  }
}, [userId]);

const fetchAllNotes = async () => {
  try {
    // Get all notes for this user by joining the folders table
    const { data, error } = await supabase
      .from('notes')
      .select('*, folders!inner(*)')
      .eq('folders.user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching all notes:', error);
      return;
    }

    // If we have notes, fetch tags for each note
    if (data && data.length > 0) {
      const notesWithTags = await Promise.all(data.map(async (note) => {
        // Fetch tags for this note
        const { data: tagData, error: tagError } = await supabase
          .from('note_tags')
          .select('name')
          .eq('note_id', note.id);
          
        if (tagError) {
          console.error(`Error fetching tags for note ${note.id}:`, tagError);
          return { ...note, tags: [] };
        }
        
        // Return the note with its tags
        return { 
          ...note, 
          tags: tagData ? tagData.map(tag => tag.name) : []
        };
      }));
      
      setNotes(notesWithTags);
    } else {
      setNotes([]);
    }
  } catch (error) {
    console.error('Error in fetchAllNotes:', error);
    setNotes([]);
  }
};

  // Fetch notes when currentFolder changes
  useEffect(() => {
    if (currentFolder) {
      fetchNotes(currentFolder);
    }
  }, [currentFolder]);


const showAllNotes = () => {
  setCurrentFolder(null);
  setSelectedTag(null);
  fetchAllNotes();
};


  const fetchFolders = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('name');
      
    if (error) {
      console.error('Error fetching folders:', error);
    } else {
      setFolders(data || []);
      
    }
  };

// Replace your fetchNotes function with this one
const fetchNotes = async (folderId) => {
  try {
    // First, get all notes for this folder
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }
    
    // If we have notes, fetch tags for each note
    if (data && data.length > 0) {
      // Create a new array to hold notes with their tags
      const notesWithTags = await Promise.all(data.map(async (note) => {
        // Fetch tags for this note
        const { data: tagData, error: tagError } = await supabase
          .from('note_tags')
          .select('name')
          .eq('note_id', note.id);
          
        if (tagError) {
          console.error(`Error fetching tags for note ${note.id}:`, tagError);
          return { ...note, tags: [] };
        }
        
        // Return the note with its tags
        return { 
          ...note, 
          tags: tagData ? tagData.map(tag => tag.name) : []
        };
      }));
      
      setNotes(notesWithTags);
    } else {
      setNotes([]);
    }
  } catch (error) {
    console.error('Error in fetchNotes:', error);
    setNotes([]);
  }
};

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    const { data, error } = await supabase
      .from('folders')
      .insert([
        { 
          name: newFolderName, 
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating folder:', error);
    } else {
      setNewFolderName('');
      setIsCreatingFolder(false);
      fetchFolders();
    }
  };

  // Modified function to create a new empty note immediately
  const createEmptyNote = async () => {
    if (!currentFolder) {
      alert("Please select or create a folder first");
      return;
    }
    
    try {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          title: 'Untitled Note',
          folder_id: currentFolder,
          created_at: new Date().toISOString()
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating note:', error);
    } 
    else {
      // Refresh notes list to show the new note
      fetchNotes(currentFolder);

      // Add a small delay to ensure the newly created note is highlighted
      setTimeout(() => {
        // Find the newly created note in the DOM and scroll to it
        const noteElement = document.getElementById(`note-${data[0].id}`);
        if (noteElement) {
          noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          noteElement.classList.add('animate-pulse-highlight');
          setTimeout(() => {
            noteElement.classList.remove('animate-pulse-highlight');
          }, 2000);
        }
      }, 100);
    }
    }
    catch {
      console.error('Error creating note:', error);
    }

  };


  const updateFolderName = async () => {
  if (!editingFolderName.trim()) return;
  
  const { error } = await supabase
    .from('folders')
    .update({ name: editingFolderName })
    .eq('id', editingFolderId);
    
  if (error) {
    console.error('Error updating folder:', error);
  } else {
    setEditingFolderId(null);
    setEditingFolderName('');
    fetchFolders();
  }
};


const fetchAllTags = async () => {
  try {
    // This query gets all tags from note_tags for notes owned by this user
    const { data, error } = await supabase
      .from('note_tags')
      .select('name, notes!inner(folder_id, folders!inner(user_id))')
      .eq('notes.folders.user_id', userId);

    if (error) {
      console.error('Error fetching tags:', error);
      return;
    }

    // Extract unique tag names
    if (data) {
      const uniqueTags = [...new Set(data.map(tag => tag.name))];
      setAllTags(uniqueTags);
    }
  } catch (error) {
    console.error('Error in fetchAllTags:', error);
  }
};

// Call fetchAllTags when userId changes
useEffect(() => {
  if (userId) {
    fetchFolders();
    fetchAllNotes();
    fetchAllTags();
  }
}, [userId]);





// Add this function to fetch notes by tag
const fetchNotesByTag = async (tagName) => {
  try {
    // First get all note IDs that have this tag
    const { data: tagData, error: tagError } = await supabase
      .from('note_tags')
      .select('note_id')
      .eq('name', tagName);

    if (tagError) {
      console.error('Error fetching notes by tag:', tagError);
      return;
    }

    if (!tagData || tagData.length === 0) {
      setNotes([]);
      return;
    }

    // Extract note IDs
    const noteIds = tagData.map(item => item.note_id);

    // Then fetch all those notes with their folder info to ensure they belong to this user
    const { data: notesData, error: notesError } = await supabase
      .from('notes')
      .select('*, folders!inner(user_id)')
      .in('id', noteIds)
      .eq('folders.user_id', userId)
      .order('created_at', { ascending: false });

    if (notesError) {
      console.error('Error fetching notes details:', notesError);
      return;
    }

    // For each note, fetch its tags
    if (notesData && notesData.length > 0) {
      const notesWithTags = await Promise.all(notesData.map(async (note) => {
        const { data: noteTagsData, error: noteTagsError } = await supabase
          .from('note_tags')
          .select('name')
          .eq('note_id', note.id);
          
        if (noteTagsError) {
          console.error(`Error fetching tags for note ${note.id}:`, noteTagsError);
          return { ...note, tags: [] };
        }
        
        return {
          ...note,
          tags: noteTagsData ? noteTagsData.map(tag => tag.name) : []
        };
      }));
      
      setNotes(notesWithTags);
    } else {
      setNotes([]);
    }
  } catch (error) {
    console.error('Error in fetchNotesByTag:', error);
    setNotes([]);
  }
};


const handleFolderSelect = (folderId) => {
  setCurrentFolder(folderId);
  setSelectedTag(null);
  fetchNotes(folderId);
};

const handleTagSelect = (tagName) => {
  setSelectedTag(tagName);
  setCurrentFolder(null); // Deselect current folder when selecting a tag
  fetchNotesByTag(tagName);
};

const handleDeleteFolder = (folderId) => {
  setDeleteType('folder');
  setItemToDelete(folderId);
  setIsDeleteModalOpen(true);
};

// Replace the deleteNote function with this
const handleDeleteNote = (noteId) => {
  setDeleteType('note');
  setItemToDelete(noteId);
  setIsDeleteModalOpen(true);
};

// Add this function to handle the confirmation
const confirmDelete = async () => {
  if (deleteType === 'folder') {
    await deleteFolder(itemToDelete);
  } else if (deleteType === 'note') {
    await deleteNote(itemToDelete);
  }
  setIsDeleteModalOpen(false);
  setItemToDelete(null);
  setDeleteType(null);
};


// Add this function to delete folders
const deleteFolder = async (folderId) => {
  // Show confirmation dialog
    try {
      // First, get all notes in this folder to delete their tags
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('id')
        .eq('folder_id', folderId);
        
      if (notesError) {
        console.error('Error fetching notes for folder deletion:', notesError);
        return;
      }
      
      if (notesData && notesData.length > 0) {
        // Delete tags for all notes in this folder
        const noteIds = notesData.map(note => note.id);
        
        const { error: tagsError } = await supabase
          .from('note_tags')
          .delete()
          .in('note_id', noteIds);
        if (tagsError) {
          console.error('Error deleting note tags:', tagsError);
          return;
        }

        // Delete all links where these notes are the source
        const { error: LinksError } = await supabase
          .from('note_links')
          .delete()
          .in('note_id', noteIds);
          
        if (LinksError) {
          console.error('Error deleting links:', LinksError);
          return;
        }
      }
      
      // Then delete all notes in this folder
      const { error: deleteNotesError } = await supabase
        .from('notes')
        .delete()
        .eq('folder_id', folderId);
      
      if (deleteNotesError) {
        console.error('Error deleting notes:', deleteNotesError);
        return;
      }
      
      // Finally delete the folder itself
      const { error: deleteFolderError } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);
      
      if (deleteFolderError) {
        console.error('Error deleting folder:', deleteFolderError);
        return;
      }
      
      // If current folder was deleted, reset to showing all notes
      if (currentFolder === folderId) {
        setCurrentFolder(null);
        fetchAllNotes();
      }
      
      // Refresh folders list
      fetchFolders();
      fetchAllNotes();
      fetchAllTags();
      
    } catch (error) {
      console.error('Error in deleteFolder:', error);
    }
  
};



// Add this function to delete individual notes
const deleteNote = async (noteId) => {
  // Show confirmation dialog
    try {
      // First delete all tags associated with this note
      const { error: tagError } = await supabase
        .from('note_tags')
        .delete()
        .eq('note_id', noteId);
      if (tagError) {
        console.error('Error deleting tags:', tagError);
        return;
      }



        // Delete all links where these notes are the source
        const { error: LinksError } = await supabase
          .from('note_links')
          .delete()
          .eq('note_id', noteId);
          
        if (LinksError) {
          console.error('Error deleting links:', LinksError);
          return;
        }
      
      // Then delete the note itself
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
        
      if (error) {
        console.error('Error deleting note:', error);
        return;
      }
      
      // Refresh the notes list
      if (currentFolder) {
        fetchNotes(currentFolder);
      } else if (selectedTag) {
        fetchNotesByTag(selectedTag);
      } else {
        fetchAllNotes();
      }
      fetchAllTags();
      
    } catch (error) {
      console.error('Error in deleteNote:', error);
  }
};





  return (
    <div className="main-div flex flex-col">
<div className="heading-div flex justify-between item-start px-6 pt-6 pb-0">
  <div>
    <h1 className="text-3xl font-semibold">Notes</h1>
    <p className="text-gray-400">Create, organize, and review your notes.</p>
  </div>
  
  {/* <button 
    onClick={createEmptyNote}
    className="cursor-pointer hover:bg-[#5222D0] px-4 py-2 bg-[#9B87F5] text-white rounded-2xl mr-12"
  >
    <svg className="inline" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg> New Note
  </button> */}
</div>

      <div className="flex gap-6 h-screen p-6">


      
        {/* Folders and Tags column */}
        <div className="flex flex-col w-[20%]">


          <div className="folders-div flex flex-col bg-[#09090B] border border-gray-500 rounded-2xl h-[50%] p-6">
            <div className="folder-div-header flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Image
                  src="/Assets/folder.svg"
                  alt="Folder Icon"
                  width={24}
                  height={24}
                  className="inline-block mr-2"
                />
                <h2 className="text-xl font-semibold text-white">
                  Folders
                </h2>
              </div>
              <button 
                onClick={() => setIsCreatingFolder(true)}
                className="text-[#9B87F5] hover:text-[#5222D0]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {isCreatingFolder ? (
              <div className="mb-3 flex items-center">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    createFolder();
                  } else if (e.key === 'Escape') {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }
                }}
                placeholder="Folder name"
                className="w-full p-2 bg-[#27272A] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#9B87F5]"
                autoFocus
              />
                <button 
                  onClick={createFolder}
                  className="ml-2 text-[#9B87F5] hover:text-[#5222D0]"
                >
                  ✓
                </button>
                <button 
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  className="ml-1 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            ) : null}
            
  <div className="folders-list flex flex-col overflow-y-auto custom-scrollbar">
    <div 
      className={`p-2 mb-1 rounded-md cursor-pointer transition-colors ${
        currentFolder === null ? 'bg-[#5222D0]' : 'hover:bg-[#27272A]'
      }`}
      onClick={showAllNotes}
    >
      <div className="flex items-center">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mr-2"
        >
          <path d="M3 6h18M3 12h18M3 18h18"></path>
        </svg>
        <span className="text-white">All Notes</span>
      </div>
    </div>
{folders.map(folder => (
  <div 
    key={folder.id} 
    className={`p-2 mb-1 rounded-md cursor-pointer transition-colors ${
      currentFolder === folder.id ? 'bg-[#5222D0]' : 'hover:bg-[#27272A]'
    }`}
  >
    <div className="flex items-center justify-between">
      <div 
        className="flex items-center flex-1"
        onClick={() => handleFolderSelect(folder.id)}
      >
        <Image
          src="/Assets/folder.svg"
          alt="Folder"
          width={16}
          height={16}
          className="mr-2"
        />
        {editingFolderId === folder.id ? (
          <input
            type="text"
            value={editingFolderName}
            onChange={(e) => setEditingFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFolderName();
              } else if (e.key === 'Escape') {
                setEditingFolderId(null);
                setEditingFolderName('');
              }
            }}
            onBlur={() => {
              setEditingFolderId(null);
              setEditingFolderName('');
            }}
            className="bg-[#27272A] border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-[#9B87F5] flex-1"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span 
            className="text-white"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingFolderId(folder.id);
              setEditingFolderName(folder.name);
            }}
          >
            {folder.name}
          </span>
        )}
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteFolder(folder.id);
        }}
        className="text-gray-400 hover:text-red-500 ml-2 p-1 rounded hover:bg-gray-700"
        title="Delete folder"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
))}
  </div>
</div>



          {/* Tags column */}
              <div className="tags-div border border-gray-500 rounded-2xl h-[20%] p-6 mt-6 bg-[#09090B] flex flex-col">
                <div className="folder-div-header flex items-center mb-4">
                  <Image
                    src="/Assets/tags.svg"
                    alt="Tags Icon"
                    width={24}
                    height={24}
                    className="inline-block mr-2"
                  />
                  <h2 className="text-xl font-semibold text-white">
                    Tags
                  </h2>
                </div>
                <div className="tags-list flex-1 flex flex-wrap gap-2 overflow-y-auto custom-scrollbar">
                  {allTags.length > 0 ? (
                    allTags.map((tag, index) => (
                      <div key={index} className="inline-block"> {/* Added a container div */}
                        <span
                          onClick={() => handleTagSelect(tag)}
                          className={`inline-flex items-center px-3 py-1 rounded-full cursor-pointer transition-colors ${
                            selectedTag === tag 
                              ? 'bg-[#5222D0] text-white' 
                              : 'bg-[#27272A] text-[#9B87F5] hover:bg-[#3D3D3D]'
                          }`}
                        >
                          #{tag}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No tags yet.</p>
                  )}
                </div>

              </div>



</div>

        {/* Recent Notes column */}
    <div className="notes-display-div border border-gray-500 rounded-2xl w-[90%] h-[72.5%] p-12 bg-[#09090B] flex flex-col">
        <div className="flex justify-between items-center mb-4">
        <div className="folder-div-header flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-white">
            {selectedTag 
              ? `#${selectedTag}` 
              : currentFolder 
                ? folders.find(f => f.id === currentFolder)?.name || 'Notes' 
                : 'All Notes'}
          </h2>
          <p className="text-gray-400 mb-4">
            {selectedTag 
              ? `Notes tagged with #${selectedTag}` 
              : currentFolder 
                ? 'Continue where you left off.' 
                : 'Viewing notes from all folders.'}
          </p>
        </div>
            
        {!selectedTag && (
          <button 
            onClick={createEmptyNote}
            className="text-[#9B87F5] hover:text-[#5222D0] mr-4 mb-16"
            title={currentFolder ? "Create new note" : "Select a folder first"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
    </div>


                <div className="notes-list flex flex-col flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  {notes.length > 0 ? (
                    notes.map(note => (
                      <div 
                        key={note.id}
                        id={`note-${note.id}`}
                        className="cursor-pointer transition hover:scale-[1.01]"
                        onDoubleClick={() => router.push(`/notes/${note.id}`)}
                      >
                        <NotesCard
                          noteId={note.id}
                          note_heading={note.title}
                          notes_body={note.content}
                          notes_tags={note.tags || []}
                          notes_date={new Date(note.created_at).toLocaleDateString()}
                          onDelete={handleDeleteNote}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      {folders.length === 0 ? 
                        "Create a folder to start adding notes" : 
                        "No notes yet. Click the + button to create one."}
                    </div>
                  )}
                </div>


        </div>
      </div>

<ConfirmModal
  isOpen={isDeleteModalOpen}
  title={deleteType === 'folder' ? "Delete Folder" : "Delete Note"}
  message={
    deleteType === 'folder'
      ? "Are you sure you want to delete this folder? All notes in this folder will also be deleted. This action cannot be undone."
      : "Are you sure you want to delete this note? This action cannot be undone."
  }
  onConfirm={confirmDelete}
  onCancel={() => setIsDeleteModalOpen(false)}
/>

    </div>
  );
}