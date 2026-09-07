import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause } from "lucide-react";

interface Reel {
  id: string;
  num: string;
  title: string;
  category: string;
  src: string;
}

const base = import.meta.env.BASE_URL;

const REELS: Reel[] = [
  { id: "reel-01", num: "01", title: "Midnight Kinetic", category: "Short & Long Form", src: `${base}Videos/reel-01.mp4` },
  { id: "reel-02", num: "02", title: "Apex Motion", category: "Cinematic Cut", src: `${base}Videos/reel-02.mp4` },
  { id: "reel-03", num: "03", title: "Pulse & Flow", category: "Visual Storytelling", src: `${base}Videos/reel-03.mp4` },
  { id: "reel-04", num: "04", title: "Urban Dynamics", category: "Motion Graphics", src: `${base}Videos/reel-04.mp4` },
  { id: "reel-05", num: "05", title: "Hyper Grade", category: "Color & Sound", src: `${base}Videos/reel-05.mp4` },
  { id: "reel-06", num: "06", title: "Neon Velocity", category: "Dynamic Edit", src: `${base}Videos/reel-06.mp4` },
  { id: "reel-07", num: "07", title: "Golden Horizon", category: "Commercial Reel", src: `${base}Videos/reel-07.mp4` },
  { id: "reel-08", num: "08", title: "Chrono Shift", category: "Pacing & Rhythm", src: `${base}Videos/reel-08.mp4` },
  { id: "reel-09", num: "09", title: "Vortex Sequence", category: "Brand Film", src: `${base}Videos/reel-09.mp4` },
  { id: "reel-10", num: "10", title: "Monochrome Flow", category: "Creative Edit", src: `${base}Videos/reel-10.mp4` },
  { id: "reel-11", num: "11", title: "Static Spark", category: "Sound Design", src: `${base}Videos/reel-11.mp4` },
  { id: "reel-12", num: "12", title: "Infinite Loop", category: "High Retention", src: `${base}Videos/reel-12.mp4` },
];

export default function Works() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const handlePrev = useCallback(() => {
    setIsPlaying(true);
    setCurrentIndex((prev) => (prev - 1 + REELS.length) % REELS.length);
  }, []);

  const handleNext = useCallback(() => {
    setIsPlaying(true);
    setCurrentIndex((prev) => (prev + 1) % REELS.length);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Video playback management
  useEffect(() => {
    REELS.forEach((reel, index) => {
      const video = videoRefs.current.get(reel.id);
      if (!video) return;

      if (index === currentIndex) {
        video.muted = isMuted;
        video.playsInline = true;
        video.loop = true;
        if (isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Fallback for browser autoplay policies: mute and play
              video.muted = true;
              video.play().catch(() => {});
            });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
    });
  }, [currentIndex, isMuted, isPlaying]);

  const togglePlay = () => {
    const activeReel = REELS[currentIndex];
    const currentVideo = videoRefs.current.get(activeReel.id);
    if (!currentVideo) return;
    if (isPlaying) {
      currentVideo.pause();
      setIsPlaying(false);
    } else {
      currentVideo.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  const total = REELS.length;

  return (
    <section id="works" className="relative py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
            Featured Work
          </span>
          <div className="w-12 h-0.5 bg-accent mt-3" />
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">
            Short-form Edits
          </h2>
          <p className="mt-3 text-sm md:text-base text-text-secondary leading-relaxed">
            High-impact short-form edits crafted with precise cuts, dynamic motion graphics, polished sound design, engaging background music, and professional color grading — built to capture attention and maximize audience retention.
          </p>
        </motion.div>

        {/* 3D Infinite Video Carousel */}
        <div
          className="relative w-full h-[540px] sm:h-[600px] md:h-[660px] lg:h-[700px] flex items-center justify-center select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient Glow behind center active video */}
          <div className="absolute w-80 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Side Navigation Arrow Buttons */}
          <button
            onClick={handlePrev}
            className="flex absolute left-1 sm:left-2 md:left-4 lg:left-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-strong items-center justify-center text-white hover:text-accent hover:border-accent/40 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            aria-label="Previous video"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="flex absolute right-1 sm:right-2 md:right-4 lg:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-strong items-center justify-center text-white hover:text-accent hover:border-accent/40 transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            aria-label="Next video"
          >
            <ChevronRight size={24} />
          </button>

          {/* Reels */}
          {REELS.map((reel, index) => {
            let offset = ((index - currentIndex) % total + total) % total;
            if (offset > total / 2) {
              offset -= total;
            }

            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;
            const isVisible = Math.abs(offset) <= 1;

            // X-position using percentage of card width
            let xPos = "-50%";
            if (offset === -1) xPos = "calc(-50% - 104%)";
            else if (offset === 1) xPos = "calc(-50% + 104%)";
            else if (offset === -2) xPos = "calc(-50% - 208%)";
            else if (offset === 2) xPos = "calc(-50% + 208%)";
            else if (offset < -2) xPos = "calc(-50% - 240%)";
            else if (offset > 2) xPos = "calc(-50% + 240%)";

            return (
              <motion.div
                key={reel.id}
                initial={false}
                animate={{
                  x: xPos,
                  scale: isCenter ? 1 : isVisible ? 0.84 : 0.7,
                  opacity: isCenter ? 1 : isVisible ? 0.55 : 0,
                  filter: isCenter ? "grayscale(0%)" : "grayscale(100%)",
                  zIndex: isCenter ? 30 : isVisible ? 20 : 10,
                }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => {
                  if (isLeft) handlePrev();
                  else if (isRight) handleNext();
                  else if (isCenter) togglePlay();
                }}
                className={`absolute top-1/2 left-1/2 -translate-y-1/2 w-[270px] sm:w-[300px] md:w-[320px] lg:w-[350px] aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer ${
                  !isCenter ? "hidden md:block" : ""
                } ${
                  isCenter
                    ? "border border-accent/40 shadow-[0_0_40px_rgba(245,166,35,0.2)] ring-1 ring-accent/20"
                    : "border border-white/10 hover:border-white/20"
                }`}
                style={{
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                {/* HTML5 Video with source fallbacks */}
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(reel.id, el);
                    else videoRefs.current.delete(reel.id);
                  }}
                  className="w-full h-full object-cover"
                  playsInline
                  loop
                  muted={isMuted || !isCenter}
                  autoPlay={isCenter}
                  preload={isCenter ? "auto" : Math.abs(offset) <= 1 ? "metadata" : "none"}
                >
                  <source src={`${base}Videos/${reel.id}.mp4`} type="video/mp4" />
                  <source src={`${base}Videos/${reel.id}.webm`} type="video/webm" />
                  <source src={`${base}Videos/${reel.id}.mov`} type="video/quicktime" />
                  Your browser does not support the video tag.
                </video>

                {/* Subtle bottom gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Creator Tag & Controls */}
                {isCenter && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-text-secondary font-medium tracking-wide">
                        by @maran.media_
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Play/Pause Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        className="w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:text-accent transition-colors"
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                      >
                        {isPlaying ? (
                          <Pause size={15} fill="currentColor" />
                        ) : (
                          <Play size={15} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>

                      {/* Sound Mute/Unmute Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:text-accent transition-colors"
                        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                      >
                        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {REELS.map((reel, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={reel.id}
                onClick={() => {
                  setIsPlaying(true);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  isActive
                    ? "w-8 bg-accent shadow-[0_0_12px_rgba(245,166,35,0.6)]"
                    : "w-2 bg-white/20 hover:bg-white/50"
                }`}
                aria-label={`Go to reel ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
