// src/components/careers/WhyWork.jsx

import React from "react";
import {
  Users,
  Target,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const icons = {
  Users,
  Target,
  ShieldCheck,
};

const FeatureCard = ({ feature }) => {
  if (!feature) return null;

  const Icon = icons?.[feature?.icon] || ArrowRight;

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">
          {feature?.title}
        </h3>

        <p className="mt-2 text-sm leading-7 text-zinc-400">
          {feature?.description}
        </p>
      </div>
    </div>
  );
};

const GalleryImage = ({ image }) => {
  if (!image) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <img
        src={image?.image}
        alt={image?.alt || ""}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 hover:scale-105"
      />
    </div>
  );
};

const WhyWork = ({ data }) => {
  if (!data) return null;

  const features = data?.features ?? [];
  const gallery = data?.gallery ?? [];

  return (
    <section
      id="why-work"
      className="bg-[#0b0b0b] py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
          {/* LEFT */}
          <div>
            <h2 className="font-serif text-4xl text-white md:text-5xl">
              {data?.title}
            </h2>

            <p className="mt-8 max-w-xl leading-8 text-zinc-400">
              {data?.description}
            </p>

            <div className="mt-12 space-y-10">
              {features.map((feature) => (
                <FeatureCard
                  key={feature?.id}
                  feature={feature}
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="grid h-full grid-cols-2 gap-5">
              {/* Left Image */}
              <div className="col-span-1 h-[540px]">
                <GalleryImage image={gallery?.[0]} />
              </div>

              {/* Right Images */}
              <div className="flex flex-col gap-5">
                <div className="h-[260px]">
                  <GalleryImage image={gallery?.[1]} />
                </div>

                <div className="h-[260px]">
                  <GalleryImage image={gallery?.[2]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWork;