import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "../firebase/config";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center gap-4">
        {/* Futuristic Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500 animate-spin [animation-direction:reverse]" />
        </div>
        <p className="text-purple-300 text-sm font-semibold tracking-wider animate-pulse">
          SECURING CONNECTION...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
