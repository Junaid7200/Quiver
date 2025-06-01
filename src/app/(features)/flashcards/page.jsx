"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import NewDeckModal from '../../components/NewDeckModal';
import Spinner from '../../components/Spinner'
import { createClient } from '../../../utils/supabase/client'
import { useRouter } from 'next/navigation';

export default function flashcards() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null); //contains the selected note's id
    const router = useRouter();

    //Toggling selection of a note when clicked
    const handleNoteSelect = (noteId) => {
        setSelectedNote(prevSelected => prevSelected === noteId ? null : noteId);
    };

    //Expanding the note
    const handleExpandNote = (noteID) => {
        const note = notes.find(n => n.id === noteID);
        router.push(`/notes/${note.id}`)
    }

    //fetching notes from db when 'create new deck' modal is opened
    useEffect(() => {
        if (isModalOpen) {
            setLoading(true);
            setError(null);

            const fetchUserNotes = async () => {
                try {
                    const supabase = createClient();

                    //getting auth user
                    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

                    console.log('Auth User:', authUser);

                    if (authError) throw authError;
                    if (!authUser) {
                        console.error('Error getting user: No authenticated user found.', authError.message);
                        return "User not authenticated";
                    }

                    //getting the folders of this user
                    const { data: userFolders, error: foldersError } = await supabase
                        .from('folders')
                        .select('id')
                        .eq('user_id', authUser.id);

                    if (foldersError) throw foldersError;

                    // Extract folder IDs
                    const folderIds = userFolders.map(folder => folder.id);

                    //Then get all notes that belong to any of these folders
                    const { data: userNotes, error: notesError } = await supabase
                        .from('notes')
                        .select('*')
                        .in('folder_id', folderIds);

                    if (notesError) throw notesError;

                    setNotes(userNotes);
                } catch (error) {
                    console.error("Error in fetchUserNotes:", error.message);
                    setError(error.message); // Set the error state
                    setNotes([]);
                }
                finally {
                    setLoading(false);
                }
            };
            fetchUserNotes();
        }
    }, [isModalOpen])

    //Generating flashcards
    async function generateFlashcards() {
        if (!selectedNote) return;

        try {
            setLoading(true);
            const supabase = createClient();

            // Get the selected note's details
            const selectedNoteData = notes.find(note => note.id === selectedNote);
            if (!selectedNoteData) {
                throw new Error('Selected note not found');
            }

            // Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            // 1. Create new flashcard deck
            const { data: deck, error: deckError } = await supabase
                .from('flashcard_decks')
                .insert({
                    user_id: user.id,
                    name: selectedNoteData.title, // Use note's title as deck name
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deck_folder_id: null
                })
                .select()
                .single();

            if (deckError) throw deckError;

            // 2. Generate flashcards using Grok API
            // TODO: Replace with actual Grok API implementation
            const flashcardsData = await generateFlashcardsFromNote(selectedNoteData.content);

            // 3. Insert flashcards into the flashcards table
            const flashcardsToInsert = flashcardsData.map(card => ({
                deck_id: deck.id,
                front_content: card.question,
                back_content: card.answer,
                created_at: new Date().toISOString(),
                note_id: selectedNote,
                last_reviewed: null,
                next_review_date: null,
                review_count: 0
            }));

            const { error: flashcardsError } = await supabase
                .from('flashcards')
                .insert(flashcardsToInsert);

            if (flashcardsError) throw flashcardsError;

            // Success! Close modal and optionally redirect
            setIsModalOpen(false);
            router.push(`/flashcards/${deck.id}`); // Assuming you'll have a deck view page
        }
        catch (error) {
            console.error('Error generating flashcards:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // function for Grok API integration
    async function generateFlashcardsFromNote(noteContent) {
        try {
            const response = await fetch('/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: noteContent }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to generate flashcards');
            }

            const data = await response.json();
            return data.flashcards;
        } catch (error) {
            console.error('Error generating flashcards:', error);
            throw error;
        }
    }

    return (
        <main className='w-[100%] h-full pr-[1%]'>
            <div className='upper flex justify-between w-[100%] mb-[3%]'>
                <div className='upper-left'>
                    <div className='flex items-end mb-[3%]'>
                        <Image src='/Assets/flashcards-colored.svg' width={35} height={35} alt='flashcards icon' className="mr-[2%]"></Image>
                        <p className='text-4xl'>Flashcards</p>
                    </div>
                    <p className="text-[#A1A1AA]">Create and practise with spaced repitition.</p>
                </div>
                <div className='upper-right flex items-center justify-center'>
                    <button
                        className="flex items-center justify-center whitespace-nowrap px-[30%] py-[12%] rounded-xl bg-[#32E0C4] text-sm text-black align-middle"
                        onClick={() => setIsModalOpen(true)}>
                        <Image src='/Assets/plus-icon.svg' width={20} height={20} alt='Plus icon' className="mr-[13%]"></Image>New Deck
                    </button>
                </div>
            </div>
            <div className="lower flex justify-between w-[100%] h-[calc(100%-120px)]">
                <div className="lower-left flex flex-col gap-[3%] w-[45%]">
                    <div className=" lower-left-upper border border-solid border-[#09090B] rounded-lg w-[100%] h-[70%] px-[1%] py-[10%]">

                    </div>
                    <div className="lower-left-lower border border-solid border-[#09090B] rounded-lg w-[100%] h[30%] px-[1%] py-[10%]">
                        <div className="flex items-center mb-[2%]">
                            <Image src='/Assets/AI-flashcard-icon.svg' height={20} width={20} alt='AI icon' className="mr-[2%]"></Image>
                            <p className="text-xl">AI Flashcard Generator</p>
                        </div>
                        <p className="text-[#A1A1AA]">Automatically create flashcards from your notes using AI.</p>
                    </div>
                </div>
                <div className="lower-right border-1 border-solid border-[#09090B] rounded-lg w-[55%] h-full px-[1%] py-[10%]">

                </div>
            </div>
            <NewDeckModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="w-[100%] h-[100%] px-[3%] py-[2%] relative">
                    <div className='Headingg'>
                        <p className="text-3xl pb-[1%]">Create New Deck of Flashcards</p>
                        <p className="text-mdtext-[#A1A1AA]">&nbsp;Choose the notes whose flashcards you want to generate.</p>
                    </div>
                    {loading ? (
                        <div className="flex min-h-[79%] justify-center items-center">
                            <Spinner />
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="flex min-h-[79%] text-[#A1A1AA] justify-center items-center">
                            <p>You don't have any notes.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-cols-3 gap-4 min-h-[79%] max-h-[80%] overflow-y-auto pb-20">
                                {notes.map((note) => (
                                    <div key={note.id}
                                        className={`relative p-4 h-[120px] rounded-lg border border-[#27272A] bg-[#09090B] hover:bg-black transition cursor-pointer overflow-hidden group`}
                                        onClick={() => handleNoteSelect(note.id)}>
                                        <h3 className="text-lg font-semibold text-white mb-1">{note.title}</h3>
                                        {/* Note Content with fade effect */}
                                        <div className="text-sm text-[#A1A1AA] overflow-hidden relative h-[60%]">
                                            <p className="line-clamp-[5] pr-6">{note.content}</p>

                                            {/* Fade effect using absolute gradient */}
                                            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#18181B] to-transparent pointer-events-none" />
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent parent click (event bubbling) (e is the event that occured)
                                                handleExpandNote(note.id);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-[#27272A] rounded-full hover:bg-[#3F3F46] transition"
                                        >
                                            <Image src="/Assets/expand-icon.svg" width={16} height={16} alt="Expand note" />
                                        </button>

                                        {selectedNote === note.id && (   //the part on RHS of && will be renedered if condition on LHS is true
                                            <div className="absolute inset-0 border-1 border-[#32E0C4] rounded-lg pointer-events-none" /> //this div will act as the border
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-[#18181B] border-t border-[#27272A] px-6 py-4 flex justify-end space-x-4">
                                <button
                                    onClick={() => setSelectedNote(null)}
                                    className="px-4 py-2 text-[#A1A1AA] hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!selectedNote === 0}
                                    onClick={generateFlashcards}
                                    className={`px-4 py-2 rounded-lg transition-colors ${!selectedNote
                                        ? 'bg-[#27272A] text-[#A1A1AA] cursor-not-allowed'
                                        : 'bg-[#32E0C4] text-black hover:bg-opacity-90'
                                        }`}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </NewDeckModal>
        </main>
    )
}