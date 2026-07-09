import React from "react";
import {
  CalendarDays,
  GraduationCap,
  Clapperboard,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const iconMap = {
  CalendarDays,
  GraduationCap,
  Clapperboard,
  Lightbulb,
};

const ServiceCard = ({ service }) => {
  if (!service) return null;

  const {
    icon = "Lightbulb",
    title = "",
    description = "",
    button = "Learn More",
  } = service;

  const Icon = iconMap[icon] || Lightbulb;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-[#141414] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/40 hover:bg-[#191919]">
      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-md bg-amber-400/10 text-amber-400 transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-black">
          <Icon size={28} strokeWidth={2} />
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl text-white transition-colors duration-300 group-hover:text-amber-300">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-4 text-sm leading-7 text-gray-400">
          {description}
        </p>

        {/* Button */}
        <button className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-400 transition-all duration-300 group-hover:gap-4">
          {button}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;