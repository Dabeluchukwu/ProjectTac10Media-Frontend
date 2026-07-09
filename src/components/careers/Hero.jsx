// src/components/careers/Hero.jsx

import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = ({
  data,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  if (!data) return null;

  const {
    badge = "",
    title = "",
    description = "",
    backgroundImage = "",
    primaryButton = {},
    secondaryButton = {},
  } = data;

  return (
    <section className="relative isolate overflow-hidden bg-[#0b0b0b]">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage || "/images/careers/hero.jpg"}
          alt={title || "Careers"}
          className="h-full w-full object-cover object-center"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Cinematic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0bcc] to-transparent" />

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b0b0b] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-6 py-24 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          {badge && (
            <span className="mb-5 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              {badge}
            </span>
          )}

          {/* Heading */}
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="mt-8 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              {description}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onPrimaryClick}
              className="
                inline-flex
                items-center
                justify-center
                rounded-md
                border
                border-amber-400
                bg-amber-400
                px-7
                py-3.5
                font-medium
                text-black
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-amber-300
                hover:shadow-xl
                hover:shadow-amber-500/20
              "
            >
              {primaryButton?.label || "View Positions"}

              <ArrowRight
                className="ml-2 h-4 w-4"
                strokeWidth={2.2}
              />
            </button>

            <button
              type="button"
              onClick={onSecondaryClick}
              className="
                inline-flex
                items-center
                justify-center
                rounded-md
                border
                border-zinc-700
                bg-white/5
                px-7
                py-3.5
                font-medium
                text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-amber-400
                hover:bg-white/10
              "
            >
              {secondaryButton?.label || "Learn More"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;