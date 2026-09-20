import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

/* ── Particle Canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animFrame: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 166, 35, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(245, 166, 35, ${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animFrame = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  useEffect(() => {
    const cleanup = animate();
    const handleResize = () => animate();
    window.addEventListener("resize", handleResize);
    return () => {
      cleanup?.();
      window.removeEventListener("resize", handleResize);
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

/* ── SVG Swoosh Underline ── */
function SwooshUnderline() {
  return (
    <svg
      viewBox="0 0 300 12"
      className="w-72 sm:w-80 md:w-96 max-w-full h-3 mt-1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8"
        stroke="#F5A623"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ── Hero Component ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-bg"
    >
      {/* Background effects */}
      <div className="hero-glow" />
      <ParticleCanvas />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-32">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Text column */}
          <motion.div
            className="lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 border border-accent/30 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-accent bg-accent/5">
                Maran Media / Freelance Video Editor
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
            >
              <span className="text-white">Your Content —</span>
              <br />
              <span className="text-accent">Deserves Better Visuals.</span>
              <SwooshUnderline />
              <br />
              <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold opacity-80 block mt-3">
                Short &amp; Long form edits,
                <br />
                Motion Graphics
                <br />
                &amp; Visual Storytelling.
              </span>
            </motion.h1>

            {/* Intro */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base md:text-lg text-text-secondary max-w-xl leading-relaxed"
            >
              Hi, I'm{" "}
              <span className="text-white font-semibold">Yoga Maran</span>, a
              freelance video editor specializing in short &amp; Long form
              content, cinematic edits, motion graphics, and visual
              storytelling. I turn raw footage into engaging content that
              captures attention and keeps audiences watching without
              scrolling.
            </motion.p>

            {/* CTA */}
            <motion.div variants={itemVariants} className="mt-8">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent-hover text-bg font-bold text-base rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,166,35,0.4)] hover:scale-105"
              >
                <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                Book A Slot
              </a>
            </motion.div>
          </motion.div>

          {/* Portrait column */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative mx-auto w-72 sm:w-80 md:w-96 lg:w-full max-w-md">
              {/* Glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-transparent to-accent/10 rounded-3xl blur-2xl" />
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden duotone border border-white/5">
                <img
                  src={`${import.meta.env.BASE_URL}hero-portrait.jpg`}
                  alt="Yoga Maran — Freelance Video Editor | Maran Media"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-white">
                  Available for freelance projects
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
