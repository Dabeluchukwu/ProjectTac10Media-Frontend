import Hero from "../../../components/service/Hero";
import ServicesSection from "../../../components/service/ServicesSection";
import FeatureSection from "../../../components/service/FeatureSection";
import CTASection from "../../../components/service/CTASection";
import usePageData from "./useServicesData";
import { Link } from "react-router-dom";

const Services = () => {
  const data = usePageData();

  return (
    <>
      <Hero data={data?.hero} />
      
      {/* ✅ Add Plans & Pricing CTA */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-700/10 border border-amber-500/20 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-amber-400 mb-2">
            Looking for bundled services?
          </h3>
          <p className="text-gray-400 mb-4">
            Check out our service plans with everything you need in one package.
          </p>
          <Link
            to="/plans-and-pricing"
            className="inline-block bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            View Plans & Pricing →
          </Link>
        </div>
      </div>
      
      <ServicesSection data={data?.services} />
      {data?.featureSections?.map((section) => (
        <FeatureSection key={section?.id} data={section} />
      ))}
      <CTASection data={data?.cta} />
    </>
  );
};

export default Services;