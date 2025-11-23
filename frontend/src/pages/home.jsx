import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { Button } from "../components/ui/button";
import CharacterIllustration from "../components/characterIllustration";
import FeatureSection from "../components/featureSection";
import { mouseRotationHandler } from "../handlers/homeHandlers";

export default function Home() {
  const elementRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = mouseRotationHandler(elementRef, setMousePosition);

  return (
    <div className="bg-white shadow-2xl overflow-hidden">
      {/* Hero Section */}
      <section className="px-8 py-16 bg-gray-50" onMouseMove={handleMouseMove}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1B0036] leading-tight">
              Stay Connected,
              <br />
              Anytime, Anywhere
            </h1>
            <p className="text-gray-600 text-lg">
              Chat effortlessly with friends and family
              <br />— no matter the distance.
            </p>
            <Link to="/signup">
              <Button className="bg-[#1B0036] text-white hover:bg-gray-800 rounded-full px-8 py-3 text-lg">
                FEEL THE CONNECTION
              </Button>
            </Link>
          </div>

          <div className="flex justify-center">
            <CharacterIllustration
              ref={elementRef}
              mousePosition={mousePosition}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid lg:grid-cols-2">
        <FeatureSection
          title="Real-Time Messaging"
          description="Experience instant communication with real-time messaging. Send and receive messages instantly, share photos and videos, and never miss a moment. Stay in the loop, whether you're at home or on the go."
          bgColor="#D8EDC2"
          circleBg="#1B0036"
          innerCircleBg="white"
          textColor="#1B0036"
          message="Hi !"
        />

        <FeatureSection
          title="Group Chats Made Easy"
          description="Create group chats to keep everyone in the conversation. Organize your chats by topics, events, share updates, and make plans together. It's never been easier to coordinate with friends or collaborate with teammates!"
          bgColor="#1B0036"
          circleBg="#D8EDC2"
          innerCircleBg="#1B0036"
          textColor="white"
          message="Hello !"
        />
      </section>
    </div>
  );
}
