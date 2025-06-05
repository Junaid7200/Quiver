"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from '../../utils/supabase/client'
import ActivityHeatmap from '../components/DashboardHeatmap'

export default function dashboard() {
    const [firstname, setFirstName] = useState(null);
    const [lastname, setLastName] = useState(null);
    const [error, setError] = useState(null);
    const [lastIncompleteDesk, setLastIncompleteDeck] = useState(null);
    const [lastEditedNote, setLastEditedNote] = useState(null);
    const [userStats, setUserStats] = useState({
        createdAt: null,
        totalDecks: 0,
        totalFlashcards: 0,
        totalNotes: 0
    });
    const [activityData, setActivityData] = useState([]);
    const [selectedDateActivity, setSelectedDateActivity] = useState({
        flashcards: [],
        notes: []
    });
    const router = useRouter();

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) return;

                // Get user creation date
                const createdAt = new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });

                // Get all decks for this user first
                const { data: userDecks } = await supabase
                    .from('flashcard_decks')
                    .select('id')
                    .eq('user_id', user.id);

                // Get all folders for this user first
                const { data: userFolders } = await supabase
                    .from('folders')
                    .select('id')
                    .eq('user_id', user.id);

                // Get total decks
                const { count: decksCount } = await supabase
                    .from('flashcard_decks')
                    .select('*', { count: 'exact' })
                    .eq('user_id', user.id);

                // Get total flashcards
                const { count: cardsCount } = await supabase
                    .from('flashcards')
                    .select('*', { count: 'exact' })
                    .in('deck_id', userDecks?.map(deck => deck.id) || []);

                // Get total notes
                const { count: notesCount } = await supabase
                    .from('notes')
                    .select('*', { count: 'exact' })
                    .in('folder_id', userFolders?.map(folder => folder.id) || []);

                setUserStats({
                    createdAt,
                    totalDecks: decksCount || 0,
                    totalFlashcards: cardsCount || 0,
                    totalNotes: notesCount || 0
                });

            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        };

        fetchUserStats();
    }, []);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const supabase = createClient();

                //getting auth user
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

                if (authError) throw authError;
                if (!authUser) {
                    router.push('/signin');
                    return;
                }

                //fetching username
                const { data: userName, error: dbError } = await supabase
                    .from('users')
                    .select('first_name, last_name')  // Add last_name to the select
                    .eq('id', authUser.id)
                    .single();

                if (dbError) throw dbError;
                if (!userName) {
                    console.error("No user profile found for ID:", authUser.id);
                    return;
                }

                setFirstName(userName.first_name);
                setLastName(userName.last_name);
            } catch (error) {
                console.error("Error fetching user:", error);
                setError(error.message);
            }
        };
        fetchUserName();
    }, [router])

    const fullName = firstname && lastname ? `${firstname} ${lastname}` : '';

    useEffect(() => {
        const fetchLastIncompleteDeck = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) return;

                const { data: decks, error } = await supabase
                    .from('flashcard_decks')
                    .select(`
                        id,
                        name,
                        progress_percentage,
                        last_viewed_at,
                        last_viewed_card_index
                    `)
                    .eq('user_id', user.id)
                    .lt('progress_percentage', 100)
                    .order('last_viewed_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error) throw error;
                setLastIncompleteDeck(decks);
            } catch (error) {
                console.error("Error fetching incomplete deck:", error);
            }
        };

        fetchLastIncompleteDeck();
    }, []);

    // Add new useEffect for fetching last edited note
    useEffect(() => {
        const fetchLastEditedNote = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) return;

                const { data: folders, error: foldersError } = await supabase
                    .from('folders')
                    .select('id')
                    .eq('user_id', user.id);

                if (foldersError) {
                    console.error("Error fetching folders:", foldersError);
                    return;
                }

                if (!folders || folders.length === 0) {
                    console.log("No folders found for user");
                    return;
                }

                const folderIds = folders.map(folder => folder.id);

                const { data: notes, error: notesError } = await supabase
                    .from('notes')
                    .select('id, title, updated_at')
                    .in('folder_id', folderIds)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (notesError) {
                    console.error("Error fetching notes:", notesError);
                    return;
                }


                setLastEditedNote(notes);
            } catch (error) {
                console.error("Unexpected error:", error);
            }
        };

        fetchLastEditedNote();
    }, []);

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) return;

                // Get current month's range
                const today = new Date();
                const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

                // Fetch flashcard activity
                const { data: flashcardActivity } = await supabase
                    .from('user_activity')
                    .select('date, activity_count')
                    .eq('user_id', user.id)
                    .gte('date', startDate.toISOString())
                    .lte('date', today.toISOString());

                setActivityData(flashcardActivity?.map(day => ({
                    date: day.date,
                    count: day.activity_count
                })) || []);
            } catch (error) {
                console.error("Error fetching activity data:", error);
            }
        };

        fetchActivityData();
    }, []);

    const handleDeckClick = (deckId) => {
        router.push(`/flashcards/${deckId}?cardIndex=${lastIncompleteDesk.last_viewed_card_index || 0}`);
    };

    const handleNoteClick = (noteId) => {
        router.push(`/notes/${noteId}`);
    };

    const handleDateSelect = async (date) => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // Get all folders for this user first
            const { data: userFolders } = await supabase
                .from('folders')
                .select('id')
                .eq('user_id', user.id);

            // Format the date properly for the equals comparison
            const formattedDate = new Date(date).toISOString().split('T')[0];

            // Fetch flashcard activity for selected date
            const { data: flashcardActivity } = await supabase
                .from('flashcard_decks')
                .select('id, name, last_viewed_card_index, updated_at')
                .eq('user_id', user.id)
                .gte('updated_at', `${formattedDate}T00:00:00`)
                .lt('updated_at', `${formattedDate}T23:59:59.999Z`);

            // Fetch notes activity for selected date
            const { data: notesActivity } = await supabase
                .from('notes')
                .select('id, title, updated_at')
                .in('folder_id', userFolders?.map(folder => folder.id) || [])
                .gte('updated_at', `${formattedDate}T00:00:00`)
                .lt('updated_at', `${formattedDate}T23:59:59.999Z`);

            setSelectedDateActivity({
                flashcards: flashcardActivity || [],
                notes: notesActivity || []
            });
        } catch (error) {
            console.error("Error fetching date activity:", error);
        }
    };

    return (
        <main className="min-h-screen w-[100%] mt-[3%] bg-[#09090B] pb-[10%]">
            <p className='text-4xl pb-[1%]'>Welcome back, {firstname}!</p>
            <p className="text-[#A1A1AA] mb-[2%] text-lg">Track your learning progress and continue where you left off.</p>
            <article className="w-full flex flex-col items-center gap-20 mt-[4%] px-[3%]">
                {/* Upper Section */}
                <div className="w-full flex justify-center gap-[6%]">
                    <div className="w-[40%] border border-[#27272A] rounded-xl min-h-[400px]">
                        <div className="border-b border-[#27272A]">
                            <div className="flex items-center gap-4 px-6 py-4">
                                <div className="bg-[#09090B] rounded-lg p-2">
                                    <Image
                                        src="/Assets/profile-icon.svg"
                                        width={50}
                                        height={50}
                                        alt="Profile"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-3xl mb-1">User Summary</h2>
                                    <p className="text-md text-[#A1A1AA]">Your learning statistics</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">

                                <div>
                                    <h3 className="text-2xl text-white">{fullName}</h3>
                                    <p className="text-md text-[#A1A1AA]">Member since {userStats.createdAt}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-[#27272A] rounded-2xl p-4 hover:bg-black transition-all duration-200">
                                    <div className="flex items-start gap-3">
                                        <Image
                                            src="/Assets/flashcards-icon.svg"
                                            width={50}
                                            height={50}
                                            alt="Flashcards"
                                        />
                                        <div>
                                            <p className="text-sm text-[#A1A1AA]">Total Decks</p>
                                            <p className="text-2xl text-white">{userStats.totalDecks}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#27272A] rounded-2xl p-4 hover:bg-black transition-all duration-200">
                                    <div className="flex items-start gap-3">
                                        <Image
                                            src="/Assets/cards-icon.svg"
                                            width={50}
                                            height={50}
                                            alt="Cards"
                                        />
                                        <div>
                                            <p className="text-sm text-[#A1A1AA]">Flashcards</p>
                                            <p className="text-2xl text-white">{userStats.totalFlashcards}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#27272A] rounded-2xl p-4 hover:bg-black transition-all duration-200">
                                    <div className="flex items-start gap-3">
                                        <Image
                                            src="/Assets/notes-icon.svg"
                                            width={50}
                                            height={50}
                                            alt="Notes"
                                        />
                                        <div>
                                            <p className="text-sm text-[#A1A1AA]">Notes</p>
                                            <p className="text-2xl text-white">{userStats.totalNotes}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[40%] border border-[#27272A] rounded-xl min-h-[400px]">
                        <div className="border-b border-[#27272A]">
                            <div className="flex items-center gap-4 px-6 py-4">
                                <div className="bg-[#09090B] rounded-lg p-2">
                                    <Image
                                        src="/Assets/activity-icon.svg"
                                        width={50}
                                        height={50}
                                        alt="Recent Activity"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-3xl mb-1">Recent Activity</h2>
                                    <p className="text-md text-[#A1A1AA]">Your latest study sessions</p>
                                </div>
                            </div>
                        </div>
                        <div className="content2 p-6 space-y-4">
                            {lastIncompleteDesk && (
                                <button
                                    onClick={() => handleDeckClick(lastIncompleteDesk.id)}
                                    className="w-full p-4 rounded-2xl bg-[#27272A] hover:bg-black transition-all duration-200 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/Assets/flashcards-icon.svg"
                                                width={40}
                                                height={40}
                                                alt="Flashcards"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-xl text-white">
                                                    {lastIncompleteDesk.name}
                                                </h3>
                                                <span className="text-sm text-[#A1A1AA]">
                                                    {lastIncompleteDesk.progress_percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-[#1A1A1A] rounded-full h-1.5">
                                                <div
                                                    className="bg-[#32E0C4] h-1.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${lastIncompleteDesk.progress_percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )}

                            {lastEditedNote && (
                                <button
                                    onClick={() => handleNoteClick(lastEditedNote.id)}
                                    className="w-full p-4 rounded-2xl bg-[#27272A] hover:bg-black transition-all duration-200 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/Assets/notes-icon.svg"
                                                width={40}
                                                height={40}
                                                alt="Notes"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col">
                                                <h3 className="text-left text-xl text-white mb-1">
                                                    {lastEditedNote.title}
                                                </h3>
                                            </div>
                                            <p className="text-left text-sm text-[#A1A1AA]">Edit your note</p>
                                        </div>
                                    </div>
                                </button>
                            )}

                            {!lastIncompleteDesk && !lastEditedNote && (
                                <div className="flex justify-center items-center h-[300px] text-[#A1A1AA]">
                                    No recent activity
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle Section */}
                <div className="w-[86%] border border-[#27272A] rounded-xl max-h-[540px]"> {/* Reduced height */}
                    <div className="border-b border-[#27272A]">
                        <div className="flex items-center gap-4 px-6 py-4">
                            <div className="bg-[#09090B] rounded-lg p-2">
                                <Image
                                    src="/Assets/calendar-icon.svg"
                                    width={50}
                                    height={50}
                                    alt="Activity Calendar"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl mb-1">Activity Overview</h2>
                                <p className="text-md text-[#A1A1AA]">
                                    Your learning activity for {new Date().toLocaleString('default', { month: 'long' })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="py-6 px-13 flex justify-between items-start h-[calc(100%-85px)]">
                        <div className="w-1/2 h-full flex items-center">
                            <ActivityHeatmap data={activityData} onDateSelect={handleDateSelect} />
                        </div>
                        <div className="w-1/2 flex flex-col gap-4">
                            <div className="bg-[#27272A] rounded-xl overflow-hidden"> 
                                <div className="px-4 py-3 border-b border-[#1A1A1A]"> {/* Header section */}
                                    <h3 className="text-xl flex items-center gap-2">
                                        <Image
                                            src="/Assets/flashcards-icon.svg"
                                            width={35}
                                            height={35}
                                            alt="Flashcards"
                                        />
                                        Flashcard Activity
                                    </h3>
                                </div>
                                <div className="max-h-[126px] min-h-[100px] overflow-y-auto custom-scrollbar"> {/* Content section */}
                                    <div className="p-4 space-y-3">
                                        {selectedDateActivity.flashcards.length > 0 ? (
                                            selectedDateActivity.flashcards.map((deck) => (
                                                <div key={deck.id}
                                                    className="bg-[#1A1A1A] rounded-lg p-3 hover:bg-black transition-all duration-200">
                                                    <p className="text-white">{deck.name}</p>
                                                    <p className="text-sm text-[#A1A1AA]">
                                                        Reviewed up to card {deck.last_viewed_card_index + 1}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[#A1A1AA] text-center">No flashcard activity on this date</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#27272A] rounded-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-[#1A1A1A]"> {/* Header section */}
                                    <h3 className="text-xl flex items-center gap-2">
                                        <Image
                                            src="/Assets/notes-icon.svg"
                                            width={35}
                                            height={35}
                                            alt="Notes"
                                        />
                                        Notes Activity
                                    </h3>
                                </div>
                                <div className="max-h-[126px] min-h-[100px] overflow-y-auto custom-scrollbar"> {/* Content section */}
                                    <div className="p-4 space-y-3">
                                        {selectedDateActivity.notes.length > 0 ? (
                                            selectedDateActivity.notes.map((note) => (
                                                <div key={note.id}
                                                    className="bg-[#1A1A1A] rounded-lg p-3 hover:bg-black transition-all duration-200">
                                                    <p className="text-white">{note.title}</p>
                                                    <p className="text-sm text-[#A1A1AA]">
                                                        Last updated at {new Date(note.updated_at).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[#A1A1AA] text-center">No notes activity on this date</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </article>
        </main >
    )
}
