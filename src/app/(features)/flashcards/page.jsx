"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import NewDeckModal from '../../components/NewDeckModal';
import Spinner from '../../components/Spinner'
import { createClient } from '../../../utils/supabase/client'

export default function flashcards() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedNotes, setSelectedNotes] = useState([]);

    //Toggling selection of a note when clicked
    const handleNoteSelect = (noteId) => {
        setSelectedNotes((prev) =>
            prev.includes(noteId)
                ? prev.filter((id) => id !== noteId)
                : [...prev, noteId]
        );
    };

    //Expanding the note
    const handleExpandNote = (noteID) => {
        const note = notes.find(notey => n.id === noteID);
        setIsModalOpen(true);
        <NewDeckModal></NewDeckModal>
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

                    if (authError) throw authError;
                    if (!authUser) {
                        console.error('Error getting user: No authenticated user found.', authError.message);
                        return "User not authenticated";
                    }

                    // Get the authenticated user's ID
                    const userId = authUser.id;

                    // Fetch notes from the 'notes' table where 'user_id' matches the authenticated user's ID
                    const { data: userNotes, error: notesError } = await supabase
                        .from('notes')
                        .select('*')
                        .eq('user_id', userId);

                    if (notesError) {
                        console.error('Error fetching notes:', notesError.message);
                        return "Error fetching notes";
                    }

                    setNotes(userNotes);
                } catch (error) {
                    console.error("Error in fetchUserNotes:", error.message);
                    setError(err.message); // Set the error state
                    setNotes([]);
                }
                finally {
                    setLoading(false); 
                }
            };
            fetchUserNotes();
        }
    }, [isModalOpen])

    return (
        <main className='w-[100%] min-h-screen pr-[1%]'>
            <div className='upper flex justify-between w-[100%] mb-[3%] h-[20%]'>
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
            <div className="lower flex justify-between w-[100%] h-[80%]">
                <div className="lower-left flex flex-col gap-[3%] w-[45%]">
                    <div className=" lower-left-upper border border-solid border-[#09090B] rounded-lg w-[100%] min-h-[70%] px-[1%] py-[10%]">

                    </div>
                    <div className="lower-left-lower border border-solid border-[#09090B] rounded-lg w-[100%] min-h[30%] px-[1%] py-[10%]">
                        <div className="flex items-center mb-[2%]">
                            <Image src='/Assets/AI-flashcard-icon.svg' height={20} width={20} alt='AI icon' className="mr-[2%]"></Image>
                            <p className="text-xl">AI Flashcard Generator</p>
                        </div>
                        <p className="text-[#A1A1AA]">Automatically create flashcards from your notes using AI.</p>
                    </div>
                </div>
                <div className="lower-right border-1 border-solid border-[#09090B] rounded-lg w-[55%] min-h-[100%] px-[1%] py-[10%]">

                </div>
            </div>
            <NewDeckModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="w-[100%] h-[100%] px-[3%] py-[2%]">
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
                        <div className="space-y-4 min-h-[79%] max-h-[80%] overflow-y-auto">
                            {notes.map((note) => (
                                <div key={note.id}
                                    className={`relative p-4 w-full max-w-[28%] h-[120px] rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] transition cursor-pointer overflow-hidden group`}
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
                                    
                                    {selectedNotes.includes(note.id) && (   //the part on RHS of && will be renedered if condition on LHS is true
                                        <div className="absolute inset-0 border-1 border-[#32E0C4] rounded-lg pointer-events-none" /> //this div will act as the border
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </NewDeckModal>
        </main>
    )
}