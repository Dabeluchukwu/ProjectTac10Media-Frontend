import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Play,
  Pause,
  ZoomIn,
  Calendar,
  Clock,
  Star,
  Users,
  Award,
} from "lucide-react";

const Consultation = ({ data }) => {
  if (!data) return null;

  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const stats = [
    { icon: Users, value: "500+", label: "Happy Clients" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Award, value: "15", label: "Awards Won" },
    { icon: Clock, value: "10+", label: "Years Experience" },
  ];

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0b0b0b] to-[#0f0f0f] py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/5 blur-2xl"></div>
        
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 right-20 h-20 w-20 animate-float rounded-full bg-amber-400/5 blur-xl"></div>
        <div className="absolute bottom-20 left-20 h-32 w-32 animate-float-delayed rounded-full bg-amber-400/5 blur-xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Decorative Badge */}
        <div className="mb-12 flex justify-center lg:justify-start">
          <div className="group flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-400/10">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-amber-400/80">
              {data?.eyebrow || "Let's Work Together"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-8">
              <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
                {data?.title || "Expert Consultation"}
                <span className="block text-amber-400">For Your Success</span>
              </h2>

              <p className="max-w-xl text-lg leading-8 text-gray-400">
                {data?.description || "Transform your vision into reality with our expert consultation services. We provide tailored solutions that drive results and exceed expectations."}
              </p>
            </div>

            {/* Services List */}
            <div className="mt-12 space-y-8">
              {data?.services?.map((service, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-500 hover:border-amber-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(251,191,36,0.05)]"
                >
                  <div className="flex gap-6">
                    {/* Number with Glow */}
                    <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-400/5 blur transition-all duration-500 group-hover:blur-md"></div>
                      <span className="relative font-serif text-3xl font-bold text-amber-400/60 transition-all duration-500 group-hover:scale-110 group-hover:text-amber-400">
                        {service?.number || `0${index + 1}`}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-amber-400">
                        {service?.title}
                      </h3>
                      <p className="mt-2 leading-7 text-gray-400">
                        {service?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center transition-all duration-300 hover:border-amber-400/20 hover:bg-white/[0.04]"
                  >
                    <Icon size={20} className="mx-auto mb-2 text-amber-400" />
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-500 hover:shadow-[0_0_50px_rgba(251,191,36,0.4)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                <span className="relative flex items-center gap-4">
                  Schedule Consultation
                  <ArrowRight
                    size={18}
                    className={`transition-all duration-500 ${
                      isHovered ? "translate-x-2 -translate-y-1" : ""
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Image Container with Interactive Effects */}
              <div
                ref={imageRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#111] to-[#0d0d0d] shadow-2xl"
              >
                {/* Image with Parallax Effect */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <img
                    src={
                      data?.image
                    }
                    alt={data?.title || "Consultation"}
                    className="h-[500px] w-full object-cover transition-all duration-700 hover:scale-105 lg:h-[600px]"
                    onMouseEnter={() => setIsImageHovered(true)}
                    onMouseLeave={() => setIsImageHovered(false)}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>

                  {/* Play Button Overlay */}
                  <button
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-amber-400 p-5 text-black transition-all duration-500 hover:scale-110 hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] ${
                      isImageHovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause size={28} className="fill-current" />
                    ) : (
                      <Play size={28} className="fill-current pl-0.5" />
                    )}
                  </button>

                  {/* Zoom Indicator */}
                  <div
                    className={`absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm transition-all duration-500 ${
                      isImageHovered ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <ZoomIn size={16} className="text-amber-400" />
                    <span className="text-xs text-white">Hover to zoom</span>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute left-6 top-6 flex items-center gap-3 rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-xs font-medium text-white">Available Now</span>
                    </div>
                  </div>

                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 h-20 w-20 overflow-hidden">
                    <div className="absolute -right-4 -top-4 h-12 w-12 rotate-45 bg-amber-400/20"></div>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-[#111] p-4 shadow-2xl backdrop-blur-sm animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10">
                    <Calendar size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Next Available</p>
                    <p className="text-sm font-semibold text-white">Tomorrow 08:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default Consultation;