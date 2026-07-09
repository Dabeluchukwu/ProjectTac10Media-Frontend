// src/components/careers/PositionCard.jsx

import React from "react";
import {
  MapPin,
  Briefcase,
  Clock3,
  ArrowRight,
} from "lucide-react";

const PositionCard = ({ job, onApply }) => {
  if (!job) return null;

  const {
    id,
    title = "Untitled Position",
    department = "",
    location = "",
    employmentType = "",
    description = "",
  } = job;

  const handleApply = () => {
    if (typeof onApply === "function") {
      onApply(job);
    }
  };

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
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-amber-500/40
        hover:bg-zinc-900
        hover:shadow-xl
        hover:shadow-amber-500/10
      "
    >
      {/* Top Accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex-1">
          <h3 className="font-serif text-2xl text-white">
            {title}
          </h3>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-400">
            {department && (
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-amber-400" />
                <span>{department}</span>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-400" />
                <span>{location}</span>
              </div>
            )}

            {employmentType && (
              <div className="flex items-center gap-2">
                <Clock3 size={16} className="text-amber-400" />
                <span>{employmentType}</span>
              </div>
            )}
          </div>

          {description && (
            <p className="mt-6 max-w-3xl leading-7 text-zinc-400">
              {description}
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex shrink-0">
          <button
            type="button"
            onClick={handleApply}
            className="
              inline-flex
              items-center
              justify-center
              rounded-lg
              border
              border-amber-400
              bg-amber-400
              px-6
              py-3
              font-medium
              text-black
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-amber-300
            "
          >
            Apply Now

            <ArrowRight
              className="ml-2 h-4 w-4"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PositionCard;