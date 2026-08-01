import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Color Palettes from user reference:
// 1. Sapphire Nightfall Whisper: Deep ocean blue, electric cyan, nightfall sapphire
// 2. Moon Dust: Ethereal periwinkle, lavender, ice blue
// 3. Neutral Elegance: #FFDBBB, #CCBEB1, #997E67, #664930
const PALETTES = {
  sapphire: {
    name: "Sapphire Nightfall",
    bg: "#060D1A",
    orbs: ["rgba(4, 116, 196, 0.45)", "rgba(83, 121, 174, 0.4)", "rgba(168, 196, 236, 0.35)", "rgba(6, 69, 127, 0.5)"],
    poly: "rgba(168, 196, 236, 0.4)",
    glow: "#0474C4"
  },
  moondust: {
    name: "Moon Dust Ethereal",
    bg: "#0C0B18",
    orbs: ["rgba(211, 211, 255, 0.4)", "rgba(206, 181, 255, 0.45)", "rgba(142, 193, 222, 0.35)", "rgba(128, 168, 255, 0.4)"],
    poly: "rgba(206, 181, 255, 0.45)",
    glow: "#80A8FF"
  },
  neutral: {
    name: "Neutral Elegance",
    bg: "#FFDBBB",
    orbs: ["rgba(204, 190, 177, 0.5)", "rgba(153, 126, 103, 0.4)", "rgba(102, 73, 48, 0.35)", "rgba(255, 255, 255, 0.6)"],
    poly: "rgba(102, 73, 48, 0.35)",
    glow: "#664930"
  }
};

