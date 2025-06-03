"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import NewDeckModal from '../../components/NewDeckModal';
import Spinner from '../../components/Spinner'
import { createClient } from '../../../utils/supabase/client'
import { useRouter } from 'next/navigation';
import FlashcardSuccessModal from '../../components/FlashcardSuccessModal';
import CancelNewdeckModal from '../../components/CancelNewdeckModal';

export default function flashcards() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null); //contains the selected note's id
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [generatedFlashcards, setGeneratedFlashcards] = useState([]); // to Store flashcards temporarily
    const [generatedDeck, setGeneratedDeck] = useState(null);
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
                        .in('folder_id', folderIds)
                        .not('content', 'is', null)  // Exclude null content
                        .not('content', 'eq', '')    // Exclude empty strings
                        .order('created_at', { ascending: false }); // Optional: show newest notes first

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

            // Creating deck object without saving to database yet
            const newDeck = {
                user_id: user.id,
                name: selectedNoteData.title,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            // Generating flashcards using Grok API
            const flashcardsData = await generateFlashcardsFromNote(selectedNoteData.content);

            // Temporarily storing flashcards 
            const flashcardsToInsert = flashcardsData.map(card => ({
                front_content: card.question,
                back_content: card.answer,
                created_at: new Date().toISOString(),
                note_id: selectedNote
            }));

            setGeneratedDeck(newDeck); // Store deck temporarily
            setGeneratedFlashcards(flashcardsToInsert); // Store flashcards temporarily
            setIsModalOpen(false);
            setIsSuccessModalOpen(true); // Open success modal
        }
        catch (error) {
            console.error('Error generating flashcards:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    /*save flashcards logic*/
    const handleSaveFlashcards = async () => {
        try {
            const supabase = createClient();

            // inserting the deck into the database
            const { data: deck, error: deckError } = await supabase
                .from('flashcard_decks')
                .insert(generatedDeck)
                .select()
                .single();

            if (deckError) throw deckError;

            // Add deck_id to flashcards and insert them
            const flashcardsWithDeckId = generatedFlashcards.map(card => ({
                ...card,
                deck_id: deck.id
            }));

            const { error: flashcardsError } = await supabase
                .from('flashcards')
                .insert(flashcardsWithDeckId);

            if (flashcardsError) throw flashcardsError;

            // Clear temporary data
            setGeneratedDeck(null);
            setGeneratedFlashcards([]);
            setIsSuccessModalOpen(false);

            return deck.id; // Return the deck ID for use in view function
        } catch (error) {
            console.error("Error saving flashcards:", error);
            setError(error.message);
            return null;
        }
    };

    /*cancel logic*/
    const handleCancel = () => {
        setIsSuccessModalOpen(false);
        setIsConfirmationModalOpen(true); // Open confirmation modal
    };

    const handleCancelWithoutSaving = () => {
        setGeneratedDeck(null);
        setGeneratedFlashcards([]); // Discard flashcards
        setIsConfirmationModalOpen(false); // Close confirmation modal
    };

    const handleSaveAndCancel = async () => {
        await handleSaveFlashcards(); // Save flashcards
        setIsConfirmationModalOpen(false); // Close confirmation modal
    };

    const handleViewDeck = async () => {
        const deckId = await handleSaveFlashcards();
        if (!deckId) {
            console.error('No deck ID available');
            return;
        }
        setIsSuccessModalOpen(false);
        router.push(`/flashcards/${deckId}`);
    };

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

    // function for Grok API integration
    async function generateFlashcardsFromNote(noteContent) {
        try {
            if (!noteContent) {
                throw new Error('Note content is required');
            }

            const plainTextContent = stripHtmlButPreserveStructure(noteContent);

            console.log('Sending note content to API:', plainTextContent.substring(0, 100) + '...'); // Debug log

            const response = await fetch('/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: plainTextContent }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData); // Debug log
                throw new Error(errorData.error || 'Failed to generate flashcards');
            }

            const data = await response.json();

            if (!data.flashcards || !Array.isArray(data.flashcards)) {
                console.error('Invalid response format:', data); // Debug log
                throw new Error('Invalid flashcard data received');
            }

            console.log('Generated flashcards:', data.flashcards); // Debug log
            return data.flashcards;

        } catch (error) {
            console.error('Error in generateFlashcardsFromNote:', error);
            throw error; // Re-throw to be handled by the calling function
        }
    }

    return (
        <main className='w-[100%] h-auto min-h-screen pr-[1%]'>
            <div className='upper flex justify-between w-[100%] mb-[3%]'>
                <div className='upper-left'>
                    <div className='flex items-end mb-[3%]'>
                        <Image src='/Assets/flashcards-colored.svg' width={35} height={35} alt='flashcards icon' className="mr-[2%]"></Image>
                        <p className='text-4xl'>Flashcards</p>
                    </div>
                    <p className="text-[#A1A1AA]">Create and practise with spaced repetition.</p>
                </div>
                <div className='upper-right flex items-center justify-center'>
                    <button
                        className="flex items-center justify-center whitespace-nowrap px-[30%] py-[12%] rounded-xl bg-[#32E0C4] text-sm text-black align-middle"
                        onClick={() => setIsModalOpen(true)}>
                        <Image src='/Assets/plus-icon.svg' width={20} height={20} alt='Plus icon' className="mr-[13%]"></Image>New Deck
                    </button>
                </div>
            </div>
            <div className="lower flex justify-between w-[100%] pb-[7%]">
                <div className="lower-left flex flex-col gap-[50px] w-[40%] mr-[3%] ml-[2%]">
                    <div className=" lower-left-upper border border-solid border-[#27272A] rounded-lg w-[100%] h-[400px] overflow-y-auto custom-scrollbar px-[1%] py-[10%]">

                    </div>
                    <div className="lower-left-lower border border-solid border-[#27272A] rounded-lg w-[100%] h-[200px] overflow-y-auto custom-scrollbar px-[1%] py-[10%]">

                    </div>
                </div>
                <div className="lower-right border-1 border-solid border-[#27272A] rounded-lg w-[52%] h-[650px] verflow-y-auto custom-scrollbar ml-[3%] px-[1%] py-[10%]">

                </div>
            </div>
            <NewDeckModal
                isOpen={isModalOpen}
                onClose={() => {
                    console.log('Closing Modal'); //for debugging
                    setIsModalOpen(false)
                }}>
                <div className="w-[100%] h-[100%] px-[5%] py-[3%] relative">
                    <div className='Headingg mb-[3%]'>
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
                                        className={`relative px-4 pt-4 pb-2 h-[140px] rounded-lg border border-[#27272A] bg-[#09090B] hover:bg-black transition cursor-pointer overflow-hidden group`}
                                        onClick={() => handleNoteSelect(note.id)}>
                                        <h3 className="text-lg font-semibold text-white mb-1">{note.title}</h3>
                                        {/* Note Content with fade effect */}
                                        <div className="text-sm text-[#A1A1AA] overflow-hidden relative h-[60%]">
                                            <p className="line-clamp-[5] pr-6">{note.content}</p>

                                            {/* Fade effect using absolute gradient */}
                                            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#09090B] to-transparent pointer-events-none" />
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent parent click (event bubbling) (e is the event that occured)
                                                handleExpandNote(note.id);
                                            }}
                                            className="absolute top-2 right-2 p-1 hover:scale-110 transition-transform duration-200"
                                        >
                                            <Image src="/Assets/expand-icon.svg" width={26} height={26} alt="Expand note" />
                                        </button>

                                        {selectedNote === note.id && (   //the part on RHS of && will be renedered if condition on LHS is true
                                            <div className="absolute inset-0 border-1 border-[#32E0C4] rounded-lg pointer-events-none" /> //this div will act as the border
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-[#09090B] px-6 pb-6 flex justify-end space-x-4">
                                <button
                                    onClick={() => { setSelectedNote(null); setIsModalOpen(false) }}
                                    className="px-4 py-2 text-[#A1A1AA] hover:text-white transition-colors border border-[#32E0C4] rounded-lg"
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
            {/* Flashcard Success Modal */}
            <FlashcardSuccessModal
                isOpen={isSuccessModalOpen}
                onSave={handleSaveFlashcards}
                onCancel={handleCancel}
                onView={handleViewDeck}
            />

            {/* Cancel Confirmation Modal */}
            <CancelNewdeckModal
                isOpen={isConfirmationModalOpen}
                onCancelWithoutSaving={handleCancelWithoutSaving}
                onSaveAndCancel={handleSaveAndCancel}
                onClose={() => setIsConfirmationModalOpen(false)}
            />
        </main>
    )
}