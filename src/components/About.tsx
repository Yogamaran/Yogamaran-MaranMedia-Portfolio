import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";
import { Film, Users, Clock } from "lucide-react";

interface StatItem {
  label: string;
  target: number;
  decimals?: number;
  suffix: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const stats: StatItem[] = [
  { label: "Projects Completed", target: 50, suffix: "+", icon: Film },
  { label: "Happy Clients", target: 10, suffix: "+", icon: Users },
  { label: "Years Experience", target: 1.5, decimals: 1, suffix: "+", icon: Clock },
];

function StatCard({
  label,
  target,
  decimals = 0,
  suffix,
  icon: Icon,
  index,
}: StatItem & { index: number }) {
  const [ref, count] = useCountUp(target, 2000, decimals);

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="relative group"
    >
      <div className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-accent/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,166,35,0.05)]">
        <Icon
          size={24}
          className="text-accent mb-4 group-hover:scale-110 transition-transform"
        />
        <div className="text-4xl md:text-5xl font-black text-white">
          {decimals > 0 ? count.toFixed(decimals) : count}
          <span className="text-accent">{suffix}</span>
        </div>
        <p className="mt-2 text-sm text-text-secondary uppercase tracking-wider font-medium">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 bg-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
            About Me
          </span>
          <div className="w-12 h-0.5 bg-accent mt-3" />
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Bio Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="lg:col-span-7"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-8">
              Each Frame Tells a <span className="text-accent">Story</span>
            </h2>

            <div className="space-y-6 text-base md:text-lg text-text-secondary leading-relaxed font-normal">
              <p>
                I’m <strong className="text-white font-semibold">YOGAMARAN SANKARAPANDI</strong>, a <strong className="text-white font-semibold">B.E. Computer Science and Engineering pre-final-year student from Madurai, Tamil Nadu, India</strong>, and a passionate <strong className="text-white font-semibold">Video Editor &amp; Visual Creator</strong>.
              </p>

              <p>
                I’ve been editing for <strong className="text-white font-semibold">5+ years</strong>, constantly experimenting, learning, and pushing my creative limits. Over the past <strong className="text-white font-semibold">1.5 years</strong>, I’ve taken that experience into professional video editing, working on content designed to capture attention, communicate ideas, and leave an impact.
              </p>

              <p>
                My creative workflow is built around <strong className="text-white font-semibold">Adobe Premiere Pro</strong>, <strong className="text-white font-semibold">Adobe After Effects</strong>, <strong className="text-white font-semibold">DaVinci Resolve</strong>, and <strong className="text-white font-semibold">Blender</strong>. From fast-paced social media content and cinematic edits to <strong className="text-white font-semibold">motion graphics</strong>, <strong className="text-white font-semibold">visual effects</strong>, <strong className="text-white font-semibold">color grading</strong>, <strong className="text-white font-semibold">3D visuals</strong>, and <strong className="text-white font-semibold">sound design</strong>, I love turning ordinary footage into something people actually want to watch.
              </p>

              <p>
                Being a Computer Science student also gives me a different perspective on creativity. I’m always exploring the intersection of <strong className="text-white font-semibold">technology, storytelling, and visual art</strong> — learning new techniques, experimenting with 3D, and finding smarter ways to bring ideas to life.
              </p>

              <p className="text-white/90 font-medium">
                I’m not just here to edit videos.
              </p>

              {/* Visually Stronger Final Statement */}
              <div className="pt-2">
                <p className="text-lg md:text-xl font-bold text-white border-l-2 border-accent pl-4 py-1 leading-snug">
                  I’m here to create visuals that make people stop, watch, and remember.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Statistics Cards Column */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-5 lg:sticky lg:top-28">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
