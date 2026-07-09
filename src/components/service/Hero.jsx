import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = ({ data }) => {
  if (!data) return null;

  const {
  badge = "",
  title = "",
  description = "",
  primaryButton = "Learn More",
  primaryButtonLink = "/",
  secondaryButton = "Our Process",
  backgroundImage = "",
} = data;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Gold Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-[#0b0b0b]" />

      {/* Spot Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-500/10 blur-[180px]" />

      <div className="relative z-10 max-w-5xl px-6 text-center">
        {badge && (
          <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-amber-400 font-medium mb-6">
            {badge}
          </p>
        )}

        {title && (
          <h1 className="font-serif text-white text-5xl md:text-7xl leading-tight">
            {title}
          </h1>
        )}

        {description && (
          <p className="mt-8 max-w-3xl mx-auto text-gray-300 text-lg leading-8">
            {description}
          </p>
        )}

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
      <Link
  to={primaryButtonLink}
  className="bg-amber-400 text-black px-8 py-4 font-semibold rounded-md hover:bg-amber-300 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
>
  {primaryButton}
</Link>
          <button className="inline-flex items-center justify-center gap-2 text-white font-medium hover:text-amber-400 transition-colors duration-300">
            {secondaryButton}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;