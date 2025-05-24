const SocialAuthButton = ({ icon, text, borderColor = "white", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full px-4 py-3 bg-transparent rounded-lg 
        border-2 transition-all duration-200 hover:bg-gray-700 cursor-pointer
      `}
      style={{ borderColor }}
    >
      {/* Icon container - white background square */}
      <div className="w-8 h-8 bg-transparent rounded flex items-center justify-center mr-4 flex-shrink-0">
        {icon}
      </div>
      
      {/* Text */}
      <span className="text-white font-medium text-center flex-1">
        {text}
      </span>
    </button>
  );
};


export default SocialAuthButton;