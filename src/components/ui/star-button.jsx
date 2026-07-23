import React from "react";
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
  variant = "sky", 
  className = "", 
  type = "button",
  disabled = false
}) {
  // Theme color maps matching VSB Event Portal
  const themes = {
    gold: {
      bg: "bg-[#FFD700] border-[#FFD700] text-[#181818]",
      hover: "hover:text-[#FFD700] hover:shadow-[0_0_25px_rgba(255,215,0,0.55)]",
      starColor: "#FFD700"
    },
    sky: {
      bg: "bg-sky-500 border-sky-500 text-white",
      hover: "hover:text-sky-500 hover:shadow-[0_0_25px_rgba(14,165,233,0.55)]",
      starColor: "#0ea5e9"
    },
    royal: {
      bg: "bg-[#1F3C88] border-[#1F3C88] text-white",
      hover: "hover:text-[#1F3C88] hover:shadow-[0_0_25px_rgba(31,60,136,0.55)]",
      starColor: "#1F3C88"
    }
  };

  const theme = themes[variant] || themes.sky;

  const content = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

      {/* Star 1 */}
      <div className="absolute top-[20%] left-[20%] w-[18px] z-[-5] transition-all duration-[1000ms] ease-[cubic-bezier(0.05,0.83,0.43,0.96)] group-hover:top-[-80%] group-hover:left-[-35%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>

      {/* Star 2 */}
      <div className="absolute top-[45%] left-[45%] w-[12px] z-[-5] transition-all duration-[1000ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[-45%] group-hover:left-[10%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>

      {/* Star 3 */}
      <div className="absolute top-[40%] left-[40%] w-[6px] z-[-5] transition-all duration-[1000ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[65%] group-hover:left-[15%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>

      {/* Star 4 */}
      <div className="absolute top-[20%] left-[40%] w-[8px] z-[-5] transition-all duration-[800ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[15%] group-hover:left-[90%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>

      {/* Star 5 */}
      <div className="absolute top-[25%] left-[45%] w-[12px] z-[-5] transition-all duration-[600ms] ease-[cubic-bezier(0,0.4,0,1.01)] group-hover:top-[15%] group-hover:left-[110%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>

      {/* Star 6 */}
      <div className="absolute top-[5%] left-[50%] w-[6px] z-[-5] transition-all duration-[800ms] ease-in-out group-hover:top-[-15%] group-hover:left-[65%] group-hover:z-20">
        <Star color={theme.starColor} />
      </div>
    </>
  );

  const baseClass = `
    group relative px-6 py-2.5 
    text-sm font-bold uppercase tracking-wider 
    border-2 rounded-xl 
    shadow-[0_0_0_transparent] 
    transition-all duration-300 ease-in-out 
    cursor-pointer
    active:scale-95
    hover:bg-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
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
