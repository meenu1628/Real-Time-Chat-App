import { forwardRef } from "react";

const CharacterIllustration = forwardRef(({ mousePosition }, ref) => (
  <div
    ref={ref}
    className="relative w-80 h-80 rounded-full shadow-[0_0_100px_20px_rgba(170,255,120,1)] transition-shadow duration-300"
    style={{
      transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
      transformStyle: "preserve-3d",
    }}
  >
    {/* Background circle */}
    <div className="absolute inset-0 bg-red-500 rounded-full"></div>

    {/* Character body */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-48 bg-yellow-400 rounded-t-full overflow-hidden">
      {/* Polka dots */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full"
            style={{
              left: `${(i % 5) * 20 + 10}%`,
              top: `${Math.floor(i / 5) * 25 + 10}%`,
            }}
          />
        ))}
      </div>
      {/* Head */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-18 bg-[#1B0036] rounded-full">
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full"></div>
      </div>
    </div>

    {/* Chat bubbles */}
    <div className="absolute -top-4 -left-8 w-20 h-12 bg-[#1B0036] rounded-2xl flex items-center justify-center">
      <div className="w-12 h-1 bg-white rounded-full"></div>
    </div>
    <div className="absolute -top-4 -right-8 w-20 h-12 bg-[#1B0036] rounded-2xl flex items-center justify-center">
      <div className="w-8 h-1 bg-white rounded-full"></div>
    </div>
  </div>
));

export default CharacterIllustration;
