// src/components/careers/OpenPositions.jsx

import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import PositionCard from "./PositionCard";

const OpenPositions = ({
  data,
  jobs,
  loading = false,
  error = null,
  onApply,
}) => {
  if (!data) return null;

  const jobList = Array.isArray(jobs) ? jobs : [];

  return (
    <section
      id="open-positions"
      className="bg-[#0b0b0b] py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2">
            <BriefcaseBusiness
              size={16}
              className="text-amber-400"
            />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Careers
            </span>
          </div>

          <h2 className="font-serif text-4xl text-white md:text-5xl">
            {data?.title}
          </h2>

          {data?.description && (
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              {data.description}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <h3 className="text-xl font-semibold text-white">
              Unable to load positions
            </h3>

            <p className="mt-3 text-zinc-400">
              Please try again later.
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && jobList.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
              <BriefcaseBusiness
                className="text-amber-400"
                size={30}
              />
            </div>

            <h3 className="mt-6 font-serif text-3xl text-white">
              {data?.emptyState?.title}
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              {data?.emptyState?.description}
            </p>
          </div>
        )}

        {/* Jobs */}
        {!loading && !error && jobList.length > 0 && (
          <div className="space-y-6">
            {jobList.map((job) => (
              <PositionCard
                key={job?.id ?? job?.slug ?? Math.random()}
                job={job}
                onApply={onApply}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OpenPositions;