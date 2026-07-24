import React from "react";
import { BookOpen, Trophy, Flame } from "lucide-react";

export default function StudentDashboardHeader({ studentName = "Student" }) {
  return (
    <div className="bg-surface-card rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-primary/30">
            {studentName.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Lvl 5
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Welcome back, {studentName}! 👋
          </h1>
          <p className="text-text-muted text-sm">
            Ready to conquer your goals today? You're on a 3-day streak!
          </p>
        </div>
      </div>
      
      <div className="flex gap-4 w-full md:w-auto justify-start md:justify-end">
        <div className="flex items-center gap-2 bg-brand-background px-4 py-2 rounded-xl border border-gray-100">
          <Flame className="w-5 h-5 text-brand-accent" />
          <div>
            <div className="text-xs text-text-muted font-medium">Streak</div>
            <div className="text-sm font-bold text-text-primary">3 Days</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-brand-background px-4 py-2 rounded-xl border border-gray-100">
          <Trophy className="w-5 h-5 text-brand-secondary" />
          <div>
            <div className="text-xs text-text-muted font-medium">Points</div>
            <div className="text-sm font-bold text-text-primary">1,250</div>
          </div>
        </div>
      </div>
    </div>
  );
}
