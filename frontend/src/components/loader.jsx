export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/80">
      <div className="text-center">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#333" strokeWidth="5" fill="#D8EDC2" />
          <circle cx="35" cy="40" r="5" fill="#333" />
          <circle cx="65" cy="40" r="5" fill="#333" />
          <path d="M35 65 Q50 75 65 65" stroke="#333" strokeWidth="3" fill="transparent" />
        </svg>
        <div className="text-lg mt-2 text-black">Loading...</div>
      </div>
    </div>
  );
}