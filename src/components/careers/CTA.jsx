// src/components/careers/CTA.jsx

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = ({ data, onButtonClick }) => {
  if (!data) return null;

  const {
    badge = "",
    title = "",
    description = "",
    button = {},
  } = data;

  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-zinc-800
            bg-gradient-to-br
            from-zinc-900
            via-[#111111]
            to-black
            px-8
            py-16
            text-center
            lg:px-20
          "
        >
          {/* Decorative Border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Badge */}
          {badge && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-5 py-2">
              <Sparkles
                size={16}
                className="text-amber-400"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              {description}
            </p>
          )}

          {/* Button */}
          <div className="mt-10">
            <button
              type="button"
              onClick={onButtonClick}
              className="
                group
                inline-flex
                items-center
                justify-center
                rounded-lg
                border
                border-amber-400
                bg-amber-400
                px-8
                py-4
                font-semibold
                text-black
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-amber-300
                hover:shadow-xl
                hover:shadow-amber-500/20
              "
            >
              {button?.label || "Contact Us"}

              <ArrowRight
                className="
                  ml-3
                  h-5
                  w-5
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;