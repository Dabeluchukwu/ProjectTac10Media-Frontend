import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#090909] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl rounded-[24px] bg-[#0D0D0D] px-10 py-16 md:px-16">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          
          {/* LEFT SIDE */}
          <div className="max-w-md">
            <h2 className="font-serif text-4xl font-bold uppercase tracking-wide text-[#E5B266]">
              TAC 10 MEDIA
            </h2>

            <p className="mt-5 max-w-sm text-[15px] leading-7 text-gray-300">
              Elite cinematography training and world-class production services
              for the next generation of storytellers.
            </p>

            {/* SOCIAL ICONS */}
            <div className="mt-8 flex items-center gap-4">
              
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-700 p-2 text-gray-300 transition hover:border-[#E5B266] hover:text-[#E5B266]"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-700 p-2 text-gray-300 transition hover:border-[#E5B266] hover:text-[#E5B266]"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-700 p-2 text-gray-300 transition hover:border-[#E5B266] hover:text-[#E5B266]"
              >
                <FaXTwitter size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-700 p-2 text-gray-300 transition hover:border-[#E5B266] hover:text-[#E5B266]"
              >
                <FaLinkedinIn size={18} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-700 p-2 text-gray-300 transition hover:border-[#E5B266] hover:text-[#E5B266]"
              >
                <FaYoutube size={18} />
              </a>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-start justify-between lg:items-end">
            
            {/* LINKS */}
            <nav className="flex flex-wrap gap-8 text-[15px] text-gray-200">
              <a href="/privacy-policy" className="transition hover:text-[#E5B266]">
                Privacy Policy
              </a>

              <a href="/terms" className="transition hover:text-[#E5B266]">
                Terms of Service
              </a>

              <a href="/faq" className="transition hover:text-[#E5B266]">
                FAQ
              </a>

              <a href="/press-kit" className="transition hover:text-[#E5B266]">
                Press Kit
              </a>
            </nav>

            {/* COPYRIGHT */}
            <p className="mt-10 text-sm uppercase tracking-wide text-neutral-500 lg:mt-16">
              © {year} TAC 10 MEDIA. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;