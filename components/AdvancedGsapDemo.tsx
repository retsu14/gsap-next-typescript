"use client";
import React, { useState, useEffect, useRef } from "react";

export default function AdvancedGsapDemo() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [activeDemo, setActiveDemo] = useState<string>("basic");

  // Refs for various animation elements
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const gsapInstance = useRef<any>(null); // GSAP type

  // Initialize on client-side only to avoid hydration issues
  useEffect(() => {
    setIsClient(true);

    // Import GSAP dynamically to avoid SSR issues
    const loadGsap = async () => {
      try {
        const gsapModule = await import("gsap");
        const { gsap } = gsapModule;
        gsapInstance.current = gsap;

        // Load plugins
        const ScrollTriggerModule = await import("gsap/ScrollTrigger");
        const TextPlugin = await import("gsap/TextPlugin");
        const MotionPathPlugin = await import("gsap/MotionPathPlugin");

        // Register plugins
        gsap.registerPlugin(
          ScrollTriggerModule.ScrollTrigger,
          TextPlugin.TextPlugin,
          MotionPathPlugin.MotionPathPlugin
        );

        initAnimations(gsap);
      } catch (error) {
        console.error("Error loading GSAP or plugins:", error);
      }
    };

    loadGsap();

    // Create particles for particle effect
    if (isClient && particlesContainerRef.current) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.backgroundColor = getRandomColor();
        particle.style.width = `${5 + Math.random() * 10}px`;
        particle.style.height = particle.style.width;
        particlesContainerRef.current.appendChild(particle);
      }
    }

    return () => {
      // Clean up animations
      if (gsapInstance.current && gsapInstance.current.ScrollTrigger) {
        gsapInstance.current.ScrollTrigger.getAll().forEach((trigger: any) =>
          trigger.kill()
        );
      }
    };
  }, [isClient]);

  const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const initAnimations = (gsap: any) => {
    // Reset any previous animations
    gsap.killTweensOf("*");

    // Initialize based on active demo
    switch (activeDemo) {
      case "basic":
        initBasicAnimations(gsap);
        break;
      case "text":
        initTextAnimations(gsap);
        break;
      case "particles":
        initParticleAnimations(gsap);
        break;
      case "cards":
        initCardAnimations(gsap);
        break;
      case "motion":
        initMotionPathAnimations(gsap);
        break;
      default:
        initBasicAnimations(gsap);
    }
  };

  const initBasicAnimations = (gsap: any) => {
    const heroTl = gsap.timeline();

    if (heroTextRef.current && heroTextRef.current.children) {
      heroTl
        .from(heroTextRef.current.children, {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power4.out",
        })
        .from(
          ".hero-box",
          {
            scale: 0,
            rotation: -45,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
          },
          "-=0.5"
        );
    }
  };

  const initTextAnimations = (gsap: any) => {
    const textTl = gsap.timeline();

    textTl
      .to(".text-char", {
        opacity: 1,
        stagger: 0.03,
        duration: 0.1,
      })
      .to(".text-line", {
        width: "100%",
        duration: 1,
        ease: "power2.inOut",
      })
      .from(
        ".split-text span",
        {
          opacity: 0,
          y: 20,
          stagger: 0.05,
          duration: 0.5,
        },
        "-=0.5"
      );

    // Typewriter effect
    const typewriterEl = document.querySelector(".typewriter-text");
    if (typewriterEl) {
      gsap.to(typewriterEl, {
        text: {
          value: "GSAP makes animations simple and powerful.",
          delimiter: "",
        },
        duration: 3,
        ease: "none",
        repeat: 1,
        repeatDelay: 1,
        yoyo: true,
      });
    }
  };

  const initParticleAnimations = (gsap: any) => {
    if (particlesContainerRef.current) {
      const particles = document.querySelectorAll(".particle");

      particles.forEach((particle) => {
        gsap.to(particle, {
          x: `random(-100, 100, 5)`,
          y: `random(-100, 100, 5)`,
          rotation: `random(-180, 180)`,
          scale: `random(0.5, 2, 0.1)`,
          duration: `random(2, 5)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Burst effect on click
      particlesContainerRef.current.onclick = (e: MouseEvent) => {
        const rect = particlesContainerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        particles.forEach((particle) => {
          const currentX = gsap.getProperty(particle, "x");
          const currentY = gsap.getProperty(particle, "y");

          gsap.to(particle, {
            x: currentX + (Math.random() - 0.5) * 200,
            y: currentY + (Math.random() - 0.5) * 200,
            scale: Math.random() * 2 + 0.5,
            duration: 1,
            ease: "power2.out",
          });
        });
      };
    }
  };

  const initCardAnimations = (gsap: any) => {
    if (cardContainerRef.current) {
      const cards = document.querySelectorAll(".card-item");

      gsap.set(cards, { opacity: 0, y: 50 });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // Set up hover animations
      cards.forEach((card) => {
        const overlay = card.querySelector(".card-overlay");
        const content = card.querySelector(".card-content");

        card.addEventListener("mouseenter", () => {
          gsap.to(overlay, {
            opacity: 0.9,
            duration: 0.3,
          });
          gsap.to(content, {
            y: 0,
            opacity: 1,
            duration: 0.3,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
          });
          gsap.to(content, {
            y: 20,
            opacity: 0,
            duration: 0.3,
          });
        });
      });
    }
  };

  const initMotionPathAnimations = (gsap: any) => {
    if (floatingElementsRef.current) {
      const elements = document.querySelectorAll(".floating-element");

      elements.forEach((element, index) => {
        // Create a random path
        const path = `M0,0 C${Math.random() * 200 - 100},${
          Math.random() * 100 - 50
        } ${Math.random() * 200 - 100},${Math.random() * 100 - 50} 0,0`;

        gsap.to(element, {
          motionPath: {
            path: path,
            align: "self",
            autoRotate: true,
          },
          duration: 5 + index,
          repeat: -1,
          ease: "none",
        });

        // Add some oscillation
        gsap.to(element, {
          scale: Math.random() * 0.5 + 0.8,
          opacity: Math.random() * 0.5 + 0.5,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }
  };

  const changeDemo = (demo: string) => {
    setActiveDemo(demo);
    setTimeout(() => {
      if (gsapInstance.current) {
        initAnimations(gsapInstance.current);
      }
    }, 100);
  };

  if (!isClient) {
    return null; // Prevent rendering during SSR
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div ref={heroTextRef} className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Advanced GSAP Animations</h1>
        <p className="text-lg text-gray-600">
          Interactive demos showcasing GSAP's animation capabilities
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => changeDemo("basic")}
          className={`px-4 py-2 rounded-md transition ${
            activeDemo === "basic" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Basic Animations
        </button>
        <button
          onClick={() => changeDemo("text")}
          className={`px-4 py-2 rounded-md transition ${
            activeDemo === "text" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Text Effects
        </button>
        <button
          onClick={() => changeDemo("particles")}
          className={`px-4 py-2 rounded-md transition ${
            activeDemo === "particles"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Particles
        </button>
        <button
          onClick={() => changeDemo("cards")}
          className={`px-4 py-2 rounded-md transition ${
            activeDemo === "cards" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Card Animations
        </button>
        <button
          onClick={() => changeDemo("motion")}
          className={`px-4 py-2 rounded-md transition ${
            activeDemo === "motion" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Motion Paths
        </button>
      </div>

      {/* Demo Content Areas */}
      <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-md">
        {/* Basic Animations */}
        {activeDemo === "basic" && (
          <div className="p-8 h-96 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex gap-8 items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="hero-box w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md shadow-lg"
                  style={{ transform: `rotate(${i * 15}deg)` }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Text Animations */}
        {activeDemo === "text" && (
          <div className="p-8 min-h-96 flex flex-col items-center justify-center space-y-12 bg-gradient-to-r from-gray-50 to-gray-100">
            <div ref={textRevealRef} className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                {Array.from("Text Animations").map((char, i) => (
                  <span key={i} className="text-char inline-block opacity-0">
                    {char}
                  </span>
                ))}
              </h2>
              <div className="h-0.5 w-0 bg-blue-500 mx-auto text-line"></div>
            </div>

            <div className="split-text text-center max-w-lg">
              {Array.from(
                "GSAP offers powerful text animation capabilities including character splitting, text reveal, and typewriter effects."
              ).map((char, i) => (
                <span key={i} className="inline-block mx-1">
                  <span>{char}</span>
                </span>
              ))}
            </div>

            <div className="typewriter-text text-xl font-mono text-blue-600"></div>
          </div>
        )}

        {/* Particles Animation */}
        {activeDemo === "particles" && (
          <div
            ref={particlesContainerRef}
            className="h-96 relative bg-gray-900 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            <p className="text-white text-lg z-10 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              Click anywhere for burst effect
            </p>
            {/* Particles will be created dynamically */}
          </div>
        )}

        {/* Card Animations */}
        {activeDemo === "cards" && (
          <div
            ref={cardContainerRef}
            className="p-8 min-h-96 bg-gradient-to-r from-gray-100 to-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Scale & Fade", color: "from-blue-400 to-blue-600" },
                {
                  title: "Rotation & Bounce",
                  color: "from-purple-400 to-purple-600",
                },
                {
                  title: "Morphing & Easing",
                  color: "from-red-400 to-red-600",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="card-item relative h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.color}`}
                  ></div>
                  <div className="card-overlay absolute inset-0 bg-black opacity-0"></div>
                  <div className="card-content absolute inset-0 flex items-center justify-center text-white transform translate-y-20 opacity-0">
                    <div className="text-center p-4">
                      <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                      <p>Hover for information</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motion Path Animation */}
        {activeDemo === "motion" && (
          <div
            ref={floatingElementsRef}
            className="h-96 relative bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden"
          >
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="floating-element absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: `${10 + Math.random() * 20}px`,
                  height: `${10 + Math.random() * 20}px`,
                  backgroundColor: [
                    "#FF5370",
                    "#FFCB6B",
                    "#C3E88D",
                    "#89DDFF",
                    "#82AAFF",
                  ][i % 5],
                  borderRadius: Math.random() > 0.5 ? "50%" : "4px",
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Implement</h2>
        <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm">
            {`// Installation
npm install gsap
${
  activeDemo === "text"
    ? "npm install gsap-trial // for premium plugins like TextPlugin"
    : ""
}

// Import and register plugins
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";${
              activeDemo === "text"
                ? '\nimport { TextPlugin } from "gsap/TextPlugin";'
                : ""
            }${
              activeDemo === "motion"
                ? '\nimport { MotionPathPlugin } from "gsap/MotionPathPlugin";'
                : ""
            }

gsap.registerPlugin(ScrollTrigger${
              activeDemo === "text" ? ", TextPlugin" : ""
            }${activeDemo === "motion" ? ", MotionPathPlugin" : ""});

// ${
              activeDemo === "basic"
                ? "Basic animation code"
                : activeDemo === "text"
                ? "Text animation code"
                : activeDemo === "particles"
                ? "Particle animation code"
                : activeDemo === "cards"
                ? "Card animation code"
                : "Motion path code"
            }
${
  activeDemo === "basic"
    ? `const tl = gsap.timeline();
tl.from(".element", {
  scale: 0,
  rotation: -45,
  opacity: 0,
  stagger: 0.2,
  duration: 0.8,
  ease: "elastic.out(1, 0.3)"
});`
    : activeDemo === "text"
    ? `// Character by character reveal
gsap.to(".text-char", {
  opacity: 1,
  stagger: 0.03,
  duration: 0.1
});

// Typewriter effect
gsap.to(".typewriter", {
  text: {
    value: "GSAP makes animations simple.",
    delimiter: ""
  },
  duration: 2,
  ease: "none"
});`
    : activeDemo === "particles"
    ? `// Animate particles
particles.forEach(particle => {
  gsap.to(particle, {
    x: \`random(-100, 100, 5)\`,
    y: \`random(-100, 100, 5)\`,
    rotation: \`random(-180, 180)\`,
    scale: \`random(0.5, 2, 0.1)\`,
    duration: \`random(2, 5)\`,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
});`
    : activeDemo === "cards"
    ? `// Card reveal animation
gsap.to(".card", {
  opacity: 1,
  y: 0,
  stagger: 0.1,
  duration: 0.8,
  ease: "back.out(1.7)"
});

// Hover effect
card.addEventListener('mouseenter', () => {
  gsap.to(overlay, {
    opacity: 0.9,
    duration: 0.3
  });
});`
    : `// Motion path animation
gsap.to(element, {
  motionPath: {
    path: "M0,0 C50,-50 -50,50 0,0",
    align: "self",
    autoRotate: true
  },
  duration: 5,
  repeat: -1,
  ease: "none"
});`
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
