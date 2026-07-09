import React from "react";

const Instructors = ({ data }) => {
  if (!data) return null;

  return (
    <section className="bg-[#0b0b0b] py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl text-white">
            {data?.title}
          </h2>

          <p className="mt-3 text-amber-400">
            {data?.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {data?.members?.map((member, index) => (
            <div
              key={index}
              className="group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-[300px]"
            >
              <div className="overflow-hidden rounded-sm">
                <img
                  src={member?.image}
                  alt={member?.name}
                  className="h-[320px] lg:h-[360px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-white">
                  {member?.name}
                </h3>

                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-amber-400">
                  {member?.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instructors;