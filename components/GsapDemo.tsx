"use client";
import { useState, useEffect, useRef } from "react";

export default function GsapDemo() {
  const [isClient, setIsClient] = useState(false);
  const boxRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    setIsClient(true);

    const loadGsap = async () => {
      const gsapModule = await import("gsap");
      const { gsap } = gsapModule;

      await import("gsap/ScrollTrigger");
      await import("gsap/ScrollToPlugin");

      timelineRef.current = gsap.timeline({ paused: true });

      timelineRef.current
        .to(boxRef.current, {
          rotation: 360,
          x: 100,
          duration: 2,
          ease: "power2.inOut",
        })
        .to(
          boxRef.current,
          {
            backgroundColor: "#8A2BE2",
            borderRadius: "50%",
            duration: 1,
          },
          "-=0.5"
        )
        .to(
          circleRef.current,
          {
            scale: 1.5,
            y: -50,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)",
          },
          "-=0.5"
        )
        .to(
          textRef.current,
          {
            scale: 1.2,
            color: "#FF4500",
            duration: 1,
            ease: "power1.inOut",
          },
          "-=1"
        );

      masterTimelineRef.current = gsap.timeline({ paused: true });
      masterTimelineRef.current.add(timelineRef.current).add(() => {
        gsap.to(".stagger-item", {
          y: -20,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
      });
    };

    loadGsap();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
      }
    };
  }, []);

  const playAnimation = () => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.restart();
    }
  };

  const reverseAnimation = () => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.reverse();
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        GSAP Animation Demo
      </h1>

      <div className="mb-6 flex justify-center space-x-4">
        <button
          onClick={playAnimation}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Play Animation
        </button>
        <button
          onClick={reverseAnimation}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
        >
          Reverse
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex-1 relative h-64 border border-gray-200 rounded-lg p-4 flex items-center justify-center">
          <div className="animation-container relative w-full h-full flex items-center justify-center">
            <div ref={boxRef} className="w-16 h-16 bg-blue-500"></div>
            <div
              ref={circleRef}
              className="absolute w-12 h-12 bg-red-500 rounded-full"
            ></div>
            <div
              ref={textRef}
              className="absolute text-xl font-bold text-gray-800"
            >
              GSAP
            </div>
          </div>
        </div>

        <div className="flex-1 h-64 border border-gray-200 rounded-lg p-4 flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold mb-4">Stagger Animation</h3>
          <div className="flex justify-center space-x-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="stagger-item w-6 h-24 bg-gradient-to-b from-purple-500 to-blue-500 rounded-md opacity-0"
                style={{ height: `${60 + Math.random() * 40}px` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Animation Code</h2>
        <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm">
            {`// Basic timeline animation
const tl = gsap.timeline();
tl.to(element, { 
  rotation: 360, 
  x: 100, 
  duration: 2,
  ease: "power2.inOut"
})
.to(element, { 
  backgroundColor: "#8A2BE2", 
  borderRadius: "50%", 
  duration: 1 
}, "-=0.5")

// Stagger animation
gsap.to(".stagger-item", {
  y: -20,
  opacity: 1,
  stagger: 0.1,
  duration: 0.5,
  ease: "back.out(1.7)"
});`}
          </pre>
        </div>
      </div>
    </div>
  );
}
