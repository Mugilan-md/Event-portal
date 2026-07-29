import React from "react";

/**
 * Card3D wrapper component
 * Provides clean card container without cursor tilt effects.
 */
export default function Card3D({
  children,
  className = "",
  style = {},
  ...props
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        ...style
      }}
      {...props}
    >
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
