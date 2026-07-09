import React from "react";
import { ArrowRight, PhoneCall } from "lucide-react";

const CTASection = ({ data }) => {
  if (!data) return null;

  const {
    title = "",
    description = "",
    cardTitle = "",
    cardDescription = "",
    button = "Get Started",
  } = data;

  return (
    <section className="bg-[#0b0b0b] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#181818] to-[#111111]">
          <div className="grid items-center gap-12 p-10 md:p-16 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              {title && (
                <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
                  {description}
                </p>
              )}

              <button className="group mt-10 inline-flex items-center gap-3 rounded-md bg-amber-400 px-8 py-4 font-semibold text-black transition duration-300 hover:bg-amber-300">
                {button}

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Right Card */}
            <div className="rounded-2xl border border-amber-400/20 bg-black/30 p-8 backdrop-blur">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
                <PhoneCall size={30} />
              </div>

              {cardTitle && (
                <h3 className="font-serif text-2xl text-white">
                  {cardTitle}
                </h3>
              )}

              {cardDescription && (
                <p className="mt-4 leading-7 text-gray-400">
                  {cardDescription}
                </p>
              )}

              <div className="mt-8 h-px w-full bg-white/10" />

              <p className="mt-8 text-sm uppercase tracking-[0.25em] text-amber-400">
                TAC 10 MEDIA
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;