// src/pages/public/Careers/Careers.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVacancies } from "../../../api/jobApi";

import Hero from "../../../components/careers/Hero";
import WhyWork from "../../../components/careers/WhyWorkWithUs";
import Benefits from "../../../components/careers/Benefits";
import OpenPositions from "../../../components/careers/OpenPositions";
import CTA from "../../../components/careers/CTA";

import useCareersData from "./useCareersData";

const Careers = () => {
  const navigate = useNavigate();

  // ✅ Fetch real jobs from API
  const { 
    data: jobs, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["public-jobs"],
    queryFn: getVacancies,
  });

  /**
   * Merge API with fallback content.
   * Static sections always have fallback values.
   * Jobs come from the API.
   */
  const pageData = useCareersData({
    jobs: jobs || [], // ✅ Pass real jobs to useCareersData
  });

  const scrollToSection = (id) => {
    document?.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

const handleApply = (job) => {
  if (!job) return;

  // ✅ Navigate to job details page using _id
  if (job._id) {
    navigate(`/careers/${job._id}`);
    return;
  }

  // Fallback to slug if available
  if (job.slug) {
    navigate(`/careers/${job.slug}`);
  }
};

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Hero
        data={pageData?.hero}
        onPrimaryClick={() => scrollToSection("open-positions")}
        onSecondaryClick={() => scrollToSection("why-work")}
      />

      <WhyWork data={pageData?.whyWork} />

      <Benefits data={pageData?.benefits} />

      <OpenPositions
        data={pageData?.jobsSection}
        jobs={pageData?.jobs || []}
        loading={isLoading}
        error={error}
        onApply={handleApply}
      />

      <CTA data={pageData?.cta} onButtonClick={() => navigate("/contact")} />
    </main>
  );
};

export default Careers;