export default function Background3D() {
  const canvasRef = useRef(null);
  const location = useLocation();
  const [currentPalette, setCurrentPalette] = useState(
    location.pathname.includes("admin") ? "neutral" : "sapphire"
  );

  useEffect(() => {
    if (location.pathname.includes("admin")) {
      setCurrentPalette("neutral");
    }
  }, [location.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId;

    // Detect mobile device or small screen for aggressive performance tuning
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    // Cap DPR on mobile to 1.0 (or max 1.5 on desktop) to prevent heavy pixel rasterization overhead
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;
    let width = (canvas.width = Math.floor(displayWidth * dpr));
    let height = (canvas.height = Math.floor(displayHeight * dpr));

    const handleResize = () => {
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      width = canvas.width = Math.floor(displayWidth * dpr);
      height = canvas.height = Math.floor(displayHeight * dpr);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2
    };

    // Only attach mousemove on non-mobile devices to save CPU cycles
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX * dpr;
      mouse.targetY = e.clientY * dpr;
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    // 3D Floating Polyhedron Class
    class Polyhedron3D {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
        this.z = Math.random() * 800 + 200;
        this.size = (Math.random() * 35 + 18) * dpr;

        this.rx = Math.random() * Math.PI * 2;
        this.ry = Math.random() * Math.PI * 2;
        this.rz = Math.random() * Math.PI * 2;

        this.drx = (Math.random() - 0.5) * (isMobile ? 0.008 : 0.015);
        this.dry = (Math.random() - 0.5) * (isMobile ? 0.008 : 0.015);
        this.drz = (Math.random() - 0.5) * (isMobile ? 0.006 : 0.01);

        this.vx = (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4);
        this.vy = (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4);
        this.vz = (Math.random() - 0.5) * 0.3;

        this.type = Math.floor(Math.random() * 3);
        this.vertices = this.generateVertices();
        this.edges = this.generateEdges();
      }

      generateVertices() {
        const s = this.size;
        if (this.type === 1) {
          return [
            [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
            [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
          ];
        } else if (this.type === 2) {
          return [
            [0, -s * 1.2, 0],
            [-s, s, -s], [s, s, -s], [s, s, s], [-s, s, s]
          ];
        } else {
          return [
            [0, -s * 1.3, 0], [0, s * 1.3, 0],
            [-s, 0, -s], [s, 0, -s], [s, 0, s], [-s, 0, s]
          ];
        }
      }

      generateEdges() {
        if (this.type === 1) {
          return [
            [0,1],[1,2],[2,3],[3,0],
            [4,5],[5,6],[6,7],[7,4],
            [0,4],[1,5],[2,6],[3,7]
          ];
        } else if (this.type === 2) {
          return [
            [0,1],[0,2],[0,3],[0,4],
            [1,2],[2,3],[3,4],[4,1]
          ];
        } else {
          return [
            [0,2],[0,3],[0,4],[0,5],
            [1,2],[1,3],[1,4],[1,5],
            [2,3],[3,4],[4,5],[5,2]
          ];
        }
      }

      update(parallaxX, parallaxY) {
        this.rx += this.drx;
        this.ry += this.dry;
        this.rz += this.drz;

        this.x += this.vx + parallaxX * 0.05;
        this.y += this.vy + parallaxY * 0.05;
        this.z += this.vz;

        if (this.z < 50 || this.z > 1200) this.reset();
        if (Math.abs(this.x) > width) this.reset();
        if (Math.abs(this.y) > height) this.reset();
      }

      draw(ctx, fov, strokeStyle) {
        const projected = [];
        const cosX = Math.cos(this.rx), sinX = Math.sin(this.rx);
        const cosY = Math.cos(this.ry), sinY = Math.sin(this.ry);
        const cosZ = Math.cos(this.rz), sinZ = Math.sin(this.rz);

        for (let i = 0; i < this.vertices.length; i++) {
          const v = this.vertices[i];
          let y1 = v[1] * cosX - v[2] * sinX;
          let z1 = v[1] * sinX + v[2] * cosX;
          let x1 = v[0];

          let x2 = x1 * cosY + z1 * sinY;
          let z2 = -x1 * sinY + z1 * cosY;
          let y2 = y1;

          let x3 = x2 * cosZ - y2 * sinZ;
          let y3 = x2 * sinZ + y2 * cosZ;
          let z3 = z2 + this.z;

          const scale = fov / (fov + z3);
          const px = (x3 + this.x) * scale + width / 2;
          const py = (y3 + this.y) * scale + height / 2;

          projected.push({ x: px, y: py, scale });
        }

        ctx.beginPath();
        for (let i = 0; i < this.edges.length; i++) {
          const edge = this.edges[i];
          const p1 = projected[edge[0]];
          const p2 = projected[edge[1]];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = Math.max(0.6 * dpr, 1.8 * projected[0].scale * dpr);

        // CRITICAL PERFORMANCE FIX: Disable heavy canvas shadowBlur on mobile!
        if (!isMobile) {
          ctx.shadowColor = strokeStyle;
          ctx.shadowBlur = 6 * projected[0].scale * dpr;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
      }
    }

    // Adaptive object counts for high FPS performance
    const numPoly = isMobile ? 7 : 18;
    const polyhedra = Array.from({ length: numPoly }, () => new Polyhedron3D());

    const numOrbs = isMobile ? 2 : 4;
    const allOrbs = [
      { x: width * 0.2, y: height * 0.25, r: 350 * dpr, vx: 0.2, vy: 0.15 },
      { x: width * 0.8, y: height * 0.35, r: 400 * dpr, vx: -0.15, vy: 0.25 },
      { x: width * 0.5, y: height * 0.75, r: 360 * dpr, vx: 0.25, vy: -0.2 },
      { x: width * 0.15, y: height * 0.85, r: 280 * dpr, vx: -0.2, vy: -0.15 }
    ];
    const orbs = allOrbs.slice(0, numOrbs);

    const fov = 400 * dpr;
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isTabVisible) return;

      if (!isMobile) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
      }
      const parallaxX = (mouse.x - width / 2) / (width / 2);
      const parallaxY = (mouse.y - height / 2) / (height / 2);

      const active = PALETTES[currentPalette] || PALETTES.sapphire;

      // Draw background fill
      ctx.fillStyle = active.bg;
      ctx.fillRect(0, 0, width, height);

      // Render glowing dynamic color orbs
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        orb.x += orb.vx + parallaxX * 0.1;
        orb.y += orb.vy + parallaxY * 0.1;

        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const orbColor = active.orbs[i % active.orbs.length];
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, orbColor);
        grad.addColorStop(0.6, orbColor.replace(/0\.\d+\)/, "0.12)"));
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render 3D Polyhedra
      for (let i = 0; i < polyhedra.length; i++) {
        const p = polyhedra[i];
        p.update(parallaxX, parallaxY);
        p.draw(ctx, fov, active.poly);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (!isMobile) window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentPalette]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Floating Theme Palette Switcher Widget */}
      <div className="fixed bottom-5 right-5 pointer-events-auto z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:scale-105">
        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-2.5">
          3D Palette
        </span>
        {Object.keys(PALETTES).map(key => {
          const pal = PALETTES[key];
          const isSelected = currentPalette === key;
          return (
            <button
              key={key}
              onClick={() => setCurrentPalette(key)}
              title={pal.name}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-white/20 text-white shadow-lg border border-white/30"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                style={{ backgroundColor: pal.glow }}
              />
              <span className="hidden sm:inline">{pal.name.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
