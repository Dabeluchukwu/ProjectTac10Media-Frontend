import Hero from "../../../components/home/Hero";
import Legacy from "../../../components/home/Legacy";
import Services from "../../../components/home/Services";
import Masterclasses from "../../../components/home/Masterclasses";
import ClosingCTA from "../../../components/home/ClosingCTA";

import  useHomeData  from "./useHomeData";

const Home = () => {
  const data = useHomeData();

  return (
    <main className="bg-[#0b0b0b] min-h-screen">
      <Hero data={data.hero} />
      <Legacy data={data.legacy} />
      <Services data={data.services} />
      <Masterclasses data={data.masterclasses} />
       <ClosingCTA data={data.closingCTA} />
    </main>
  );
};

export default Home;
