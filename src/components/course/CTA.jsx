const CTA = ({ data, onPrimaryClick, onSecondaryClick }) => {
  if (!data) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800">
          {/* Background Image */}
          <img
            src={data?.backgroundImage || "/images/cta-bg.jpg"}
            alt={data?.title || "CTA Background"}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/75" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/30" />

          {/* Amber Glow */}
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-[120px]" />

          {/* Content */}
          <div className="relative px-6 py-20 text-center md:px-16">
            <h2 className="font-serif text-4xl font-semibold text-white md:text-5xl">
              {data?.title}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-neutral-200">
              {data?.description}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={onPrimaryClick}
                className="rounded-lg bg-amber-300 px-8 py-4 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-amber-200"
              >
                {data?.primaryButton}
              </button>

              <button
                type="button"
                onClick={onSecondaryClick}
                className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-amber-300 hover:text-amber-300"
              >
                {data?.secondaryButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;