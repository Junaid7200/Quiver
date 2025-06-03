import React from 'react';

export default function CancelNewdeckModal({ isOpen, onCancelWithoutSaving, onSaveAndCancel, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="bg-[#09090B] border border-[#32E0C4] rounded-2xl p-6 w-[450px] z-50 relative">
        <h3 className="text-xl font-semibold text-white mb-4">Are you sure?</h3>
        <p className="text-[#A1A1AA] mb-6">If you cancel now, the flashcards will not be saved. What would you like to do?</p>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancelWithoutSaving}
            className="px-4 py-2 rounded-lg border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#32E0C4] transition"
          >
            Cancel Without Saving
          </button>
          <button 
            onClick={onSaveAndCancel}
            className="px-4 py-2 rounded-lg bg-[#32E0C4] text-black hover:bg-opacity-90 transition"
          >
            Save and Cancel
          </button>
        </div>
      </div>
    </div>
  );
}