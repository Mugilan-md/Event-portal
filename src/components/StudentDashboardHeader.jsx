import { Trophy, Flame, TrendingUp } from "lucide-react";

export default function StudentDashboardHeader({ studentName = "Student" }) {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 6px -1px rgba(9,13,22,0.05)"
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(9,13,22,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(9,13,22,0.05)"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
    >
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="relative">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)", boxShadow: "0 8px 20px rgba(99,102,241,0.3)" }}
          >
            {studentName.charAt(0)}
          </div>
          {/* Level badge */}
          <div
            className="absolute -bottom-1 -right-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#F59E0B", boxShadow: "0 2px 6px rgba(245,158,11,0.4)" }}
          >
            Lvl 5
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-1 font-serif" style={{ color: "#0F172A" }}>
            Welcome back, {studentName}! 👋
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Ready to conquer your goals today? You're on a{" "}
            <span className="font-semibold" style={{ color: "#F59E0B" }}>3-day streak</span>!
          </p>
        </div>
      </div>

      <div className="flex gap-3 w-full md:w-auto justify-start md:justify-end">
        {/* Streak stat */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-200"
          style={{ background: "#FAFAFC", border: "1px solid #E2E8F0" }}
        >
          <Flame className="w-5 h-5" style={{ color: "#F59E0B" }} />
          <div>
            <div className="text-xs font-medium" style={{ color: "#94A3B8" }}>Streak</div>
            <div className="text-sm font-bold" style={{ color: "#0F172A" }}>3 Days</div>
          </div>
        </div>

        {/* Points stat */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-200"
          style={{ background: "#FAFAFC", border: "1px solid #E2E8F0" }}
        >
          <Trophy className="w-5 h-5" style={{ color: "#6366F1" }} />
          <div>
            <div className="text-xs font-medium" style={{ color: "#94A3B8" }}>Points</div>
            <div className="text-sm font-bold" style={{ color: "#0F172A" }}>1,250</div>
          </div>
        </div>

        {/* Progress stat — Electric Cyan (AI/progress indicator) */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-200"
          style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)" }}
        >
          <TrendingUp className="w-5 h-5" style={{ color: "#06B6D4" }} />
          <div>
            <div className="text-xs font-medium" style={{ color: "#94A3B8" }}>Progress</div>
            <div className="text-sm font-bold" style={{ color: "#0F172A" }}>68%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
