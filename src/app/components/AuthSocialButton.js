const SocialAuthButton = ({ icon, text, borderColor = "white", onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center w-full bg-transparent 
        border-2 transition-all duration-200 cursor-pointer
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-gray-700'
        }
      `}
      style={{ borderColor }}
    >
      {/* Icon container - white background square */}
      <div className="h-full bg-white flex items-center justify-center px-4">
        {icon}
      </div>
      
      {/* Text */}
      <span className="text-white font-medium text-center flex-1 py-3">
        {text}
      </span>
    </button>
  );
};

export default SocialAuthButton;