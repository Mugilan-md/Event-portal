import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Zap } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function Footer() {
  return (
    <footer
      className="relative pt-16 pb-8 overflow-hidden"
      style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(99,102,241,0.04)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(6,182,212,0.04)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div
                className="w-12 h-12 rounded-xl overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-105 flex items-center justify-center"
                style={{ background: "#090D16", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 0 12px rgba(9,13,22,0.1)" }}
              >
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain" style={{ mixBlendMode: "screen" }} />
              </div>
              <span className="font-extrabold text-lg tracking-tight font-serif" style={{ color: "#0F172A" }}>
                VSB{" "}
                <span style={{ color: "#F59E0B" }}>Portal</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
              Empowering technical communities, hackathons, and collegiate symposiums with a seamless registration and event coordination ecosystem.
            </p>

            {/* AI badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.2)",
                color: "#06B6D4"
              }}
            >
              <Zap className="w-3 h-3" />
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-250"
                  style={{
                    background: "rgba(99,102,241,0.06)",
                    border: "1px solid rgba(99,102,241,0.12)",
                    color: "#64748B"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.14)";
                    e.currentTarget.style.color = "#6366F1";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.06)";
                    e.currentTarget.style.color = "#64748B";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.12)";
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
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
              className="font-bold mb-4 text-xs tracking-widest uppercase"
              style={{ color: "#6366F1" }}
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
                    className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                    style={{ color: "#64748B" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#6366F1"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#64748B"; }}
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
              className="font-bold mb-4 text-xs tracking-widest uppercase"
              style={{ color: "#6366F1" }}
            >
              Categories
            </h3>
            <ul className="space-y-2.5">
              {["Hackathons", "Technical Symposiums", "Coding Workshops", "Panel Discussions"].map((cat) => (
                <li
                  key={cat}
                  className="text-sm cursor-pointer transition-all duration-200 hover:translate-x-1"
                  style={{ color: "#64748B" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#6366F1"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#64748B"; }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3">
            <h3
              className="font-bold mb-4 text-xs tracking-widest uppercase"
              style={{ color: "#6366F1" }}
            >
              Support & Contact
            </h3>
            {[
              { Icon: Mail, text: "info@eventregistrationportal.com" },
              { Icon: Phone, text: "+1 (555) 100-2938" },
              { Icon: MapPin, text: "100 Innovation Avenue, Cyber City, CA 94016" }
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5 text-sm" style={{ color: "#64748B" }}>
                <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4"
          style={{ borderTop: "1px solid #E2E8F0", color: "#94A3B8" }}
        >
          <p>© 2026 Event Registration Portal. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors duration-200"
                onMouseEnter={e => { e.currentTarget.style.color = "#6366F1"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#94A3B8"; }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
