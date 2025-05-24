export default function Divider({ text }) {
  return (
    <div className="flex items-center my-4">
      <div className="flex-grow h-px bg-gray-700"></div>
      {text && (
        <span className="px-3 text-sm text-gray-400">{text}</span>
      )}
      <div className="flex-grow h-px bg-gray-700"></div>
    </div>
  );
}
