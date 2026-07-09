import { Camera, Video, Edit, MessageSquare } from "lucide-react";
import { ArrowRight } from "lucide-react";

const ctaMap = {
  "Premium Event Coverage": {
    text: "Book Your Event",
    link: "/plans-and-pricing",
  },
  "Cinematography Training": {
    text: "Explore Training",
    link: "/courses",
  },
  "Video Editing": {
    text: "View Editing Services",
    link: "/booking",
  },
  "Creative Consulting": {
    text: "Get Consultation",
    link: "/contact",
  },
};

const iconMap = {
  Camera,
  Video,
  Edit,
  MessageSquare,
};

const ServiceCard = ({ service }) => {
 const Icon = iconMap[service.icon] || Camera;
  const cta = ctaMap[service.title];

  return (
    <article
      className="
        group
        bg-[#121212]
        border border-white/10
        rounded-2xl
        p-8
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-amber-500/40
        hover:shadow-[0_20px_50px_rgba(245,158,11,0.08)]
        flex flex-col
      "
    >
      {/* Icon */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-all duration-300">
          <Icon
            size={30}
            className="text-amber-400 group-hover:text-black transition-colors"
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-semibold text-white mb-5">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 leading-8 flex-1">{service.description}</p>

      {/* CTA */}
      {cta && (
        <a
          href={cta.link}
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            text-amber-400
            font-medium
            group/button
            w-fit
            hover:text-amber-300
            transition-colors
          "
        >
          {cta.text}

          <ArrowRight
            size={18}
            className="
              transition-transform
              duration-300
              group-hover/button:translate-x-1
            "
          />
        </a>
      )}
    </article>
  );
};

export default ServiceCard;
