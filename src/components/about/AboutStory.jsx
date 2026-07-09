import React from "react";

const AboutStory = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative overflow-hidden bg-[#090909] py-28">
      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-amber-500/10 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left Content */}
          <div className="relative">
            {/* Small Label */}
            <span className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-amber-400">
              <span className="h-px w-10 bg-amber-400"></span>
              Our Story
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
              {data?.title}
            </h2>

            <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"></div>

            <div className="mt-10 space-y-7 text-[16px] leading-9 text-gray-300">
              {data?.paragraphs?.map((text, index) => (
                <p
                  key={index}
                  className="transition duration-300 hover:text-gray-100"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center">
            {/* Decorative Border */}
            <div className="absolute -left-8 -top-8 h-full w-full rounded-[40px] border border-amber-400/20"></div>

            {/* Glow */}
            <div className="absolute h-[520px] w-[400px] rounded-[35px] bg-amber-500/10 blur-3xl"></div>

            {/* Image Card */}
            <div className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
              <img
                src={data?.image}
                alt={data?.title}
                className="h-[520px] w-[400px] object-cover transition duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-black/40 px-6 py-3 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-400">
                  Since Day One
                </p>
              </div>
            </div>

            {/* Floating Accent */}
            <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;