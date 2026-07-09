import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, onViewDetails }) => {
  if (!course) return null;

  const navigate = useNavigate();

  const {
    title = "",
    description = "",
    image = null, // ✅ Change default to null
    category = "",
    duration = "",
    level = "",
  } = course;

  // ✅ Determine the image source
  const getImageSrc = () => {
    if (image) return image;
    return "/images/placeholder-course.jpg"; // ✅ Default placeholder
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-neutral-800 bg-[#151515] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/30 hover:shadow-xl hover:shadow-black/30">
      {/* Thumbnail */}
      <div className="aspect-[16/9] overflow-hidden bg-neutral-900">
        <img
          src={getImageSrc()}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // ✅ Fallback if image fails to load
            e.target.src = "/images/placeholder-course.jpg";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex h-[270px] flex-col p-5">
        {/* Category + Duration */}
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            {category}
          </span>

          <span className="text-sm text-neutral-300">{duration}</span>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-2xl font-semibold text-white line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="line-clamp-3 text-[15px] leading-7 text-neutral-300">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-800 pt-5">
          <span className="text-sm text-neutral-300">{level}</span>

          <button
            type="button"
            onClick={() => navigate(`/courses/${course._id}`)}
            className="flex items-center gap-2 font-medium text-amber-300 transition-colors hover:text-amber-200"
          >
            Details
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;