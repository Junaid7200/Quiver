//hey, look at this file...now the thing is that I gotta addd a save buttona nd a discard button below the flashcard when the user starts editing, the save button will save the changes made by the user and discard button will discard them (the logic for these is already implemented), I want you to gimme the code to create these buttons and tell me where to add them...aslo gimme the code for a message that displays when the user trues to navigate to another flashcard without saving/discarding the buttons, clicking enter should close that message...Ive implememnted logic in 

"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import ConfirmModal from '../../../components/ConfirmModal'
import Spinner from '../../../components/Spinner'
import React from 'react'

export default function FlashcardPage({ params }) {
    const router = useRouter();
    params = React.use(params);
    const deckId = params.deckid;

    const [isFlipped, setIsFlipped] = useState(false)
    const [flashcards, setFlashcards] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleteDeckModalOpen, setIsDeleteDeckModalOpen] = useState(false)
    const [deckTitle, setDeckTitle] = useState('')
    const [slideDirection, setSlideDirection] = useState('') // 'left' or 'right'
    const [isEditing, setIsEditing] = useState(false)
    const [tempFrontContent, setTempFrontContent] = useState('')
    const [tempBackContent, setTempBackContent] = useState('')
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [isUnsavedWarningOpen, setIsUnsavedWarningOpen] = useState(false)
    const [intendedDirection, setIntendedDirection] = useState(null);
    const [viewedCards, setViewedCards] = useState(new Set());

    const currentFlashcard = flashcards[currentIndex]

    // Fetch flashcards for this deck
    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const supabase = createClient()
                if (!deckId || deckId === 'null') {
                    throw new Error('Invalid deck ID');
                }

                //fetching flashcards
                const { data: cards, error: cardsError } = await supabase
                    .from('flashcards')
                    .select('*')
                    .eq('deck_id', deckId);

                if (cardsError) throw cardsError;

                // Fetching deck progress
                const { data: deck, error: deckError } = await supabase
                    .from('flashcard_decks')
                    .select('total_cards_viewed, last_viewed_card_index')
                    .eq('id', deckId)
                    .single();

                if (cards && cards.length > 0) {
                    setFlashcards(cards);
                    // Initializing viewed cards from saved progress
                    if (deck.total_cards_viewed > 0) {
                        const viewed = new Set();
                        for (let i = 0; i <= deck.last_viewed_card_index; i++) {
                            viewed.add(i);
                        }
                        setViewedCards(viewed);
                    }
                } else {
                    setError('No flashcards found in this deck');
                }
            } catch (error) {
                console.error('Error fetching flashcards:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchFlashcards()
    }, [deckId])

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && isUnsavedWarningOpen) {
                setIsUnsavedWarningOpen(false)
            }
        }

        window.addEventListener('keypress', handleKeyPress)
        return () => window.removeEventListener('keypress', handleKeyPress)
    }, [isUnsavedWarningOpen])

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleNext = () => {
        if (hasUnsavedChanges) {
            setSlideDirection('left');
            setIntendedDirection('next');
            setIsUnsavedWarningOpen(true);
            return
        }
        setIsFlipped(false);
        setSlideDirection('left');
        setCurrentIndex(prev => (prev + 1) % flashcards.length);
        updateDeckProgress();
    }

    const handlePrevious = () => {
        if (hasUnsavedChanges) {
            setSlideDirection('right');
            setIntendedDirection('prev');
            setIsUnsavedWarningOpen(true)
            return
        }
        setIsFlipped(false);
        setSlideDirection('right');
        setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
        updateDeckProgress();
    }

    const handleDelete = async () => {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('flashcards')
                .delete()
                .eq('id', currentFlashcard.id)

            if (error) throw error
            // Update flashcards state after deletion
            setFlashcards(prev => {
                const newFlashcards = prev.filter(card => card.id !== currentFlashcard.id)
                if (newFlashcards.length === 0) {
                    // No cards left, redirect to flashcards page
                    router.push('/flashcards')
                    return []
                }
                // Adjust currentIndex if we're at the last card
                if (currentIndex >= newFlashcards.length) {
                    setCurrentIndex(newFlashcards.length - 1)
                }
                return newFlashcards
            })

            setIsDeleteModalOpen(false)
        } catch (error) {
            console.error('Error deleting flashcard:', error)
            setError(error.message)
        } finally {
            setIsDeleteModalOpen(false)
        }
    }

    const handleDeleteDeck = async () => {
        try {
            const supabase = createClient()
            // Delete all flashcards first
            await supabase
                .from('flashcards')
                .delete()
                .eq('deck_id', deckId)

            // Then delete the deck
            const { error } = await supabase
                .from('flashcard_decks')
                .delete()
                .eq('id', deckId)

            if (error) throw error

            router.push('/flashcards')
        } catch (error) {
            console.error('Error deleting deck:', error)
            setError(error.message)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
        setTempFrontContent(currentFlashcard.front_content)
        setTempBackContent(currentFlashcard.back_content)
        setHasUnsavedChanges(false)
    }

    const handleSave = async () => {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('flashcards')
                .update({
                    front_content: tempFrontContent,
                    back_content: tempBackContent
                })
                .eq('id', currentFlashcard.id)

            if (error) throw error

            // Update local state
            setFlashcards(cards =>
                cards.map(card =>
                    card.id === currentFlashcard.id
                        ? { ...card, front_content: tempFrontContent, back_content: tempBackContent }
                        : card
                )
            )
            setIsEditing(false)
            setHasUnsavedChanges(false)
        } catch (error) {
            console.error('Error updating flashcard:', error)
            setError(error.message)
        }
    }

    const handleDiscard = () => {
        setIsEditing(false)
        setTempFrontContent('')
        setTempBackContent('')
        setHasUnsavedChanges(false)
    }

    const updateDeckProgress = async () => {
        try {
            const supabase = createClient();

            setViewedCards(prev => new Set(prev).add(currentIndex));

            const totalCards = flashcards.length;
            const viewedCardsCount = viewedCards.size;
            const progressPercentage = Math.round((viewedCardsCount / totalCards) * 100);

            console.log('Updating progress:', {
                viewedCardsCount,
                totalCards,
                progressPercentage,
                currentIndex
            });

            const { error } = await supabase
                .from('flashcard_decks')
                .update({
                    last_viewed_at: new Date().toISOString(),
                    last_viewed_card_index: currentIndex,
                    total_cards_viewed: viewedCardsCount,
                    progress_percentage: progressPercentage
                })
                .eq('id', deckId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating deck progress:', error);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Spinner /></div>
    if (error) return <div className="text-red-500">Error: {error}</div>
    if (!currentFlashcard) return <div>No flashcards found in this deck.</div>

    return (
        <main className="relative min-h-screen px-4 py-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <h1 className="text-2xl font-semibold mb-2">{deckTitle}</h1>
                <button
                    onClick={() => router.push('/flashcards')}
                    className="flex items-center text-[#32E0C4] hover:text-white transition-colors"
                >
                    <Image
                        src="/Assets/back-icon.svg"
                        width={20}
                        height={20}
                        alt="Back"
                        className="mr-2"
                    />
                    Go back
                </button>
            </div>

            {/* Navigation Counter */}
            <div className="text-center text-[#A1A1AA] mb-4">
                {currentIndex + 1} / {flashcards.length}
            </div>

            {/* Flashcard Container */}
            <div className="relative w-full max-w-2xl mx-auto group" style={{ perspective: "1000px" }}>
                {/* Navigation Buttons - Now hidden by default */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handlePrevious}
                        disabled={flashcards.length <= 1}
                        className="p-2 hover:scale-125 transition-transform disabled:opacity-50"
                    >
                        <Image src="/Assets/prev-icon.svg" width={32} height={32} alt="Previous card" />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={flashcards.length <= 1}
                        className="p-2 hover:scale-125 transition-transform disabled:opacity-50"
                    >
                        <Image src="/Assets/next-icon.svg" width={32} height={32} alt="Next card" />
                    </button>
                </div>

                <div
                    className={`relative w-full min-h-[400px] transition-all duration-500 transform-style-preserve-3d
                    ${slideDirection === 'left' ? 'translate-x-[-100%]' : ''}
                    ${slideDirection === 'right' ? 'translate-x-[100%]' : ''}
                    ${isFlipped ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d' }}
                    onTransitionEnd={() => setSlideDirection('')}
                >
                    {/* Front of Card */}
                    <div className={`absolute w-full h-full backface-hidden 
                        bg-[#09090B] border border-[#32E0C4] rounded-xl p-8 shadow-lg
                        group/card`}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="h-full flex flex-col">
                            <div className="flex-1 flex items-center justify-center text-lg">
                                {isEditing ? (
                                    <textarea
                                        value={tempFrontContent}
                                        onChange={(e) => {
                                            setTempFrontContent(e.target.value)
                                            setHasUnsavedChanges(true)
                                        }}
                                        className="w-full h-full bg-[#09090B] text-white text-center align-center p-4 rounded-lg resize-none focus:outline-none"
                                    />
                                ) : (
                                    currentFlashcard.front_content
                                )}
                            </div>
                            <div className="flex justify-center gap-6 mt-4 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <button
                                    onClick={handleFlip}
                                    className="p-2 hover:scale-110 transition-transform"
                                >
                                    <Image
                                        src="/Assets/flip-icon.svg"
                                        width={24}
                                        height={24}
                                        alt="Flip card"
                                    />
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className="p-2 hover:scale-110 transition-transform"
                                    disabled={isEditing}
                                >
                                    <Image
                                        src="/Assets/edit-icon.svg"
                                        width={24}
                                        height={24}
                                        alt="Edit card"
                                        className={isEditing ? "opacity-50" : ""}
                                    />
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="p-2 hover:scale-110 transition-transform"
                                >
                                    <Image
                                        src="/Assets/delete-icon.svg"
                                        width={24}
                                        height={24}
                                        alt="Delete card"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Back of Card */}
                    <div
                        className={`absolute w-full h-full backface-hidden 
                                    bg-[#09090B] rounded-xl p-8 shadow-lg border border-[#32E0C4]
                                        group/card rotate-y-180`}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="h-full flex flex-col">
                            <div className="flex-1 flex items-center justify-center text-lg">
                                {isEditing ? (
                                    <textarea
                                        value={tempBackContent}
                                        onChange={(e) => {
                                            setTempBackContent(e.target.value)
                                            setHasUnsavedChanges(true)
                                        }}
                                        className="w-full h-full bg-[#09090B] text-white p-4 text-center resize-none focus:outline-none"
                                    />
                                ) : (
                                    currentFlashcard.back_content
                                )}
                            </div>

                            <div className="flex justify-center gap-6 mt-4 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <button
                                    onClick={handleFlip}
                                    className="p-2 hover:scale-110 transition-transform"
                                >
                                    <Image
                                        src="/Assets/flip-icon.svg"
                                        width={24}
                                        height={24}
                                        alt="Flip card"
                                    />
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className="p-2 hover:scale-110 transition-transform"
                                    disabled={isEditing}
                                >
                                    <Image
                                        src="/Assets/edit-icon.svg"
                                        width={24}
                                        height={24}
                                        alt="Edit card"
                                        className={isEditing ? "opacity-50" : ""}
                                    />
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="p-2 hover:scale-110 transition-transform"
                                >
                                    <Image
                                        src="/Assets/delete-icon.svg"
                                        width={24}
                                        height={24}
                                        alt="Delete card"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save/Discard Buttons */}
            {isEditing && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#32E0C4] text-black rounded-lg hover:bg-[#2bc4ac] transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleDiscard}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Discard
                    </button>
                </div>
            )}

            {/* Unsaved Changes Warning Modal */}
            {isUnsavedWarningOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#09090B] border border-[#32E0C4] rounded-xl p-6 max-w-xl w-full">
                        <h2 className="text-xl font-semibold mb-4">Unsaved Changes</h2>
                        <p className="mb-6">You have unsaved changes. Do you want to save them before continuing?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setIsUnsavedWarningOpen(false);
                                    setIntendedDirection(null);
                                }}
                                className="px-6 py-3 bg-[#09090B] border border-[#32E0C4] text-white hover:bg-[#32E0C4] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDiscard();
                                    setIsUnsavedWarningOpen(false);
                                    if (intendedDirection === 'next') {
                                        setCurrentIndex(prev => (prev + 1) % flashcards.length);
                                    } else {
                                        setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
                                    }
                                    setIntendedDirection(null);
                                    setIsFlipped(false);
                                }}
                                className="px-4 py-2 bg-[#09090B] border border-[#32E0C4] text-white rounded-lg hover:bg-[#32E0C4] transition-colors"
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={async () => {
                                    await handleSave();
                                    setIsUnsavedWarningOpen(false);
                                    if (intendedDirection === 'next') {
                                        setCurrentIndex(prev => (prev + 1) % flashcards.length);
                                    } else {
                                        setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
                                    }
                                    setIntendedDirection(null);
                                    setIsFlipped(false);
                                }}
                                className="px-4 py-2 bg-[#09090B] border border-[#32E0C4] text-white rounded-lg hover:bg-[#32E0C4] transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Deck Button */}
            <button
                onClick={() => setIsDeleteDeckModalOpen(true)}
                className="fixed bottom-8 right-8 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                Delete Deck
            </button>

            {/* Existing Delete Card Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Flashcard"
                message="Are you sure you want to delete this flashcard? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

            {/* Delete Deck Modal */}
            <ConfirmModal
                isOpen={isDeleteDeckModalOpen}
                title="Delete Deck"
                message="Are you sure you want to delete this entire deck? This action cannot be undone."
                onConfirm={handleDeleteDeck}
                onCancel={() => setIsDeleteDeckModalOpen(false)}
            />
        </main>
    )
}
