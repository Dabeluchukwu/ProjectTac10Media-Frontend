import { ArrowRight } from "lucide-react";

const CourseCard = ({ course }) => {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        bg-[#121212]
        border border-white/10
        transition-all
        duration-300
        hover:-translate-y-2
      "
    >
      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Duration badge */}
        <div className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full tracking-wider">
          {course.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-white text-xl font-semibold mb-3">
          {course.title}
        </h3>

        <p className="text-gray-400 leading-7 flex-1">
          {course.description}
        </p>

        <a
          href="/courses"
          className="
            mt-6
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
          {course.button}

          <ArrowRight
            size={18}
            className="
              transition-transform
              duration-300
              group-hover/button:translate-x-1
            "
          />
        </a>
      </div>
    </article>
  );
};

export default CourseCard;