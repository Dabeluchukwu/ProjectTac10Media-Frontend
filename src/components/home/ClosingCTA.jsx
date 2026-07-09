import { ArrowRight } from "lucide-react";

const ClosingCTA = ({ data }) => {
  return (
    <section
      className="relative py-32 lg:py-40 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${data.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Subtle gradient overlay for cinematic feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Tag */}
        <p className="text-amber-500 uppercase tracking-[0.3em] text-sm font-semibold mb-6">
          {data.tag}
        </p>

        {/* Title */}
        <h2 className="text-white font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {data.title}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl leading-8 mt-8 max-w-3xl mx-auto">
          {data.subtitle}
        </p>

        {/* CTA Button */}
        <div className="mt-12">
          <a
            href="/contact"
            className="
              inline-flex
              items-center
              gap-3
              bg-amber-500
              hover:bg-amber-600
              text-black
              px-10
              py-4
              rounded-md
              font-semibold
              transition-all
              duration-300
            "
          >
            {data.buttonText}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;