import { motion } from "framer-motion";
import { Phone, Mail, ArrowUpRight } from "lucide-react";

/* Inline SVG social icons */
function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconLinkedin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    icon: IconInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/maran.media_?igsi=MXU4ZGNwZTE2MXhoOA%3D%3D",
  },
  {
    icon: IconLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yoga-maran-s-9b1b08434",
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-bg overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Top section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Stay <span className="text-accent">Connected</span>
          </h2>
          <p className="mt-4 text-text-secondary max-w-md mx-auto">
            Ready to create something extraordinary? Let's make it happen.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=maranmedia18@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 border border-white/10 hover:border-accent/30 rounded-full text-white hover:text-accent transition-all duration-300"
            >
              <Mail size={18} />
              maranmedia18@gmail.com
              <ArrowUpRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="#contact"
              className="group flex items-center gap-3 px-6 py-3 bg-accent hover:bg-accent-hover text-bg font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,166,35,0.3)]"
            >
              <Phone size={18} />
              Book A Slot
            </a>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Bottom grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-bg font-black text-sm">MM</span>
              </div>
              <span className="text-lg font-bold text-white">
                MARAN <span className="text-accent">MEDIA</span>
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Freelance video editor specializing in short-form and long-form
              edits, motion graphics, and visual storytelling. Working remotely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Follow Along
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-11 h-11 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(245,166,35,0.1)]"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="h-px bg-white/5 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} MARAN MEDIA. All rights reserved.</p>
          <p>
            Crafted with passion &{" "}
            <span className="text-accent">precision</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
