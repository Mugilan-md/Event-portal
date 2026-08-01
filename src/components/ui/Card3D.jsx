
/**
 * Card3D wrapper component
 * Provides high-performance 3D perspective depth & hover animations without blur or wobbling.
 */
export default function Card3D({
  children,
  className = "",
  style = {},
  ...props
}) {
  return (
    <div
      className={`group relative transition-all duration-300 ease-out transform preserve-3d hover:-translate-y-2 hover:scale-[1.015] ${className}`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style
      }}
      {...props}
    >
      <div className="w-full h-full relative z-10">
        {children}
      </div>
    </div>
  );
}
