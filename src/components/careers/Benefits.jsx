// src/components/careers/Benefits.jsx

import React from "react";
import {
  PenTool,
  CalendarDays,
  GraduationCap,
  Users2,
  ArrowRight,
} from "lucide-react";

const iconMap = {
  PenTool,
  CalendarDays,
  GraduationCap,
  Users2,
};

const BenefitCard = ({ card }) => {
  if (!card) return null;

  const Icon = iconMap?.[card?.icon] || ArrowRight;

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-8
        backdrop-blur-sm
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-amber-500/40
        hover:bg-zinc-900
        hover:shadow-2xl
        hover:shadow-amber-500/10
      "
    >
      {/* Top Accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon */}
      <div
        className="
          mb-6
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-xl
          border
          border-amber-500/20
          bg-amber-500/10
          text-amber-400
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-amber-500
          group-hover:text-black
        "
      >
        <Icon size={26} strokeWidth={2} />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-serif text-white">
        {card?.title}
      </h3>

      {/* Description */}
      <p className="mt-4 leading-7 text-zinc-400">
        {card?.description}
      </p>
    </article>
  );
};

const Benefits = ({ data }) => {
  if (!data) return null;

  const cards = data?.cards ?? [];

  return (
    <section className="bg-[#0b0b0b] py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {data?.badge && (
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              {data.badge}
            </span>
          )}

          <h2 className="mt-5 font-serif text-4xl text-white md:text-5xl">
            {data?.title}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <BenefitCard
              key={card?.id}
              card={card}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;