import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  image: string;
  alt: string;
  name: string;
  role: string;
  organization?: string;
}

// 11 Real WhatsApp Client Review Screenshots paired with authentic client details
const base = import.meta.env.BASE_URL;

const testimonials: Testimonial[] = [
  {
    id: 1,
    image: `${base}screenshots/Review - 01.png`,
    alt: "Client Review 01 - Dr. Ranjith Babu",
    name: "Dr. Ranjith Babu",
    role: "Influencer & Content Creator",
    organization: "Nellai Eye Care Institute",
  },
  {
    id: 2,
    image: `${base}screenshots/Review - 02.png`,
    alt: "Client Review 02 - Mr. Mourya",
    name: "Mr. Mourya",
    role: "Digital Marketing Agency",
  },
  {
    id: 3,
    image: `${base}screenshots/Review - 03.png`,
    alt: "Client Review 03 - Mr. Ashok Kumar",
    name: "Mr. Ashok Kumar",
    role: "Influencer & Content Creator",
    organization: "Sri Bheema Groups",
  },
  {
    id: 4,
    image: `${base}screenshots/Review - 04.png`,
    alt: "Client Review 04 - Mr. Karthick",
    name: "Mr. Karthick",
    role: "Influencer & Content Creator",
  },
  {
    id: 5,
    image: `${base}screenshots/Review - 05.png`,
    alt: "Client Review 05 - Dr. Poornima",
    name: "Dr. Poornima",
    role: "Influencer & Content Creator",
    organization: "GV Hospital",
  },
  {
    id: 6,
    image: `${base}screenshots/Review - 06.png`,
    alt: "Client Review 06 - Eagle NV Tech",
    name: "Eagle NV Tech",
    role: "Client",
  },
  {
    id: 7,
    image: `${base}screenshots/Review - 07.png`,
    alt: "Client Review 07 - Dr. S. Venkatesh Babu",
    name: "Dr. S. Venkatesh Babu",
    role: "Influencer & Content Creator",
    organization: "Sri Sakthi Hospital",
  },
  {
    id: 8,
    image: `${base}screenshots/Review - 08.png`,
    alt: "Client Review 08 - Mr. Jiju Fabio",
    name: "Mr. Jiju Fabio",
    role: "Digital Marketing Agency",
    organization: "Grow Yug",
  },
  {
    id: 9,
    image: `${base}screenshots/Review - 09.png`,
    alt: "Client Review 09 - Mrs. Amirtha Varshini",
    name: "Mrs. Amirtha Varshini",
    role: "Influencer & Content Creator",
  },
  {
    id: 10,
    image: `${base}screenshots/Review - 10.png`,
    alt: "Client Review 10 - Mr. Vishakh",
    name: "Mr. Vishakh",
    role: "Influencer & Content Creator",
    organization: "Barracuda Clothing Company",
  },
  {
    id: 11,
    image: `${base}screenshots/Review - 11.png`,
    alt: "Client Review 11 - Dr. LSK",
    name: "Dr. LSK",
    role: "Influencer & Content Creator",
    organization: "LSK Clinic",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % testimonials.length),
    []
  );
  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-32 bg-bg overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
            Testimonials
          </span>
          <div className="w-12 h-0.5 bg-accent mt-3 mx-auto" />
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
            What Clients Say
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-8 md:p-10 rounded-3xl bg-surface border border-white/5 shadow-2xl flex flex-col items-center"
            >
              {/* Quote Icon Header */}
              <div className="w-full flex items-center justify-start mb-4 md:mb-6">
                <Quote size={28} className="text-accent/40" />
              </div>

              {/* Real WhatsApp Screenshot */}
              <div className="w-full flex items-center justify-center p-2 sm:p-4 rounded-2xl bg-black/40 border border-white/5">
                <img
                  src={t.image}
                  alt={t.alt}
                  className="w-full max-w-3xl h-auto max-h-[260px] sm:max-h-[320px] md:max-h-[380px] object-contain rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
                  loading="eager"
                />
              </div>

              {/* Client Information */}
              <div className="mt-6 text-center">
                <p className="text-base sm:text-lg font-semibold text-white tracking-wide">
                  {t.name}
                </p>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  {t.role}
                  {t.organization && (
                    <>
                      <span className="text-accent/60 mx-2">•</span>
                      <span className="text-accent font-medium">{t.organization}</span>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent/30 transition-all active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center max-w-xs sm:max-w-md">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-accent w-6"
                      : "bg-white/20 hover:bg-white/40 w-2"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent/30 transition-all active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
