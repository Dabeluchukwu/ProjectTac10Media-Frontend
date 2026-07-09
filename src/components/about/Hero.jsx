import React from "react";

const Hero = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative h-[65vh] min-h-[520px] overflow-hidden">
      {/* Background */}
      <img
        src={data?.background}
        alt={data?.title || "Hero"}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0b0b0b]" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <h1 className="font-serif text-5xl font-semibold text-white md:text-7xl">
            {data?.title}
          </h1>

          <p className="mt-5 text-lg text-amber-400 md:text-xl">
            {data?.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;