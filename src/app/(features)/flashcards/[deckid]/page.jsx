"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '../../../../utils/supabase/client'
import ConfirmModal from '../../../components/ConfirmModal'
import Spinner from '../../../components/Spinner'
import React from 'react'

export default function FlashcardPage({ params }) {
    params = React.use(params);
    const deckId = params.deckid
    const [isFlipped, setIsFlipped] = useState(false)
    const [flashcards, setFlashcards] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)


    const currentFlashcard = flashcards[currentIndex]

    // Fetch flashcards for this deck
    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const supabase = createClient()
                if (!deckId || deckId === 'null') {
                    throw new Error('Invalid deck ID');
                }

                const { data: cards, error } = await supabase
                    .from('flashcards')
                    .select('*')
                    .eq('deck_id', deckId)

                if (error) throw error
                if (cards && cards.length > 0) {
                    setFlashcards(cards)
                }
                else {
                    setError('No flashcards found in this deck')
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

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleNext = () => {
        setIsFlipped(false) // Reset to front side
        setCurrentIndex(prev => (prev + 1) % flashcards.length)
    }

    const handlePrevious = () => {
        setIsFlipped(false) // Reset to front side
        setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length)
    }

    const handleDelete = async () => {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('flashcards')
                .delete()
                .eq('id', currentFlashcard.id)

            if (error) throw error
            // Handle successful deletion (e.g., move to next card)
        } catch (error) {
            console.error('Error deleting flashcard:', error)
            setError(error.message)
        } finally {
            setIsDeleteModalOpen(false)
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Spinner /></div>
    if (error) return <div className="text-red-500">Error: {error}</div>
    if (!currentFlashcard) return <div>No flashcards found in this deck.</div>

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] px-4">
            {/* Navigation Counter */}
            <div className="text-[#A1A1AA] mb-4">
                {currentIndex + 1} / {flashcards.length}
            </div>

            {/* Flashcard Container */}
            <div className="relative w-full max-w-2xl perspective-1000">
                {/* Navigation Buttons */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20">
                    <button
                        onClick={handlePrevious}
                        disabled={flashcards.length <= 1}
                        className="p-2 hover:scale-110 transition-transform disabled:opacity-50"
                    >
                        <Image
                            src="/Assets/prev-icon.svg"
                            width={32}
                            height={32}
                            alt="Previous card"
                        />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={flashcards.length <= 1}
                        className="p-2 hover:scale-110 transition-transform disabled:opacity-50"
                    >
                        <Image
                            src="/Assets/next-icon.svg"
                            width={32}
                            height={32}
                            alt="Next card"
                        />
                    </button>
                </div>

                <div className={`relative w-full min-h-[400px] transition-transform duration-700 transform-style-3d 
                    ${isFlipped ? 'rotate-y-180' : ''}`}>

                    {/* Front of Card */}
                    <div className={`absolute w-full h-full backface-hidden 
                        ${!isFlipped ? 'z-10' : 'z-0'} 
                        bg-[#09090B] border border-[#32E0C4] rounded-xl p-8 shadow-lg`}>
                        <div className="h-full flex flex-col">
                            <div className="flex-1 flex items-center justify-center text-lg">
                                {currentFlashcard.front_content}
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
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
                                    className="p-2 hover:scale-110 transition-transform"
                                >
                                    <Image
                                        src="/Assets/edit-icon.svg"
                                        width={30}
                                        height={30}
                                        alt="Edit card"
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
                    <div className={`absolute w-full h-full backface-hidden rotate-y-180 
                        ${isFlipped ? 'z-10' : 'z-0'} 
                        bg-[#09090B] rounded-xl p-8 shadow-lg border border-[#32E0C4]`}>
                        <div className="h-full flex flex-col">
                            <div className="flex-1 flex items-center justify-center text-lg">
                                {currentFlashcard.back_content}
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
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
                                    className="p-2 hover:scale-110 transition-transform"
                                >
                                    <Image
                                        src="/Assets/edit-icon.svg"
                                        width={24}
                                        height={24}
                                        alt="Edit card"
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

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Flashcard"
                message="Are you sure you want to delete this flashcard? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </main>
    )
}