import React from "react";

const Hero = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative h-[92vh] min-h-[700px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={
            data?.image ||
            "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=80"
          }
          alt={data?.title?.line2 || "Studio"}
          className="h-full w-full object-cover object-center"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Warm Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,160,73,0.35),transparent_60%)]" />

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b0b0b] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h1 className="font-serif leading-none tracking-tight">
            <span className="block text-5xl text-white md:text-7xl lg:text-8xl">
              {data?.title?.line1}
            </span>

            <span className="mt-2 block text-6xl font-medium text-amber-400 md:text-8xl lg:text-9xl">
              {data?.title?.line2}
            </span>
          </h1>

          {/* Accent Line */}
          <div className="mx-auto my-10 h-px w-24 bg-amber-400/70" />

          <p className="mx-auto max-w-2xl text-lg italic leading-relaxed text-gray-200 md:text-2xl">
            {data?.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;