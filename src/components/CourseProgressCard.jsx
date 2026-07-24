import React from "react";
import { Play, CheckCircle } from "lucide-react";

export default function CourseProgressCard({
  courseTitle = "Advanced UI/UX Design",
  modulesTotal = 12,
  modulesCompleted = 8,
  thumbnailUrl = "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400&h=250",
}) {
  const progressPercentage = Math.round((modulesCompleted / modulesTotal) * 100);
  const isCompleted = progressPercentage === 100;

  return (
    <div className="bg-surface-card rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {isCompleted ? (
          <div className="absolute top-3 right-3 bg-brand-success text-white px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
            <CheckCircle className="w-3 h-3" /> Completed
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-brand-primary text-white px-3 py-1 text-xs font-bold rounded-full shadow-sm">
            In Progress
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
          {courseTitle}
        </h3>
        
        <div className="flex justify-between items-center text-sm text-text-muted mb-3">
          <span>{modulesCompleted} / {modulesTotal} Modules</span>
          <span className="font-semibold text-text-primary">{progressPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-brand-background rounded-full h-2.5 mb-5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
              isCompleted ? "bg-brand-success" : "bg-brand-primary"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <button
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              isCompleted
                ? "bg-brand-background text-text-primary hover:bg-gray-100 border border-gray-200"
                : "bg-brand-primary text-white hover:bg-brand-secondary shadow-md hover:shadow-lg hover:shadow-brand-secondary/30"
            }`}
          >
            {isCompleted ? "Review Course" : "Continue Learning"}
            {!isCompleted && <Play className="w-4 h-4 fill-current" />}
          </button>
        </div>
      </div>
    </div>
  );
}
