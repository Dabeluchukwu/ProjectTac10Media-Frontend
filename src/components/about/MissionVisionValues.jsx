import React from "react";
import {
  Clapperboard,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

const icons = {
  clapperboard: Clapperboard,
  eye: Eye,
  sliders: SlidersHorizontal,
};

const MissionVisionValues = ({ data }) => {
  if (!data?.length) return null;

  return (
    <section className="bg-[#141414] py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
        {data.map((item, index) => {
          const Icon = icons[item?.icon] || Clapperboard;

          return (
            <div
              key={index}
              className="rounded border border-zinc-700 bg-zinc-900/70 p-8 transition duration-300 hover:border-amber-400"
            >
              <Icon
                size={34}
                className="mb-6 text-amber-400"
              />

              <h3 className="mb-4 text-2xl font-semibold text-white">
                {item?.title}
              </h3>

              <p className="leading-7 text-gray-400">
                {item?.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MissionVisionValues;