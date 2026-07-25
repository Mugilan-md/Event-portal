import React from "react";
import { Play, CheckCircle, Zap } from "lucide-react";

export default function CourseProgressCard({
  courseTitle = "Advanced UI/UX Design",
  modulesTotal = 12,
  modulesCompleted = 8,
  thumbnailUrl = "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400&h=250",
}) {
  const progressPercentage = Math.round((modulesCompleted / modulesTotal) * 100);
  const isCompleted = progressPercentage === 100;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 2px 4px rgba(9,13,22,0.04)"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(9,13,22,0.1), 0 0 0 1px rgba(99,102,241,0.08)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(9,13,22,0.04)";
        e.currentTarget.style.borderColor = "#E2E8F0";
      }}
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden shrink-0">
        <img
          src={thumbnailUrl}
          alt={courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Status badge */}
        {isCompleted ? (
          <div
            className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 text-white"
            style={{ background: "rgba(16,185,129,0.9)", backdropFilter: "blur(8px)" }}
          >
            <CheckCircle className="w-3 h-3" /> Completed
          </div>
        ) : (
          <div
            className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full text-white flex items-center gap-1"
            style={{ background: "rgba(6,182,212,0.9)", backdropFilter: "blur(8px)" }}
          >
            <Zap className="w-3 h-3" /> In Progress
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="text-base font-bold mb-2 line-clamp-1 transition-colors duration-200"
          style={{ color: "#0F172A" }}
        >
          {courseTitle}
        </h3>

        <div className="flex justify-between items-center text-sm mb-3" style={{ color: "#64748B" }}>
          <span>{modulesCompleted} / {modulesTotal} Modules</span>
          <span className="font-semibold" style={{ color: "#0F172A" }}>{progressPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full rounded-full h-2 mb-5 overflow-hidden" style={{ background: "#F1F5F9" }}>
          <div
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${progressPercentage}%`,
              background: isCompleted
                ? "linear-gradient(90deg, #10B981, #059669)"
                : "linear-gradient(90deg, #6366F1, #06B6D4)"
            }}
          />
        </div>

        {/* Action button */}
        <div className="mt-auto pt-1">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250"
            style={
              isCompleted
                ? { background: "#F8FAFC", color: "#0F172A", border: "1px solid #E2E8F0" }
                : { background: "#6366F1", color: "white", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }
            }
            onMouseEnter={e => {
              if (isCompleted) {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                e.currentTarget.style.color = "#6366F1";
              } else {
                e.currentTarget.style.background = "#4F46E5";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(99,102,241,0.35)";
              }
            }}
            onMouseLeave={e => {
              if (isCompleted) {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.color = "#0F172A";
              } else {
                e.currentTarget.style.background = "#6366F1";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.25)";
              }
            }}
          >
            {isCompleted ? "Review Course" : "Continue Learning"}
            {!isCompleted && <Play className="w-4 h-4 fill-current" />}
          </button>
        </div>
      </div>
    </div>
  );
}
