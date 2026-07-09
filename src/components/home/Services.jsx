import ServiceCard from "./ServiceCard";

const Services = ({ data }) => {
  return (
    <section className="bg-[#0b0b0b] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-amber-500 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
            What We Offer
          </p>

          <h2 className="text-white font-serif text-4xl md:text-5xl font-bold mb-6">
            {data.title}
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-8">
            {data.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {data.items.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
