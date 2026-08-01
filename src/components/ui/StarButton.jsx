import { Link } from "react-router-dom";

const Star = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 784.11 815.53"
    className="w-full h-auto"
    style={{ fill: color }}
  >
    <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
  </svg>
);

export default function StarButton({
  children,
  onClick,
  to,
  variant = "violet",
  className = "",
  type = "button",
  disabled = false
}) {
  // Premium SaaS color themes
  const themes = {
    violet: {
      bg: "bg-[#6366F1] border-[#6366F1] text-white",
      hover: "hover:text-[#6366F1] hover:shadow-[0_8px_25px_rgba(99,102,241,0.45)]",
      starColor: "#818CF8"
    },
    cyan: {
      bg: "bg-[#06B6D4] border-[#06B6D4] text-white",
      hover: "hover:text-[#06B6D4] hover:shadow-[0_8px_25px_rgba(6,182,212,0.45)]",
      starColor: "#22D3EE"
    },
    gold: {
      bg: "bg-[#F59E0B] border-[#F59E0B] text-[#0F172A]",
      hover: "hover:text-[#F59E0B] hover:shadow-[0_8px_25px_rgba(245,158,11,0.45)]",
      starColor: "#FCD34D"
    },
    sky: {
      // Legacy alias → Royal Violet
      bg: "bg-[#6366F1] border-[#6366F1] text-white",
      hover: "hover:text-[#6366F1] hover:shadow-[0_8px_25px_rgba(99,102,241,0.45)]",
      starColor: "#818CF8"
    },
    royal: {
      bg: "bg-[#4F46E5] border-[#4F46E5] text-white",
      hover: "hover:text-[#4F46E5] hover:shadow-[0_8px_25px_rgba(79,70,229,0.45)]",
      starColor: "#6366F1"
    },
    dark: {
      bg: "bg-[#090D16] border-white/20 text-white",
      hover: "hover:text-white hover:shadow-[0_8px_25px_rgba(9,13,22,0.5)] hover:border-[#6366F1]/50",
      starColor: "#6366F1"
    },
    rose: {
      bg: "bg-rose-600 border-rose-600 text-white",
      hover: "hover:text-rose-600 hover:shadow-[0_8px_25px_rgba(225,29,72,0.45)]",
      starColor: "#FDA4AF"
    },
    emerald: {
      bg: "bg-emerald-600 border-emerald-600 text-white",
      hover: "hover:text-emerald-500 hover:shadow-[0_8px_25px_rgba(16,185,129,0.45)]",
      starColor: "#6EE7B7"
    }
  };

  const theme = themes[variant] || themes.violet;

  const content = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

      {/* Animated stars on hover */}
      <div className="absolute top-[20%] left-[20%] w-[18px] z-[-5] transition-all duration-[900ms] ease-[cubic-bezier(0.05,0.83,0.43,0.96)] group-hover:top-[-80%] group-hover:left-[-35%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>
      <div className="absolute top-[45%] left-[45%] w-[12px] z-[-5] transition-all duration-[900ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[-45%] group-hover:left-[10%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>
      <div className="absolute top-[40%] left-[40%] w-[6px] z-[-5] transition-all duration-[900ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[65%] group-hover:left-[15%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>
      <div className="absolute top-[20%] left-[40%] w-[8px] z-[-5] transition-all duration-[700ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[15%] group-hover:left-[90%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>
      <div className="absolute top-[25%] left-[45%] w-[12px] z-[-5] transition-all duration-[550ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[15%] group-hover:left-[110%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>
      <div className="absolute top-[5%] left-[50%] w-[6px] z-[-5] transition-all duration-[750ms] ease-in-out group-hover:top-[-15%] group-hover:left-[65%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>
    </>
  );

  const baseClass = `
    group relative px-6 py-2.5
    text-sm font-semibold tracking-wide
    border-2 rounded-xl
    shadow-[0_1px_2px_rgba(0,0,0,0.08)]
    transition-all duration-[250ms] ease-in-out
    cursor-pointer
    active:scale-95
    hover:bg-transparent
    hover:-translate-y-[2px]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${theme.bg} ${theme.hover} ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClass} disabled={disabled}>
      {content}
    </button>
  );
}
