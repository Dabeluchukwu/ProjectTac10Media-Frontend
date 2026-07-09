import React from "react";
import ServiceCard from "./ServiceCard";

const ServicesSection = ({ data }) => {
  if (!data) return null;

  const { title = "", items = [] } = data;

  return (
    <section className="bg-[#0b0b0b] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-14">
          {title && (
            <h2 className="font-serif text-4xl text-white md:text-5xl">
              {title}
            </h2>
          )}

          <div className="mt-5 h-1 w-20 rounded-full bg-amber-400" />
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {items?.length > 0 ? (
            items.map((item) => (
              <ServiceCard
                key={item?.id ?? item?.title}
                service={item}
              />
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-dashed border-white/10 py-12 text-center text-gray-500">
              No services available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;