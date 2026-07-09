import Hero from "../../../components/contact/Hero";
import Consultation from "../../../components/contact/Consultation";
import ContactSection from "../../../components/contact/ContactSection";
import usePageData from "./useContactData";

const Contact = ({ apiData }) => {
  const page = usePageData(apiData);

  if (!page) return null;

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white overflow-x-hidden">
      <Hero data={page?.hero} />

      <Consultation data={page?.consultation} />

      <ContactSection data={page?.contact} />
    </main>
  );
};

export default Contact;