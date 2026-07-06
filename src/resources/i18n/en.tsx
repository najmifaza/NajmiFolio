import type {
  About,
  Licenses,
  Home,
  Newsletter,
  Person,
  Social,
  Work,
} from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";
import React from "react";

const person: Person = {
  firstName: "Adridinan Najmi Faza",
  lastName: "Najmi Faza",
  name: "Adridinan Najmi Faza",
  role: "Web Developer",
  avatar: "/images/avatar.png",
  email: "adridinan99@gmail.com",
  location: "Asia/Jakarta", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Indonesian", "Arabic"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Follow to {person.lastName}'s Social Media</>,
  description: (
    <>My social media about my life as a student and software engineer</>
  ),
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/najmifaza",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/adridinan-najmi-faza-80b88a301",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/najmi.zaa/",
    essential: true,
  },

  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.png",
  label: "Home",
  title: `${person.firstName} | Portfolio`,
  description:
    "Official portfolio site of Adridinan Najmi Faza (Najmi Faza), Web Developer and Informatics student at Universitas Jenderal Soedirman.",
  headline: <>Passionate about EdTech & Social Impact</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Latest Project</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/project/",
  },
  subline: (
    <>
      I'm {person.firstName}, an undergraduate Informatics student at{" "}
      <Text as="span" size="l" weight="strong">
        Universitas Jenderal Soedirman.{" "}
      </Text>
      I believe in technology with purpose - building systems that enable
      people.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Informatics student with experience in content production and media
        operation. Accustomed to working with deadlines, managing digital content,
        and translating non-technical requirements into visual and
        structured information output. Experienced in teaching, team
        coordination, and documentation of state institution scale activities.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Organization & Work Experience",
    experiences: [
      {
        company: "Rumio.id",
        timeframe: "Juni 2026 - Present",
        role: "Full-stack Web Developer",
        achievements: [
          "Developed a comprehensive property exploration and marketing platform using Next.js (App Router), Prisma ORM, and Tailwind CSS.",
          "Implemented an interactive 360° Virtual Tour feature, secure authentication system with NextAuth, integrated admin dashboard, and blog CMS.",
          "Optimized database performance to eliminate N+1 query issues, and implemented rate-limiting and XSS sanitization to improve platform security.",
        ],
      },
      {
        company: "Panggih Sedulur",
        timeframe: "April 2026 - Present",
        role: "IT Coordinator",
        achievements: [
          "Responsible for the development and management of the Panggih Sedulur web platform which integrates directly with the CRM system and database.",
          "Implemented crucial features including Google Login, interactive questionnaire forms with branching logic, and personalized recommendation systems for Student Activity Units (UKM) at Unsoed.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/panggihsedulur.webp",
            alt: "Panggih Sedulur's Website",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Student Executive Board of Universitas Jenderal Soedirman",
        timeframe: "February 2026 - Present",
        role: "Web Development Staff",
        achievements: [
          "Managed and developed the official BEM-U website using WordPress, designed page layouts with Elementor, and performed advanced customization via HTML/CSS injections.",
          "Built a digital ecosystem to support communication and publication of BEM-U activities, including content ordering and creating a shortlink application to facilitate information access for students.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/pelantikan-bem-u.webp",
            alt: "Pelantikan BEM-U 2026/2027 di Graha Widyatama, Universitas Jenderal Soedirman",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Rabiha Tour & Travel",
        timeframe: "2025 - 2026",
        role: "Social Media  Specialist",
        achievements: [
          "Managed company social media content and appearance.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.webp",
            alt: "Rabiha's Instagram Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Media Center - Pondok Modern Tazakka",
        timeframe: "2024 - 2025",
        role: "Media Staff",
        achievements: [
          "Managed, edited, and published news content and articles on the official boarding school website using WordPress.",
          "Fully responsible for managing visual documentation and information on boarding school activities.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-06.webp",
            alt: "Photo with the media center team",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "KMI - Pondok Modern Tazakka",
        timeframe: "2024 - 2025",
        role: "Teacher",
        achievements: [
          "Taught with a routine schedule (4x per week) with Journalism Media and Grammar 3 subjects.",
          "Played a role in academic guidance and character development of students.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-07.webp",
            alt: "photo with KMI Teachers 2024/2025",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "PT Promedia Teknologi Indonesia (Melintas.id)",
        timeframe: "2025",
        role: "Web Content Writer",
        achievements: [
          "Contributed as a freelance writer staff on the Melintas.id media platform",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-09.webp",
            alt: "My landing page at Melintas.Id ",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "OPPM (Modern Boarding School Student Organization)",
        timeframe: "2023 - 2024",
        role: "Language Section - Secretary",
        achievements: [
          "Managed all administration and correspondence of the Language Division.",
          "Compiled Annual Accountability Reports (LPJ).",
          "Enforced mandatory Arabic and English for all students.",
        ],
      },
    ],
  },

  Organization: {
    display: true, // set to false to hide this section
    title: "Commite",

    experiences: [
      {
        company: "National Seminar at MPR-RI - LAZIS Assalam Fil Alamin",
        timeframe: "July 2025",
        role: "Journalist & Documentarian",
        achievements: [
          "Responsible for journalistic coverage and documentation at the Asfa Ambassador Send-off National Seminar held at MPR RI.",
          "Compiled news narratives and managed visual documentation assets for event publication purposes.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-05.webp",
            alt: "at Nusantara V Building, MPR-RI",
            width: 16,
            height: 9,
          },
        ],
      },

      {
        company: "Panggung Gembira 609",
        timeframe: "August 2024",
        role: "FOH Coordinator Supervisor",
        achievements: [
          "Supervised technical coordination in the Front of House (FOH) area, ensuring synchronization between sound, visual operators, and the event team.",
        ],
      },
      {
        company: "Khutbatul Arsy 2024",
        timeframe: "August 2024",
        role: "Documentation Supervisor",
        achievements: [
          "Led and directed the documentation team to cover the orientation week event series.",
          "Ensured visual quality (photo/video) met institutional publication standards.",
        ],
      },
      {
        company: "Khataman Santri Akhir 2024",
        timeframe: "March 2024",
        role: "Secretary",
        achievements: [
          "Managed all official committee correspondence and drafted various activity invitation letters.",
        ],
      },
      {
        company: "Panggung Gembira 608",
        timeframe: "June 2023 - August 2023",
        role: "Secretary, Graphic Design, and Coordinator FOH",
        achievements: [
          "Acted as the main liaison between the committee's event concept and vendors/technical teams (sound system, videotron, and live streaming).",
          "Managed official documents, correspondence, and archiving of the entire committee process.",
        ],
      },
      {
        company: "Khutbatul Arsy 2023",
        timeframe: "June 2023 - July 2023",
        role: "Secretary",
        achievements: [
          "Managed all official committee correspondence and drafted various activity invitation letters.",
        ],
      },
      {
        company: "Jam'iyyatul Qurra' Pondok Modern Tazakka",
        timeframe: "January 2020 - March 2025",
        role: "Board Member & Mentor (Musyrif)",
        achievements: [
          "Coordinated recitation practice and coaching activities for members.",
          "Served as muezzin and Quran reciter at the boarding school mosque.",
          "Acted as a mentor who accompanies and guides students.",
        ],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Universitas Jenderal Soedirman",
        description: <>Bachelor of Informatics Engineering</>,
      },
      {
        name: "Pondok Modern Tazakka",
        description: <>High school based on KMI curriculum</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Modern Web Development",
        description: (
          <>
            Experienced in building responsive, fast, and scalable modern web applications
            using the latest React ecosystem.
          </>
        ),
        tags: [
          { name: "Next.js", icon: "nextjs" },
          { name: "React", icon: "javascript" }, // Using JS icon as placeholder if React not in library
          { name: "TypeScript", icon: "javascript" },
          { name: "Tailwind CSS", icon: "css" },
          { name: "Shadcn/UI", icon: "figma" }, // Using Figma icon for UI kits
        ],
      },
      {
        title: "Backend & Infrastructure",
        description: (
          <>
            Managing database and authentication using modern cloud solutions
            and ensuring data integrity with robust schemas.
          </>
        ),
        tags: [
          { name: "Supabase", icon: "supabase" },
          { name: "PostgreSQL", icon: "postgree" },
          { name: "Zod", icon: "document" },
          { name: "GitHub", icon: "github" },
        ],
      },
      {
        title: "Editing & Design",
        description: (
          <>
            Expert in visual content creation, from design to video editing
            and documentation of institutional activities.
          </>
        ),
        tags: [
          { name: "Adobe Photoshop", icon: "Adobephotoshop" },
          { name: "Adobe Premierepro", icon: "Adobepremierepro" },
          { name: "Adobe Lightroom", icon: "Adobelightroom" },
          { name: "Coreldraw", icon: "Coreldraw" },
        ],
      },
    ],
  },
};



const project: Work = {
  path: "/project",
  label: "Project",
  title: `Project – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /project routes
};

const licenses: Licenses = {
  path: "/licenses",
  label: "Licenses & certifications",
  title: `Licenses & certifications – ${person.name}`,
  description: `Professional certifications and achievements by ${person.name}`,
  // PENTING: Ganti 'images' menjadi 'certificates' seperti di bawah ini
  certificates: [
    {
      title: "Data Classification and Summarization with IBM Granite",
      issuer: "IBM SkillsBuild & Hacktiv4",
      date: "Oct 2025",
      image: "/images/licenses/IBMData.png",
      url: "https://www.credly.com/badges/8a96daae-43d7-4b68-b44f-bfa5c740ae8e/public_url",
    },
    {
      title: "Soedirman Digital School 2025 – Web Development Program",
      issuer: "BEM-U",
      date: "Nov 2025",
      image: "/images/licenses/SDSWeb.png",
    },
    {
      title: "Basic Artificial Intelligence Certificate",
      issuer: "Dicoding Indonesia",
      date: "Nov 2025",
      image: "/images/licenses/BasicAI.png",
      url: "https://www.dicoding.com/certificates/ERZR2DVO2PYV",
    },
    {
      title: "Basic Web Programming Certificate",
      issuer: "Dicoding Indonesia",
      date: "Dec 2025",
      image: "/images/licenses/DasarPemWeb.png",
      url: "https://www.dicoding.com/certificates/JMZVV7L53ZN9",
    },

    {
      title: "Basic JavaScript Programming Certificate",
      issuer: "Dicoding Indonesia",
      date: "Jan 2026",
      image: "/images/licenses/JSprogramming.png",
      url: "https://www.dicoding.com/certificates/RVZKGN0YOXD5",
    },
    {
      title: "Front-End Web Development Certificate",
      issuer: "Dicoding Indonesia",
      date: "Jan 2026",
      image: "/images/licenses/FE_DEV_DICODING.png",
      url: "https://www.dicoding.com/certificates/L4PQ2DY72ZO1",
    },
  ],
};

export { person, social, newsletter, home, about, project, licenses };
