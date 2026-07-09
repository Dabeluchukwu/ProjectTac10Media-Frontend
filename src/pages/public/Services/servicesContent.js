// src/data/data.js

const pageData = {
  hero: {
    badge: "MASTERING THE ART OF VISUALS",
    title: "Production Excellence Redefined",
    description:
      "From capturing high-stakes corporate summits to crafting cinematic legacies, TAC 10 MEDIA provides the technical precision and creative vision required for world-class visual storytelling.",
    primaryButton: "View Portfolios",
    secondaryButton: "Our Process",
    backgroundImage:
      "/src/assets/services/screen1.png",
  },

  services: {
    title: "Our Core Offerings",

    items: [
      {
        id: 1,
        icon: "CalendarDays",
        title: "Premium Event Coverage",
        description:
          "Capture every monumental moment with multi-camera setups and high-fidelity audio engineering.",
        button: "Learn More",
      },
      {
        id: 2,
        icon: "GraduationCap",
        title: "Cinematography Training",
        description:
          "Industry-standard masterclasses led by award-winning directors and technical experts.",
        button: "Learn More",
      },
      {
        id: 3,
        icon: "Clapperboard",
        title: "Professional Video Editing",
        description:
          "Post-production excellence involving color grading, sound design, and narrative flow.",
        button: "Learn More",
      },
      {
        id: 4,
        icon: "Lightbulb",
        title: "Creative Consulting",
        description:
          "Tailored strategies to align your visual brand with global aesthetic standards and impact.",
        button: "Learn More",
      },
    ],
  },

  featureSections: [
    {
      id: 1,
      eyebrow: "01 / EVENT COVERAGE",
      title: "Grand Scale Documentation",

      description:
        "We don't just record events; we document experiences. Our team utilizes cinema-grade equipment to ensure that every speech, reaction, and key moment is preserved in 4K RAW quality.",

      image:
        "/src/assets/services/screen2.png",

      bullets: [
        "4K & 8K multi-camera streaming and recording",
        "Professional lighting design for live environments",
        "Crystal-clear sound capturing with backup redundancy",
      ],

      button: "Request a Quote",

      reverse: false,
    },

    {
      id: 2,
      eyebrow: "02 / ACADEMY WORKSHOPS",
      title: "The TAC 10 Pedagogy",

      description:
        "Our training programs are designed for serious creators. From foundational camera mechanics to advanced narrative lighting, we bridge the gap between amateur curiosity and professional mastery.",

      image:
        "/src/assets/services/screen3.png",

      bullets: [
        "Hands-on sessions with industry-grade equipment",
        "Color grading workshops using DaVinci Resolve",
        "Script-to-screen project mentorships",
      ],

      button: "Enroll Today",

      reverse: true,
    },
  ],

  cta: {
    title: "Ready to Capture Your Story?",

    description:
      "Let's discuss your next production or educational journey. Our consultants are ready to help you define your visual signature.",

    cardTitle: "Consultations are free.",

    cardDescription: "Available for worldwide projects.",

    button: "Book a Consultation",
  },
};

export default pageData;