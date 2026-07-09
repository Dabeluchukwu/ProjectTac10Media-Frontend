import CourseCard from "./CourseCard";
import { ArrowRight } from "lucide-react";

const Masterclasses = ({ data }) => {
  return (
    <section className="bg-[#0b0b0b] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8">
          <div>
            <p className="text-amber-500 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              Education
            </p>

            <h2 className="text-white font-serif text-4xl md:text-5xl font-bold mb-4">
              {data.title}
            </h2>

            <p className="text-gray-400 text-lg max-w-2xl leading-8">
              {data.subtitle}
            </p>
          </div>

          <a
            href="/courses"
            className="
              inline-flex
              items-center
              gap-2
              text-amber-400
              font-medium
              hover:text-amber-300
              transition-colors
              whitespace-nowrap
            "
          >
            {data.button.text}

            <ArrowRight size={18} />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Masterclasses;