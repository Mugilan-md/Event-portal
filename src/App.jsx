import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Registration from "./pages/Registration";
import Success from "./pages/Success";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageEvents from "./pages/ManageEvents";
import ManageRegistrations from "./pages/ManageRegistrations";
import NotFound from "./pages/NotFound";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#030014]">
      {/* Navbar has padding internally and handles floating alignment */}
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Pages with Default Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/events"
            element={
              <Layout>
                <Events />
              </Layout>
            }
          />
          <Route
            path="/event/:id"
            element={
              <Layout>
                <EventDetails />
              </Layout>
            }
          />
          <Route
            path="/register/:id"
            element={
              <Layout>
                <Registration />
              </Layout>
            }
          />
          <Route
            path="/success"
            element={
              <Layout>
                <Success />
              </Layout>
            }
          />

          {/* Hidden Admin Login Page (No Public Layout to prevent leak of links) */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Routes with Custom Layout */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-events"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManageEvents />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-registrations"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManageRegistrations />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 Error Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
