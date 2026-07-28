import React, { useRef, useState } from "react";

/**
 * Card3D wrapper component
 * Provides high-end 3D tilt interaction with dynamic specular glare highlight.
 */
export default function Card3D({
  children,
  className = "",
  depth = 20,
  maxTilt = 12,
  glare = true,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Calculate 3D tilt angles
    const rx = -mouseY * maxTilt * 2;
    const ry = mouseX * maxTilt * 2;

    setRotateX(rx);
    setRotateY(ry);

    if (glare) {
      const glareX = ((e.clientX - rect.left) / width) * 100;
      const glareY = ((e.clientY - rect.top) / height) * 100;
      setGlarePos({ x: glareX, y: glareY, opacity: 0.35 });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out preserve-3d ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        ...style
      }}
      {...props}
    >
      {/* Card Content Layer */}
      <div
        className="w-full h-full preserve-3d transition-all duration-300"
        style={{
          transform: isHovered ? `translateZ(${depth}px)` : "translateZ(0px)"
        }}
      >
        {children}
      </div>

      {/* Dynamic 3D Glare / Specular Highlight Overlay */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 45%, transparent 80%)`,
            mixBlendMode: "overlay"
          }}
        />
      )}
    </div>
  );
}
