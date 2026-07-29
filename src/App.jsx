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
import ManageQueries from "./pages/ManageQueries";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import VerifyTicket from "./pages/VerifyTicket";
import Background3D from "./components/ui/Background3D";


function Layout({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Dynamic 3D Canvas Background */}
      <Background3D />
      {/* Navbar has padding internally and handles floating alignment */}
      <Navbar />
      <main className="relative z-10 flex-grow">
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
          <Route
            path="/student-dashboard"
            element={
              <Layout>
                <StudentDashboard />
              </Layout>
            }
          />
          <Route
            path="/verify/:id"
            element={
              <Layout>
                <VerifyTicket />
              </Layout>
            }
          />

          {/* Hidden Admin Login Page */}
          <Route
            path="/admin"
            element={
              <div className="relative min-h-screen">
                <Background3D />
                <div className="relative z-10">
                  <AdminLogin />
                </div>
              </div>
            }
          />

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
          <Route
            path="/admin/manage-queries"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManageQueries />
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
