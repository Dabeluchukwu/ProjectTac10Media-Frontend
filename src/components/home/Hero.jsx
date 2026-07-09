import { ArrowRight, Play } from "lucide-react";

const Hero = ({ data }) => {
  return (
    <section
      className="relative h-screen min-h-[750px] flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${data.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full flex justify-center">
        <div className="max-w-2xl text-center flex flex-col items-center">
          {/* Brand */}
          <p className="uppercase tracking-[0.35em] text-amber-400 text-sm mb-4 font-semibold">
            TAC 10 MEDIA
          </p>

          {/* Title */}
          <h1 className="text-white font-serif font-bold leading-[1.05] text-5xl md:text-6xl lg:text-7xl">
            {data.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base md:text-lg text-gray-300 leading-7">
            {data.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-7 py-3 rounded-md font-semibold transition-all duration-300"
            >
              {data.primaryButton.text}
              <ArrowRight size={18} />
            </a>

            <a
              href="/portfolio"
              className="inline-flex items-center gap-3 border border-white/30 hover:border-white text-white px-7 py-3 rounded-md transition-all duration-300 hover:bg-white/10"
            >
              <Play size={18} />
              {data.secondaryButton.text}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#0b0b0b] to-transparent" />
    </section>
  );
};

export default Hero;
