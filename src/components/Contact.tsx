import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Search,
  Check,
  X,
} from "lucide-react";
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from "../data/countries";
import { CURRENCIES, DEFAULT_CURRENCY, type Currency } from "../data/currencies";

const projectTypes = [
  "Short-form Editing (Reels, Shorts)",
  "Long-form Editing (YouTube, Instagram)",
  "Montage Editing (Wedding, Food)",
  "Motion Graphics Only (Lyrical, Intros, Text)",
  "Colour Grading Only",
  "3D Branding",
];

interface FormErrors {
  projectType?: string;
  name?: string;
  email?: string;
  phone?: string;
  budget?: string;
  description?: string;
}

function formatBudgetDisplay(amount: string, symbol: string, code: string): string {
  const trimmed = amount.trim();
  const numericOnly = trimmed.replace(/,/g, "");
  let formatted = trimmed;
  if (/^\d+(\.\d+)?$/.test(numericOnly)) {
    const parts = numericOnly.split(".");
    const withCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formatted = parts.length > 1 ? `${withCommas}.${parts[1]}` : withCommas;
  }
  if (symbol === code) {
    return `${formatted} ${code}`;
  }
  return `${symbol}${formatted} ${code}`;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    projectType: "",
    name: "",
    email: "",
    description: "",
  });

  // International WhatsApp / Phone State
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countrySearchInputRef = useRef<HTMLInputElement>(null);

  // Worldwide Currency & Budget State
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const currencySearchInputRef = useRef<HTMLInputElement>(null);

  // Submission & Validation State
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    const cleanQ = q.startsWith("+") ? q.slice(1) : q;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase() === q ||
        c.dialCode.toLowerCase().includes(q) ||
        c.dialCode.replace("+", "").includes(cleanQ)
    );
  }, [countrySearch]);

  // Filtered currencies
  const filteredCurrencies = useMemo(() => {
    const q = currencySearch.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.symbol.toLowerCase() === q ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [currencySearch]);

  // Handle outside clicks & keyboard Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(target)
      ) {
        setIsCountryDropdownOpen(false);
      }
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(target)
      ) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCountryDropdownOpen(false);
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Auto-focus search inputs on open
  useEffect(() => {
    if (isCountryDropdownOpen) {
      setTimeout(() => countrySearchInputRef.current?.focus(), 40);
    }
  }, [isCountryDropdownOpen]);

  useEffect(() => {
    if (isCurrencyDropdownOpen) {
      setTimeout(() => currencySearchInputRef.current?.focus(), 40);
    }
  }, [isCurrencyDropdownOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.projectType.trim()) {
      newErrors.projectType = "Please select a project type.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone validation: optional, but if entered check sensible length
    const rawPhone = phoneNumber.trim();
    if (rawPhone) {
      const digits = rawPhone.replace(/\D/g, "");
      if (digits.length < 6 || digits.length > 15) {
        newErrors.phone = "Please enter a valid phone number (6 to 15 digits) or leave it blank.";
      }
    }

    // Budget validation: amount is required
    const rawBudget = budgetAmount.trim();
    if (!rawBudget) {
      newErrors.budget = "Please enter a budget amount.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please enter a brief project description.";
    }

    setErrors(newErrors);

    // Focus the first invalid field
    if (newErrors.projectType) {
      document.getElementById("projectType")?.focus();
    } else if (newErrors.name) {
      document.getElementById("name")?.focus();
    } else if (newErrors.email) {
      document.getElementById("email")?.focus();
    } else if (newErrors.phone) {
      document.getElementById("phone")?.focus();
    } else if (newErrors.budget) {
      document.getElementById("budget")?.focus();
    } else if (newErrors.description) {
      document.getElementById("description")?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isSubmitting) return;

    if (!validateForm()) {
      setErrorMessage("Please complete all required fields before sending your message.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format phone number
      let fullPhone = "";
      const trimmedPhone = phoneNumber.trim();
      if (trimmedPhone) {
        const digits = trimmedPhone.replace(/\D/g, "");
        const countryDigits = selectedCountry.dialCode.replace(/\D/g, "");
        if (digits.startsWith(countryDigits)) {
          fullPhone = `${selectedCountry.dialCode} ${digits.slice(countryDigits.length)}`;
        } else {
          fullPhone = `${selectedCountry.dialCode} ${digits}`;
        }
      }

      // Format budget: preserve exact currency without converting
      const finalBudget = formatBudgetDisplay(
        budgetAmount,
        selectedCurrency.symbol,
        selectedCurrency.code
      );

      const payload = {
        projectType: formData.projectType,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: fullPhone,
        countryCode: selectedCountry.dialCode,
        phoneNumber: trimmedPhone,
        fullPhoneNumber: fullPhone,
        currencyCode: selectedCurrency.code,
        currencySymbol: selectedCurrency.symbol,
        currencyName: selectedCurrency.name,
        budgetAmount: budgetAmount.trim(),
        budget: finalBudget,
        description: formData.description.trim(),
      };

      let serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();

      if (serviceId && serviceId.startsWith("sservice_")) {
        serviceId = serviceId.replace(/^sservice_/, "service_");
      }

      let emailSent = false;

      if (serviceId && templateId && publicKey) {
        try {
          // Send directly via EmailJS SDK
          await emailjs.send(
            serviceId,
            templateId,
            {
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: fullPhone || "Not provided",
              projectType: formData.projectType,
              budget: finalBudget,
              description: formData.description.trim(),
              to_email: "maranmedia18@gmail.com",
            },
            publicKey
          );
          emailSent = true;
        } catch (emailJsErr: any) {
          console.warn("EmailJS send failed, attempting fallback API endpoint:", emailJsErr);
          const endpoint = import.meta.env.PROD
            ? "/.netlify/functions/send-email"
            : "/api/send-email";

          try {
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
              emailSent = true;
            } else {
              throw new Error(data.error || emailJsErr?.text || emailJsErr?.message || "Email delivery failed");
            }
          } catch {
            throw emailJsErr;
          }
        }
      }

      if (!emailSent) {
        // Fallback to Netlify function / Vite API server
        const endpoint = import.meta.env.PROD
          ? "/.netlify/functions/send-email"
          : "/api/send-email";

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || "Email delivery failed");
        }
      }

      // Success
      setSubmitted(true);
      setSuccessMessage(
        "Message received successfully!\n\nThank you for contacting Maran Media.\nI've received your project details and I'll get back to you within 5 hours."
      );
      setErrors({});

      // Reset form fields after successful submission to avoid accidental duplicates
      setFormData({
        projectType: "",
        name: "",
        email: "",
        description: "",
      });
      setPhoneNumber("");
      setBudgetAmount("");
      setSelectedCountry(DEFAULT_COUNTRY);
      setSelectedCurrency(DEFAULT_CURRENCY);

      // Keep button state for 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      console.error("Submission failed:", err);
      const detail = err?.text || err?.message || "Email delivery failed";
      setErrorMessage(
        import.meta.env.DEV
          ? `Error: ${detail}`
          : "We couldn't send your message right now. Please try again in a moment or email maranmedia18@gmail.com directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-surface">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/3 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
            Get In Touch
          </span>
          <div className="w-12 h-0.5 bg-accent mt-3 mx-auto" />
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">
            Let's Work Together
          </h2>
          <p className="mt-4 text-text-secondary max-w-md mx-auto">
            Have a project in mind? Let's discuss how we can bring your vision to
            life with cinematic editing and motion design.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="space-y-6 p-8 md:p-10 rounded-3xl bg-bg border border-white/5"
        >
          {/* Project Type */}
          <div>
            <label
              htmlFor="projectType"
              className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider"
            >
              Project Type <span className="text-accent">*</span>
            </label>
            <select
              id="projectType"
              value={formData.projectType}
              onChange={(e) => {
                setFormData({ ...formData, projectType: e.target.value });
                if (errors.projectType) {
                  setErrors((prev) => ({ ...prev, projectType: undefined }));
                }
              }}
              className={`w-full px-4 py-3.5 rounded-xl bg-surface border text-white transition-all appearance-none cursor-pointer focus:outline-none ${
                errors.projectType
                  ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                  : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent/30"
              }`}
            >
              <option value="" disabled>
                Select a project type
              </option>
              {projectTypes.map((type) => (
                <option key={type} value={type} className="bg-surface">
                  {type}
                </option>
              ))}
            </select>
            {errors.projectType && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle size={13} className="shrink-0" />
                {errors.projectType}
              </p>
            )}
          </div>

          {/* Name & Email row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider"
              >
                Your Name <span className="text-accent">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder="Yoga Maran"
                className={`w-full px-4 py-3.5 rounded-xl bg-surface border text-white placeholder-text-muted transition-all focus:outline-none ${
                  errors.name
                    ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                    : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent/30"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle size={13} className="shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider"
              >
                Email Address <span className="text-accent">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="your@email.com"
                className={`w-full px-4 py-3.5 rounded-xl bg-surface border text-white placeholder-text-muted transition-all focus:outline-none ${
                  errors.email
                    ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                    : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent/30"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle size={13} className="shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* WhatsApp / Contact Number (Optional) — Two-part with searchable country selector */}
          <div className="relative">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider"
            >
              WhatsApp / Contact Number{" "}
              <span className="text-text-muted font-normal text-xs normal-case tracking-normal">
                (Optional)
              </span>
            </label>

            <div
              className={`flex items-center rounded-xl bg-surface border transition-all ${
                errors.phone
                  ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/30"
                  : "border-white/10 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30"
              }`}
            >
              {/* Country Code Selector Trigger */}
              <div className="relative" ref={countryDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCountryDropdownOpen(!isCountryDropdownOpen);
                    setIsCurrencyDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-3.5 text-white hover:text-accent transition-colors shrink-0 font-medium select-none cursor-pointer border-r border-white/10"
                  aria-expanded={isCountryDropdownOpen}
                  aria-haspopup="listbox"
                  title={`${selectedCountry.name} (${selectedCountry.dialCode})`}
                >
                  <span className="text-lg leading-none" role="img" aria-label={selectedCountry.name}>
                    {selectedCountry.flag}
                  </span>
                  <span className="text-sm font-semibold tracking-wide">
                    {selectedCountry.dialCode}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-text-muted transition-transform duration-200 ${
                      isCountryDropdownOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>

                {/* Searchable Country Dropdown Menu */}
                {isCountryDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-3rem)] rounded-2xl bg-[#141414] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl z-50 overflow-hidden"
                    role="listbox"
                  >
                    {/* Search bar inside dropdown */}
                    <div className="p-2.5 border-b border-white/10 bg-[#181818]/70">
                      <div className="relative flex items-center">
                        <Search size={14} className="absolute left-3 text-text-muted pointer-events-none" />
                        <input
                          ref={countrySearchInputRef}
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search country or code..."
                          className="w-full pl-8 pr-3 py-2 rounded-lg bg-surface/90 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-accent"
                        />
                        {countrySearch && (
                          <button
                            type="button"
                            onClick={() => setCountrySearch("")}
                            className="absolute right-2.5 text-text-muted hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* List of Countries */}
                    <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                      {filteredCountries.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-text-muted">
                          No country found for "{countrySearch}"
                        </div>
                      ) : (
                        filteredCountries.map((c) => {
                          const isSelected =
                            selectedCountry.code === c.code &&
                            selectedCountry.dialCode === c.dialCode;
                          return (
                            <button
                              key={`${c.code}-${c.dialCode}`}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryDropdownOpen(false);
                                setCountrySearch("");
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-accent/15 text-accent font-semibold"
                                  : "text-text-secondary hover:bg-white/5 hover:text-white"
                              }`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <span className="text-base shrink-0 leading-none">{c.flag}</span>
                                <span className="truncate">{c.name}</span>
                              </div>
                              <span className="font-mono text-text-muted shrink-0 text-[11px] font-medium">
                                {c.dialCode}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Number Input */}
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }
                }}
                placeholder="98765 43210"
                className="w-full bg-transparent px-4 py-3.5 text-white placeholder-text-muted focus:outline-none min-w-0 text-sm md:text-base"
              />
            </div>

            {errors.phone && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle size={13} className="shrink-0" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Budget Range — Searchable ISO 4217 Currency + Amount */}
          <div className="relative">
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider"
            >
              Budget Range <span className="text-accent">*</span>
            </label>

            <div
              className={`flex items-center rounded-xl bg-surface border transition-all ${
                errors.budget
                  ? "border-red-500/70 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/30"
                  : "border-white/10 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30"
              }`}
            >
              {/* Searchable Currency Selector Trigger */}
              <div className="relative" ref={currencyDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                    setIsCountryDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-3.5 py-3.5 text-white hover:text-accent transition-colors shrink-0 select-none cursor-pointer border-r border-white/10"
                  aria-expanded={isCurrencyDropdownOpen}
                  aria-haspopup="listbox"
                  title={`${selectedCurrency.name} (${selectedCurrency.code})`}
                >
                  {selectedCurrency.flag && (
                    <span className="text-base leading-none" role="img" aria-label={selectedCurrency.name}>
                      {selectedCurrency.flag}
                    </span>
                  )}
                  {selectedCurrency.symbol !== selectedCurrency.code && (
                    <span className="text-sm font-bold tracking-wide text-accent">
                      {selectedCurrency.symbol}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-text-secondary">
                    {selectedCurrency.code}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-text-muted transition-transform duration-200 ${
                      isCurrencyDropdownOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>

                {/* Searchable Currency Dropdown Menu */}
                {isCurrencyDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-72 sm:w-84 max-w-[calc(100vw-3rem)] rounded-2xl bg-[#141414] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl z-50 overflow-hidden"
                    role="listbox"
                  >
                    {/* Search input */}
                    <div className="p-2.5 border-b border-white/10 bg-[#181818]/70">
                      <div className="relative flex items-center">
                        <Search size={14} className="absolute left-3 text-text-muted pointer-events-none" />
                        <input
                          ref={currencySearchInputRef}
                          type="text"
                          value={currencySearch}
                          onChange={(e) => setCurrencySearch(e.target.value)}
                          placeholder="Search currency (e.g. USD, euro, $)..."
                          className="w-full pl-8 pr-3 py-2 rounded-lg bg-surface/90 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-accent"
                        />
                        {currencySearch && (
                          <button
                            type="button"
                            onClick={() => setCurrencySearch("")}
                            className="absolute right-2.5 text-text-muted hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* List of Currencies */}
                    <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                      {filteredCurrencies.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-text-muted">
                          No currency found for "{currencySearch}"
                        </div>
                      ) : (
                        filteredCurrencies.map((curr) => {
                          const isSelected = selectedCurrency.code === curr.code;
                          return (
                            <button
                              key={curr.code}
                              type="button"
                              onClick={() => {
                                setSelectedCurrency(curr);
                                setIsCurrencyDropdownOpen(false);
                                setCurrencySearch("");
                                if (errors.budget) {
                                  setErrors((prev) => ({ ...prev, budget: undefined }));
                                }
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-accent/15 text-accent font-semibold"
                                  : "text-text-secondary hover:bg-white/5 hover:text-white"
                              }`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                {curr.flag && (
                                  <span className="text-base shrink-0 leading-none">{curr.flag}</span>
                                )}
                                {curr.symbol !== curr.code && (
                                  <span className="font-bold text-accent shrink-0">{curr.symbol}</span>
                                )}
                                <span className="font-medium text-white shrink-0">{curr.code}</span>
                                <span className="text-text-muted truncate text-[11px]">
                                  — {curr.name}
                                </span>
                              </div>
                              {isSelected && (
                                <Check size={14} className="text-accent shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Budget Amount Input */}
              <input
                id="budget"
                name="budget"
                type="text"
                value={budgetAmount}
                onChange={(e) => {
                  setBudgetAmount(e.target.value);
                  if (errors.budget) {
                    setErrors((prev) => ({ ...prev, budget: undefined }));
                  }
                }}
                placeholder="e.g. 5,000"
                className="w-full bg-transparent px-4 py-3.5 text-white placeholder-text-muted focus:outline-none min-w-0 text-sm md:text-base font-medium"
              />
            </div>

            {errors.budget && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle size={13} className="shrink-0" />
                {errors.budget}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider"
            >
              Brief Description <span className="text-accent">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              placeholder="Tell me about your project, timeline, and vision..."
              className={`w-full px-4 py-3.5 rounded-xl bg-surface border text-white placeholder-text-muted transition-all resize-none focus:outline-none ${
                errors.description
                  ? "border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                  : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent/30"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle size={13} className="shrink-0" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3"
            >
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" />
              <span className="whitespace-pre-line leading-relaxed">{successMessage}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || submitted}
            whileHover={isSubmitting || submitted ? {} : { scale: 1.02 }}
            whileTap={isSubmitting || submitted ? {} : { scale: 0.98 }}
            className={`w-full py-4 text-bg font-bold text-base rounded-full transition-all duration-300 flex items-center justify-center gap-3 ${
              submitted
                ? "bg-emerald-400 text-bg cursor-default"
                : isSubmitting
                ? "bg-accent/70 text-bg cursor-wait"
                : "bg-accent hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(245,166,35,0.3)] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 size={18} />
                Message Sent ✓
              </>
            ) : (
              <>
                <Send size={18} />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
