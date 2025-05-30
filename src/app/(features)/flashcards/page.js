'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import NewDeckModal from '../../components/NewDeckModal';
import Spinner from '../../components/Spinner'
import { createClient } from '../../../utils/supabase/client.ts'

export default function flashcards() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                    setLoading(false); // <--- Always set loading to false after attempt
                }
            };
            fetchUserNotes();
        }
    }, [isModalOpen])

    return (
        <main className='mt-[1%] w-[100%] min-h-screen pr-[1%]'>
            <div className='upper flex justify-between w-[100%] mb-[3%]'>
                <div className='upper-left'>
                    <div className='flex items-end mb-[3%]'>
                        <Image src='/Assets/flashcards-colored.svg' width={35} height={35} alt='flashcards icon' className="mr-[2%]"></Image>
                        <p className='text-4xl'>Flashcards</p>
                    </div>
                    <p className="text-[#A1A1AA]">Create and practise with spaced repitition.</p>
                </div>
                <div className='upper-right flex items-center justify-center'>
                    <button className="flex items-center justify-center whitespace-nowrap px-[30%] py-[12%] rounded-xl bg-[#32E0C4] text-sm text-black align-middle" onClick={() => setIsModalOpen(true)}>
                        <Image src='/Assets/plus-icon.svg' width={20} height={20} alt='Plus icon' className="mr-[13%]"></Image>New Deck
                    </button>
                </div>
            </div>
            <div className="lower flex justify-between w-[100%]">
                <div className="lower-left flex flex-col gap-[3%] w-[45%]">
                    <div className="border-1 border-solid border-[#09090B] rounded-lg w-[100%]">

                    </div>
                    <div className="border-1 border-solid border-[#09090B] rounded-lg w-[100%] px-[1%] py-[10%]">
                        <div className="flex items-center mb-[2%]">
                            <Image src='/Assets/AI-flashcard-icon.svg' height={20} width={20} alt='AI icon' className="mr-[2%]"></Image>
                            <p className="text-xl">AI Flashcard Generator</p>
                        </div>
                        <p className="text-[#A1A1AA]">Automatically create flashcards from your notes using AI.</p>
                    </div>
                </div>
                <div className="lower-right border-1 border-solid border-[#09090B] rounded-lg w-[55%]">

                </div>
            </div>
            <NewDeckModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="w-[100%] px-[3%] py-[2%]">
                    <div className='Headingg'>
                        <p className="text-3xl pb-[1%]">Create New Deck of Flashcards</p>
                        <p className="text-mdtext-[#A1A1AA]">&nbsp;Choose the notes whose flashcards you want to generate.</p>
                    </div>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto">

                        </div>
                    )}
                </div>
            </NewDeckModal>
        </main>
    )
}