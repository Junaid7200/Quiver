"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function CustomCheckbox({ id, label, checked, onChange, className = '' }) {
  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative mr-2">
          <input 
            type="checkbox" 
            id={id} 
            checked={checked}
            onChange={onChange}
            className="sr-only" // Hide the default checkbox
          />
          
          <div className={`w-5 h-5 border border-gray-600 ${checked ? 'bg-transparent' : 'bg-transparent'}`}>
            {checked && (
              <Image
                src="/Assets/Check Box.png"
                alt="Checked"
                width={20}
                height={20}
                className="absolute top-0 left-0"
              />
            )}
          </div>
        </div>
        {label}
      </label>
    </div>
  );
}
