import type {
  About,
  Blog,
  Gallery,
  Home,
  Newsletter,
  Person,
  Social,
  Work,
} from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";
import React from "react";

const person: Person = {
  firstName: "Adridinan",
  lastName: " Najmi Faza",
  name: "Najmi Faza",
  role: "Web Developer",
  avatar: "/images/avatar.png",
  email: "adridinan99@gmail.com",
  location: "Asia/Jakarta", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Indonesian", "Arabic"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.name}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
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
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
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
    href: "/work/GrowTo-Platform-Delivery-Order",
  },
  subline: (
    <>
      I'm {person.firstName}, an undergraduate Informatics student at{" "}
      <Text as="span" size="xl" weight="strong">
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
        Mahasiswa Informatika dengan pengalaman nyata di content production,
        media operations, dan product mockup design. Terbiasa bekerja dengan
        deadline, mengelola konten digital, serta menerjemahkan kebutuhan
        non-teknis menjadi output visual dan informasi yang terstruktur.
        Memiliki pengalaman mengajar, koordinasi tim, dan dokumentasi kegiatan
        skala institusi negara.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Rabiha Tour & Travel",
        timeframe: "2025 - Present",
        role: "Social Media and Web Specialist",
        achievements: [
          "Mengelola konten dan tampilan media sosial perusahaan.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Rabiha's Instagram Project",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-08.png",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Media Center - Pondok Modern Tazakka",
        timeframe: "2024 - 2025",
        role: "Staff Media",
        achievements: [
          "Mengelola dokumentasi, publikasi, dan informasi kegiatan pondok.",
          "Terlibat dalam pembuatan konten, pengelolaan website, medsos, desain grafis, serta foto & video.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-06.png",
            alt: "Rabiha's Instagram Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "KMI - Pondok Modern Tazakka",
        timeframe: "2024 - 2025",
        role: "Pengajar",
        achievements: [
          "Mengajar dengan jadwal rutin (4x per minggu) dengan mapel Media Jurnalistik dan, Grammar 3.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-07.jpg",
            alt: "Rabiha's Instagram Project",
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
          <React.Fragment key="achievement-1">
            Menulis konten edukasi dan literasi digital untuk platform media
          </React.Fragment>,
          <React.Fragment key="achievement-2">
            Mengolah topik teknologi dan pendidikan menjadi artikel yang mudah
            dipahami publik
          </React.Fragment>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-09.png",
            alt: "My landing page at Melintas.Id ",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },

  Organization: {
    display: true, // set to false to hide this section
    title: "Organization and Commite",

    experiences: [
      {
        company: "Seminar Nasional di MPR-RI - LAZIS Assalam Fil Alamin ",
        timeframe: "2025",
        role: "Jurnalis & Dokumenter",
        achievements: [
          "Bertugas sebagai jurnalis dan tim dokumentasi pada acara Pelepasan Duta Asfa.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-05.jpg",
            alt: "Rabiha's Instagram Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Panggung Gembira & Khutbatul Arsy 608 & 609",
        timeframe: "2024 & 2025",
        role: "Koordinator FOH & Dokumenter",
        achievements: [
          "FOH Coordinator Supervisor Panggung Gembira 609",
          "Documentation Supervisor (Khutbatul Arsy 2024)",
        ],
        // images: [
        //   // optional: leave the array empty if you don't want to display images
        //   {
        //     src: "/images/projects/project-01/cover-05.jpg",
        //     alt: "Rabiha's Instagram Project",
        //     width: 16,
        //     height: 9,
        //   },
        // ],
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
        title: "Basic Programming",
        description: (
          <>
            Memiliki dasar pemrograman yang kuat sebagai mahasiswa Informatika.
          </>
        ),
        tags: [
          {
            name: "Html",
            icon: "html",
          },
          {
            name: "CSS",
            icon: "css",
          },
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "C",
            icon: "c",
          },
          {
            name: "Python",
            icon: "python",
          },
          {
            name: "MySql",
            icon: "sql",
          },
          {
            name: "MongoDB",
            icon: "mongodb",
          },
        ],
        // optional: leave the array empty if you don't want to display images
      },
      {
        title: "Wordpress Development",
        description: (
          <>
            Berpengalaman dalam mengelola platform media online dan website
            berbasis CMS untuk publikasi konten edukasi dan informasi
          </>
        ),
        tags: [
          {
            name: "Wordpress",
            icon: "wordpress",
          },
          {
            name: "Elementor",
            icon: "elementor",
          },
          {
            name: "WooCommerce",
            icon: "woocommerce",
          },
        ],

        // optional: leave the array empty if you don't want to display images
      },
      {
        title: "Editing & Design",
        description: (
          <>
            Ahli dalam pembuatan konten visual, mulai dari desain hingga editing
            video dan dokumentasi kegiatan institusi
          </>
        ),
        tags: [
          {
            name: "Adobe Photoshop",
            icon: "Adobephotoshop",
          },
          {
            name: "Adobe Premierepro",
            icon: "Adobepremierepro",
          },
          {
            name: "Adobe Lightroom",
            icon: "Adobelightroom",
          },
          {
            name: "Coreldraw",
            icon: "Coreldraw",
          },
        ],

        // optional: leave the array empty if you don't want to display images
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Project",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
