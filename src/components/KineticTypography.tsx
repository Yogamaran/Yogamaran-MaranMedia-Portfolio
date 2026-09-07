import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const text = "DON’T CHOOSE ART. ART CHOOSES YOU.";

export default function KineticTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const words = text.split(" ");
  let charCounter = 0;

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-32 bg-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-8 gap-y-4 text-center">
          {words.map((word, wIdx) => {
            const wordChars = word.split("");
            return (
              <span key={wIdx} className="inline-flex whitespace-nowrap">
                {wordChars.map((char) => {
                  const i = charCounter++;
                  const start = i / text.length;
                  const end = start + 1 / text.length;
                  return (
                    <KineticLetter
                      key={i}
                      char={char}
                      progress={scrollYProgress}
                      range={[start * 0.6, end * 0.6 + 0.2]}
                    />
                  );
                })}
              </span>
            );
          })}
        </div>
      </div>

      {/* Decorative line */}
      <motion.div
        className="mt-12 mx-auto h-px max-w-lg"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(245,166,35,0.3), transparent)",
          scaleX: useTransform(scrollYProgress, [0.3, 0.7], [0, 1]),
        }}
      />
    </section>
  );
}

function KineticLetter({
  char,
  progress,
  range,
}: {
  char: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [40, 0]);
  const scale = useTransform(progress, range, [0.8, 1]);

  return (
    <motion.span
      style={{ opacity, y, scale }}
      className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white/90 inline-block leading-none tracking-tight"
    >
      {char}
    </motion.span>
  );
}
