import React from 'react';

export default function FlashcardSuccessModal({ isOpen, onView, onSave, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      
      {/* Modal */}
      <div className="bg-[#09090B] border border-[#32E0C4] rounded-2xl p-6 w-[400px] z-50 relative">
        <h3 className="text-xl font-semibold text-white mb-4">Flashcards have been generated!</h3>
        <p className="text-[#A1A1AA] mb-6">What would you like to do next?</p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#32E0C4] transition"
          >
            Cancel
          </button>
          <button 
            onClick={onView}
            className="px-4 py-2 rounded-lg border border-[#32E0C4] text-[#32E0C4] hover:bg-[#32E0C4] hover:text-black transition"
          >
            View
          </button>
          <button 
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-[#32E0C4] text-black hover:bg-opacity-90 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}