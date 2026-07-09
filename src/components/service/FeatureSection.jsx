import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

const FeatureSection = ({ data }) => {
  if (!data) return null;

  const {
    eyebrow = "",
    title = "",
    description = "",
    image = "",
    bullets = [],
    button = "Learn More",
    reverse = false,
  } = data;

  return (
    <section className="bg-[#0b0b0b] py-20 md:py-28">
      <div
        className={`mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:px-8 ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <div className="group overflow-hidden rounded-xl border border-white/10 bg-[#141414]">
            <img
              src={image}
              alt={title}
              className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-1/2">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              {eyebrow}
            </p>
          )}

          {title && (
            <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-8 text-lg leading-8 text-gray-400">
              {description}
            </p>
          )}

          {bullets?.length > 0 && (
            <div className="mt-10 space-y-5">
              {bullets.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >
                  <CheckCircle2
                    size={22}
                    className="mt-1 shrink-0 text-amber-400"
                  />

                  <span className="text-gray-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button className="group mt-10 inline-flex items-center gap-3 rounded-md border border-amber-400 px-6 py-3 font-medium text-amber-400 transition-all duration-300 hover:bg-amber-400 hover:text-black">
            {button}

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;