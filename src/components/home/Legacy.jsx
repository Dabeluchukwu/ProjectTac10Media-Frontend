import { ArrowRight } from "lucide-react";
const Legacy = ({ data }) => {
  return (
    <section className="bg-[#0b0b0b] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <div>
            <span className="inline-block text-amber-500 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              About Us
            </span>

            <h2 className="text-white font-serif text-4xl md:text-5xl font-bold leading-tight mb-8">
              {data.title}
            </h2>

            <div className="space-y-6">
              {data.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-400 text-lg leading-8">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className=" ">
              <a
                href="/about"
                className="inline-flex items-center gap-3 text-amber-400 hover:text-amber-300 transition-colors group"
              >
                <span className="text-lg font-medium">{data.link.text}</span>

                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl border border-amber-500/20"></div>

            <img
              src={data.image}
              alt={data.title}
              className="relative rounded-3xl w-full h-[600px] object-cover shadow-2xl"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Legacy;
