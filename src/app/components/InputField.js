"use client";

export default function InputField({ 
  id, 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  name,
  required = false
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full py-2.5 px-4 bg-[#1E1E1E] text-gray-200 rounded-md outline-none focus:ring-1 focus:ring-purple-500 border border-gray-500"
      />
    </div>
  );
}
