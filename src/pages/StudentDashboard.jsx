import React from "react";
import StudentDashboardHeader from "../components/StudentDashboardHeader";
import CourseProgressCard from "../components/CourseProgressCard";

export default function StudentDashboard() {
  const courses = [
    {
      id: 1,
      title: "Advanced UI/UX Design Masterclass",
      modulesTotal: 12,
      modulesCompleted: 8,
      thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400&h=250",
    },
    {
      id: 2,
      title: "Frontend Engineering with React",
      modulesTotal: 20,
      modulesCompleted: 5,
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400&h=250",
    },
    {
      id: 3,
      title: "Color Theory & Typography",
      modulesTotal: 8,
      modulesCompleted: 8,
      thumbnailUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400&h=250",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-background text-text-primary p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8 mt-24">
        {/* Header Section */}
        <StudentDashboardHeader studentName="Alex" />

        {/* Courses Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Your Courses</h2>
              <p className="text-text-muted mt-1 text-sm">Pick up where you left off</p>
            </div>
            <button className="text-brand-primary text-sm font-semibold hover:text-brand-secondary transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseProgressCard
                key={course.id}
                courseTitle={course.title}
                modulesTotal={course.modulesTotal}
                modulesCompleted={course.modulesCompleted}
                thumbnailUrl={course.thumbnailUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
