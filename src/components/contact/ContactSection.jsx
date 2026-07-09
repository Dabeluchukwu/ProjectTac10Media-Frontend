import React, { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
 Briefcase,
  Play,
  ArrowRight,
  Send,
  Sparkles,
  CheckCircle,
  Globe,
  Clock,
} from "lucide-react";

const ContactSection = ({ data }) => {
  if (!data) return null;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    vision: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const socials = {
    Dribbble: Briefcase,
    Behance: Briefcase,
    Vimeo: Play,
    Linkedin: Play,
    Twitter: Play,
    Instagram: Play,
    Youtube: Play,
  };

  const contactItems = [
    {
      icon: MapPin,
      ...data?.info?.address,
    },
    {
      icon: Mail,
      ...data?.info?.email,
    },
    {
      icon: Phone,
      ...data?.info?.phone,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0b0b0b] to-[#0f0f0f] py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/5 blur-2xl"></div>

        {/* Animated Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Decorative Badge */}
        <div className="mb-12 flex justify-center lg:justify-start">
          <div className="group flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-400/10">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-amber-400/80">
              {data?.eyebrow || "Connect With Us"}
            </span>
          </div>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left Column */}
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
                {data?.title || "Let's Create Something"}
                <span className="block text-amber-400">Extraordinary</span>
              </h2>
              <p className="mt-6 text-lg text-gray-400">
                {data?.description ||
                  "Get in touch and let's bring your vision to life with exceptional design and creativity."}
              </p>
            </div>

            {/* Contact Items */}
            <div className="space-y-8">
              {contactItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group flex items-start gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-500 hover:border-amber-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(251,191,36,0.05)]"
                  >
                    <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-400/5 transition-all duration-500 group-hover:from-amber-400/20 group-hover:to-amber-400/10">
                      <div className="absolute inset-0 rounded-xl bg-amber-400/5 blur transition-all duration-500 group-hover:blur-md"></div>
                      <Icon
                        size={22}
                        className="relative text-amber-400 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/70">
                        {item?.title}
                      </p>
                      <h3 className="mt-1 text-xl font-medium text-white transition-colors duration-300 group-hover:text-amber-400">
                        {item?.value}
                      </h3>
                      {item?.description && (
                        <p className="mt-1 text-sm text-gray-400">
                          {item?.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/70 whitespace-nowrap">
                  Follow The Journey
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"></div>
              </div>

              <div className="flex flex-wrap gap-3">
                {data?.social?.map((social, index) => {
                  const Icon = socials[social];

                  return (
                    <button
                      key={index}
                      className="group relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-amber-400 hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/0 to-amber-400/0 transition-all duration-300 group-hover:from-amber-400/20 group-hover:to-amber-400/10"></div>
                      {Icon && (
                        <Icon
                          size={20}
                          className="relative text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:text-black"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-400/10 via-amber-400/5 to-amber-400/10 blur-xl"></div>

            <form
              onSubmit={handleSubmit}
              className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#111111] to-[#0d0d0d] p-8 shadow-2xl backdrop-blur-sm md:p-10"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Send a Message
                  </p>
                  <p className="text-xs text-gray-500">
                    We'll respond within 24 hours
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1">
                  <Clock size={12} className="text-amber-400/60" />
                  <span className="text-xs text-gray-500">Fast response</span>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="group">
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/70">
                    {data?.form?.fullName || "Full Name"}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Alexander Sterling"
                    className="w-full border-b-2 border-white/10 bg-transparent pb-3 text-white outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-amber-400 focus:shadow-[0_1px_0_0_#fbbf24]"
                  />
                  <div className="mt-1 h-0.5 w-0 bg-amber-400 transition-all duration-500 group-focus-within:w-full"></div>
                </div>

                <div className="group">
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/70">
                    {data?.form?.email || "Email Address"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@studio.com"
                    className="w-full border-b-2 border-white/10 bg-transparent pb-3 text-white outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-amber-400 focus:shadow-[0_1px_0_0_#fbbf24]"
                  />
                  <div className="mt-1 h-0.5 w-0 bg-amber-400 transition-all duration-500 group-focus-within:w-full"></div>
                </div>
              </div>

              <div className="mt-10 group">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/70">
                  {data?.form?.department || "Department"}
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full border-b-2 border-white/10 bg-transparent pb-3 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:shadow-[0_1px_0_0_#fbbf24]"
                  >
                    {data?.form?.departments?.map((department, index) => (
                      <option
                        key={index}
                        value={department}
                        className="bg-[#111]"
                      >
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-10 group">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/70">
                  {data?.form?.vision || "Your Vision"}
                </label>
                <textarea
                  name="vision"
                  value={formData.vision}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Briefly describe your project or inquiry..."
                  className="w-full resize-none border-b-2 border-white/10 bg-transparent pb-3 text-white outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-amber-400 focus:shadow-[0_1px_0_0_#fbbf24]"
                />
                <div className="mt-1 h-0.5 w-0 bg-amber-400 transition-all duration-500 group-focus-within:w-full"></div>
              </div>

              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`group relative mt-12 flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-5 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-500 hover:shadow-[0_0_50px_rgba(251,191,36,0.4)] ${
                  isSubmitted ? "pointer-events-none opacity-70" : ""
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                <span className="relative flex items-center gap-4">
                  {isSubmitted ? (
                    <>
                      <CheckCircle size={20} className="animate-bounce" />
                      {data?.form?.button || "Message Sent!"}
                    </>
                  ) : (
                    <>
                      <Send
                        size={18}
                        className={`transition-transform duration-500 ${
                          isHovered ? "translate-x-1 -translate-y-1" : ""
                        }`}
                      />
                      {data?.form?.button || "Send Message"}
                      <ArrowRight
                        size={18}
                        className={`transition-all duration-500 ${
                          isHovered ? "translate-x-2 -translate-y-1" : ""
                        }`}
                      />
                    </>
                  )}
                </span>
              </button>

              {/* Success Message */}
              {isSubmitted && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CheckCircle size={16} />
                  <span>Your message has been sent successfully!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
