import { Clock3 } from "lucide-react";

const Hero = ({ data, featuredCourse, onStartWatching }) => {
  if (!data) return null;

  return (
    <>
      {/* ===== PAGE HEADER========== */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <img
          src={data?.backgroundImage || "/images/course-header.jpg"}
          alt="Courses"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#0b0b0b]" />

        {/* Amber Glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-[160px]" />

        <div className="relative mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-4 py-24 text-center">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 backdrop-blur-md">
              {data?.pageBadge || "MASTER YOUR CRAFT"}
            </span>

            <h1 className="mt-8 font-serif text-5xl font-semibold leading-tight text-white md:text-7xl">
              {data?.pageTitle || "Expand Your Creative Potential"}
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-neutral-200 md:text-xl">
              {data?.pageDescription ||
                "Discover premium filmmaking, cinematography, directing and editing courses taught by experienced professionals. Learn practical techniques, refine your creative vision, and elevate every project you create."}
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURED MASTERCLASS
      ========================== */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-amber-300">
                {data?.badge}
              </p>

              <h2 className="font-serif text-4xl font-semibold text-white md:text-5xl">
                {data?.title}
              </h2>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl">
            {/* ✅ FIXED: Only render image if source exists */}
            {(featuredCourse?.image || featuredCourse?.image) && (
              <img
                src={featuredCourse?.image || featuredCourse?.image}
                alt={featuredCourse?.title || "Featured Course"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            )}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />

            {/* Decorative Gradient */}
            <div className="absolute -left-32 top-0 h-full w-[420px] bg-amber-300/10 blur-[120px]" />

            <div className="relative flex min-h-[560px] items-center px-8 py-16 md:px-16">
              <div className="max-w-3xl">
                {/* Badge */}
                <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                  {data?.badge}
                </span>

                {/* Title */}
                <h3 className="mt-8 font-serif text-4xl font-semibold leading-tight text-white md:text-6xl">
                  {featuredCourse?.title || ""}
                </h3>

                {/* Description */}
                <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-300">
                  {featuredCourse?.description || ""}
                </p>

                {/* Bottom Info */}
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    onClick={() => onStartWatching?.(featuredCourse)}
                    className="rounded-lg bg-amber-300 px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-amber-200"
                  >
                    {data?.primaryButton}
                  </button>

                  <div className="flex items-center gap-3 rounded-full border border-neutral-700 bg-black/30 px-5 py-3 backdrop-blur-sm">
                    <Clock3 size={18} className="text-amber-300" />

                    <span className="text-neutral-200">
                      <span className="font-semibold">
                        {featuredCourse?.duration || "--"}
                      </span>{" "}
                      {data?.durationLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b0b0b] to-transparent" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;