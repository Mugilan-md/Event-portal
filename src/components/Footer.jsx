import { Link, useLocation } from "react-router-dom";
import { Mail, Phone, MapPin, Zap } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function Footer() {
  const location = useLocation();
  const isAdminPage = location.pathname.includes("admin");

  return (
    <footer
      className="relative pt-16 pb-8 overflow-hidden transition-colors duration-300"
      style={{
        background: isAdminPage ? "#FFDBBB" : "#F8FAFC",
        borderTop: isAdminPage ? "none" : "1px solid #E2E8F0"
      }}
    >
      {/* Decorative orbs */}
      {!isAdminPage && (
        <>
          <div
            className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(99,102,241,0.04)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(6,182,212,0.04)" }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 shrink-0 transition-all duration-300 group-hover:scale-105 flex items-center justify-center bg-transparent">
                <img
                  src={logoImg}
                  alt="Logo"
                  className="w-full h-full object-contain p-0 m-0"
                />
              </div>
              <span
                className="font-black text-xl tracking-tight font-syne"
                style={{ color: isAdminPage ? "#3D2918" : "#0F172A" }}
              >
                VSB{" "}
                <span style={{ color: isAdminPage ? "#664930" : "#F59E0B" }}>Portal</span>
              </span>
            </Link>

            <p
              className="text-sm leading-relaxed font-bold"
              style={{ color: isAdminPage ? "#3D2918" : "#64748B" }}
            >
              Empowering technical communities, hackathons, and collegiate symposiums with a seamless registration and event coordination ecosystem.
            </p>

            {/* AI badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-sm"
              style={{
                background: isAdminPage ? "#664930" : "rgba(6,182,212,0.08)",
                border: isAdminPage ? "1px solid #3D2918" : "1px solid rgba(6,182,212,0.2)",
                color: isAdminPage ? "#FFDBBB" : "#06B6D4"
              }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: isAdminPage ? "#FFDBBB" : "#06B6D4" }} />
              AI-Powered Platform
            </div>

            {/* Socials */}
            <div className="flex gap-3 pt-1">
              {[
                { label: "Twitter X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "Github", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
                { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" }
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md"
                  style={{
                    background: isAdminPage ? "#664930" : "rgba(99,102,241,0.06)",
                    border: isAdminPage ? "1px solid #3D2918" : "1px solid rgba(99,102,241,0.12)",
                    color: isAdminPage ? "#FFDBBB" : "#64748B"
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3
              className="font-black mb-4 text-xs tracking-widest uppercase"
              style={{ color: isAdminPage ? "#3D2918" : "#6366F1" }}
            >
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Upcoming Events", to: "/events" }
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm font-bold transition-all duration-200 hover:translate-x-1 inline-block"
                    style={{ color: isAdminPage ? "#3D2918" : "#64748B" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h3
              className="font-black mb-4 text-xs tracking-widest uppercase"
              style={{ color: isAdminPage ? "#3D2918" : "#6366F1" }}
            >
              Categories
            </h3>
            <ul className="space-y-2.5">
              {["Hackathons", "Technical Symposiums", "Coding Workshops", "Panel Discussions"].map((cat) => (
                <li
                  key={cat}
                  className="text-sm font-bold cursor-pointer transition-all duration-200 hover:translate-x-1"
                  style={{ color: isAdminPage ? "#3D2918" : "#64748B" }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h3
              className="font-black mb-4 text-xs tracking-widest uppercase"
              style={{ color: isAdminPage ? "#3D2918" : "#6366F1" }}
            >
              Support & Contact
            </h3>
            <div className="space-y-2 text-sm font-bold" style={{ color: isAdminPage ? "#3D2918" : "#64748B" }}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#664930]" />
                <span>info@eventregistrationportal.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#664930]" />
                <span>+1 (555) 100-2938</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#664930] shrink-0 mt-0.5" />
                <span>100 Innovation Avenue, Cyber City, CA 94016</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold"
          style={{
            borderTop: isAdminPage ? "1px solid rgba(102,73,48,0.2)" : "1px solid #E2E8F0",
            color: isAdminPage ? "#3D2918" : "#94A3B8"
          }}
        >
          <p>© 2026 Event Registration Portal. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
