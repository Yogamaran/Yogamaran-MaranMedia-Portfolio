import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const services = [
  "PROFESSIONAL VIDEO EDITING",
  "MOTION GRAPHICS",
  "COLOR GRADING",
  "SOUND DESIGN",
  "PERSONAL BRANDING",
];

export default function MarqueeBanner() {
  const doubled = [...services, ...services, ...services, ...services];

  return (
    <section className="relative py-8 bg-surface border-y border-white/5 overflow-hidden">
      {/* Marquee row 1 */}
      <div className="overflow-hidden">
        <div className="marquee-track animate-marquee">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="text-2xl md:text-4xl font-black uppercase tracking-wider text-white/20 hover:text-accent/50 transition-colors duration-500 whitespace-nowrap px-4">
                {item}
              </span>
              <span className="text-accent text-lg mx-3 select-none">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Marquee row 2 (reverse) */}
      <div className="overflow-hidden mt-4">
        <div className="marquee-track animate-marquee-reverse">
          {[...doubled].reverse().map((item, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="text-xl md:text-3xl font-bold uppercase tracking-wider text-white/10 whitespace-nowrap px-4">
                {item}
              </span>
              <span className="text-accent/60 text-base mx-3 select-none">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll down indicator */}
      <motion.div
        className="flex flex-col items-center mt-6"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-text-muted mb-2">
          Scroll Down
        </span>
        <ChevronDown size={16} className="text-accent" />
      </motion.div>
    </section>
  );
}
