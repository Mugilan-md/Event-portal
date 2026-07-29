
/**
 * Icon3D component
 * Wraps Lucide or SVG icons with high-resolution 3D multi-layered depth,
 * glossy lighting, glowing aura rings, and impressive 3D hover animations.
 */
export default function Icon3D({
  icon: IconComponent,
  children,
  size = "md", // sm, md, lg, xl
  color = "violet", // violet, cyan, gold, emerald, rose, blue, white
  className = "",
  style = {}
}) {
  const sizeMap = {
    sm: { container: "w-8 h-8 p-1.5", icon: "w-4 h-4" },
    md: { container: "w-11 h-11 p-2.5", icon: "w-5 h-5" },
    lg: { container: "w-14 h-14 p-3.5", icon: "w-7 h-7" },
    xl: { container: "w-18 h-18 p-4.5", icon: "w-9 h-9" }
  };

  const colorMap = {
    violet: {
      bg: "bg-gradient-to-br from-indigo-500/30 via-purple-600/20 to-violet-900/40",
      border: "border-indigo-400/40",
      glow: "shadow-[0_0_25px_rgba(99,102,241,0.5)]",
      text: "text-indigo-300",
      hoverRing: "group-hover:border-indigo-400"
    },
    cyan: {
      bg: "bg-gradient-to-br from-cyan-400/30 via-teal-500/20 to-blue-900/40",
      border: "border-cyan-400/40",
      glow: "shadow-[0_0_25px_rgba(6,182,212,0.5)]",
      text: "text-cyan-300",
      hoverRing: "group-hover:border-cyan-400"
    },
    gold: {
      bg: "bg-gradient-to-br from-amber-400/30 via-yellow-500/20 to-orange-900/40",
      border: "border-amber-400/40",
      glow: "shadow-[0_0_25px_rgba(245,158,11,0.5)]",
      text: "text-amber-300",
      hoverRing: "group-hover:border-amber-400"
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-400/30 via-teal-500/20 to-green-900/40",
      border: "border-emerald-400/40",
      glow: "shadow-[0_0_25px_rgba(16,185,129,0.5)]",
      text: "text-emerald-300",
      hoverRing: "group-hover:border-emerald-400"
    },
    rose: {
      bg: "bg-gradient-to-br from-rose-400/30 via-pink-500/20 to-rose-900/40",
      border: "border-rose-400/40",
      glow: "shadow-[0_0_25px_rgba(244,63,94,0.5)]",
      text: "text-rose-300",
      hoverRing: "group-hover:border-rose-400"
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-400/30 via-sky-500/20 to-blue-950/40",
      border: "border-blue-400/40",
      glow: "shadow-[0_0_25px_rgba(59,130,246,0.5)]",
      text: "text-blue-300",
      hoverRing: "group-hover:border-blue-400"
    },
    white: {
      bg: "bg-gradient-to-br from-white/30 via-slate-200/20 to-slate-800/40",
      border: "border-white/40",
      glow: "shadow-[0_0_25px_rgba(255,255,255,0.4)]",
      text: "text-white",
      hoverRing: "group-hover:border-white"
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const currentColor = colorMap[color] || colorMap.violet;

  return (
    <div
      className={`group relative inline-flex items-center justify-center ${className}`}
      style={style}
    >
      {/* Ambient 3D Glowing Backdrop Aura */}
      <div
        className={`absolute inset-0 rounded-2xl ${currentColor.glow} opacity-60 blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-125`}
      />

      {/* 3D Icon Container */}
      <div
        className={`relative ${currentSize.container} rounded-2xl ${currentColor.bg} backdrop-blur-md border ${currentColor.border} shadow-2xl flex items-center justify-center transition-all duration-300 ease-out transform preserve-3d group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]`}
      >
        {/* Top Gloss Reflection Specular Edge */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />

        {/* 3D Icon Element */}
        {IconComponent ? (
          <IconComponent
            className={`${currentSize.icon} ${currentColor.text} relative z-10 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
          />
        ) : (
          <span className={`${currentSize.icon} ${currentColor.text} relative z-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
            {children}
          </span>
        )}
      </div>
    </div>
  );
}
