export default function Button({ children, onClick, primary, className = '', type = 'button' }) {
  const baseStyle = 'py-3 px-4 rounded-md flex items-center justify-center font-medium transition-all duration-200 cursor-pointer';
  const primaryStyle = primary 
    ? 'bg-[#5222D0] text-white hover:bg-[#6B32E8]' 
    : 'bg-[#26223A] text-white hover:bg-opacity-90';
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyle} ${primaryStyle} ${className}`}
    >
      {children}
    </button>
  );
}
