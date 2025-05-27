"use client";

export default function InputField({ 
  id, 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  name,
  required = false,
  error
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
        className={`w-full py-2.5 px-4 bg-[#1E1E1E] text-gray-200 rounded-md outline-none focus:ring-2 focus:ring-[#5222D0] focus:border-[#5222D0] transition-all duration-300 border ${error ? 'border-red-500' : 'border-gray-700 hover:border-purple-500'}`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
