"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "../../../utils/supabase/client";
import NotesCard from "../../components/NotesCard.jsx";

export default function NotesPage() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [userId, setUserId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');



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

  // Fetch folders when userId changes
  useEffect(() => {
    if (userId) {
      fetchFolders();
    }
  }, [userId]);

  // Fetch notes when currentFolder changes
  useEffect(() => {
    if (currentFolder) {
      fetchNotes(currentFolder);
    }
  }, [currentFolder]);

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
      
      // Select the first folder if none is selected
      if (data.length > 0 && !currentFolder) {
        setCurrentFolder(data[0].id);
      }
    }
  };

  const fetchNotes = async (folderId) => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
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
    } else {
      // Refresh notes list to show the new note
      fetchNotes(currentFolder);
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

  return (
    <div className="main-div flex flex-col">
<div className="heading-div flex justify-between item-start px-6 pt-6 pb-0">
  <div>
    <h1 className="text-3xl font-semibold">Notes</h1>
    <p className="text-gray-400">Create, organize, and review your notes.</p>
  </div>
  
  <button 
    onClick={createEmptyNote}
    className="cursor-pointer hover:bg-[#5222D0] px-4 py-2 bg-[#9B87F5] text-white rounded-2xl mr-12"
  >
    <svg className="inline" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg> New Note
  </button>
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
            
<div className="folders-list flex flex-col overflow-y-auto">
  {folders.map(folder => (
    <div 
      key={folder.id} 
      className={`p-2 mb-1 rounded-md cursor-pointer transition-colors ${
        currentFolder === folder.id ? 'bg-[#5222D0]' : 'hover:bg-[#27272A]'
      }`}
      onClick={() => setCurrentFolder(folder.id)}
    >
      <div className="flex items-center">
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
    </div>
  ))}
</div>
          </div>

          <div className="tags-div border border-gray-500 rounded-2xl h-[20%] p-6 mt-6 bg-[#09090B]">
            <div className="folder-div-header flex">
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
            <div className="tags-list flex flex-wrap mt-4">
              {/* We'll implement tags in the next phase */}
            </div>
          </div>
        </div>

        {/* Recent Notes column */}
        <div className="tags-div border border-gray-500 rounded-2xl w-[75%] h-[72.5%] p-6 bg-[#09090B] flex flex-col">
          <div className="folder-div-header flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-white">
              {currentFolder ? folders.find(f => f.id === currentFolder)?.name || 'Notes' : 'All Notes'}
            </h2>
            <p className="text-gray-400 mb-4">Continue where you left off.</p>
          </div>
          <div className="notes-list flex flex-col flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {notes.length > 0 ? (
              notes.map(note => (
                <NotesCard
                  key={note.id}
                  note_heading={note.title}
                  notes_body={note.content}
                  notes_tags={[]} // We'll implement tags in the next phase
                  notes_date={new Date(note.created_at).toLocaleDateString()}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                {folders.length === 0 ? 
                  "Create a folder to start adding notes" : 
                  "No notes yet. Click 'New Note' to create one."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}