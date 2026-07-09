import Hero from "../../../components/about/Hero";
import AboutStory from "../../../components/about/AboutStory";
import MissionVisionValues from "../../../components/about/MissionVisionValues";
import Instructors from "../../../components/about/Instructors";

import useAboutData from "./useAboutData";

const About = ({ apiData }) => {
  const data = useAboutData(apiData);

  if (!data) return null;

  return (
    <main className="bg-[#0b0b0b] text-white">
      <Hero data={data?.hero} />

      <AboutStory data={data?.story} />

      <MissionVisionValues data={data?.values} />

      <Instructors data={data?.instructors} />
    </main>
  );
};

export default About;