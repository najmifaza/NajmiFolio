import {
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

const person: Person = {
  firstName: "Najmi",
  lastName: "Faza",
  name: "Najmi Faza",
  role: "Web Developer",
  avatar: "/images/avatar.png",
  email: "adridinan99@gmail.com",
  location: "Asia/Jakarta", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Bahasa", "Arabic"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/once-ui-system",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/company/once-ui/",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/once_ui/",
    essential: false,
  },
  {
    name: "Threads",
    icon: "threads",
    link: "https://www.threads.com/@once_ui",
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
  headline: <>Building bridges between design and code</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      I'm Selene, a design engineer at{" "}
      <Text as="span" size="xl" weight="strong">
        ONCE UI
      </Text>
      , where I craft intuitive <br /> user experiences. After hours, I build my
      own projects.
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
          <>Mengelola konten dan tampilan media sosial perusahaan.</>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover.jpg",
            alt: "Rabiha's Instagram Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Pondok Modern Tazakka",
        timeframe: "2024 - 2025",
        role: "Staff Media & Jurnalistik",
        achievements: [
          <>
            Bertanggung jawab dalam mengelola dokumentasi, publikasi, dan
            informasi kegiatan pondok.
          </>,
          <>
            Peran ini melibatkan publikasi blog Website, pembuatan konten,
            pengelolaan media sosial, desain grafis, serta dokumentasi foto dan
            video.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Rabiha's Instagram Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "KMI Tazakka",
        timeframe: "2024 - 2025",
        role: "Pengajar",
        achievements: [
          <>
            Mengajar dengan jadwal rutin (4x per minggu) dengan mapel Media &
            Jurnalistik dan, Grammar 3
          </>,
        ],
      },
      {
        company: "PT Promedia Teknologi Indonesia (Melintas.id)",
        timeframe: "2025",
        role: "Web Content Writer",
        achievements: [
          <>
            Menulis konten edukasi dan literasi digital untuk platform media
            online
          </>,
          <>
            Mengolah topik teknologi dan pendidikan menjadi artikel yang mudah
            dipahami publik
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-03.png",
            alt: "Rabiha's Instagram Project",
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
        company: "Seminar Nasional Pelepasan Duta Asfa MPR-RI ",
        timeframe: "2025",
        role: "Jurnalis & Dokumenter",
        achievements: [
          <>Mengelola konten dan tampilan media sosial perusahaan.</>,
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
          <>Able to prototype in Figma with Once UI with unnatural speed.</>
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
          <>Building next gen apps with Next.js + Once UI + Supabase.</>
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
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
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
  label: "Work",
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
