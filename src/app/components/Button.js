// we gotta disable the button during the loading state
export default function Button({ children, onClick, primary, className = '', type = 'button', disabled = false }) {
  const baseStyle = 'py-3 px-4 rounded-md flex items-center justify-center font-medium transition-all duration-200';
  const primaryStyle = primary 
    ? 'bg-[#5222D0] text-white hover:bg-[#6B32E8]' 
    : 'bg-[#26223A] text-white hover:bg-opacity-90';
  const disabledStyle = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${primaryStyle} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
}
