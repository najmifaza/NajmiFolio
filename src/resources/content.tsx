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
  firstName: "Adridinan Najmi Faza",
  lastName: " Najmi Faza",
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
  title: `${person.firstName} Portfolio`,
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
        Mahasiswa Informatika dengan pengalaman di content production dan media
        operation. Terbiasa bekerja dengan deadline, mengelola konten digital,
        serta menerjemahkan kebutuhan non-teknis menjadi output visual dan
        informasi yang terstruktur. Memiliki pengalaman mengajar, koordinasi
        tim, dan dokumentasi kegiatan skala institusi negara.
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
          "Mengelola, menyunting, dan mempublikasikan konten berita serta artikel pada website resmi pondok menggunakan WordPress.",
          "Bertanggung jawab penuh atas pengelolaan dokumentasi visual dan informasi kegiatan pondok.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-06.png",
            alt: "Foto bersama tim media center",
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
          "Berperan dalam bimbingan akademik dan pengembangan karakter santri.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-07.jpg",
            alt: "foto bersama Guru KMI 2024/2025",
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
          "Berkontribusi sebagai staf penulis lepas pada platform media Melintas.id",
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
    title: "Organization & Commite",

    experiences: [
      {
        company: "Badan Eksekutif Mahasiswa Universitas Jenderal Soedirman",
        timeframe: "Februari 2026 - Present",
        role: "Web Development Staff",
        achievements: [
          "Bertanggung jawab dalam peliputan jurnalistik dan dokumentasi pada acara Seminar Nasional Pelepasan Duta Asfa yang diselenggarakan di MPR RI.",
          "Menyusun narasi berita dan mengelola aset dokumentasi visual untuk keperluan publikasi acara.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-05.jpg",
            alt: "Pelantikan BEM-U 2026/2027 di Graha Widyatama, Universitas Jenderal Soedirman",
            width: 16,
            height: 9,
          },
        ],
      },

      {
        company: "Seminar Nasional di MPR-RI - LAZIS Assalam Fil Alamin",
        timeframe: "Juli 2025",
        role: "Jurnalis & Dokumenter",
        achievements: [
          "Bertanggung jawab dalam peliputan jurnalistik dan dokumentasi pada acara Seminar Nasional Pelepasan Duta Asfa yang diselenggarakan di MPR RI.",
          "Menyusun narasi berita dan mengelola aset dokumentasi visual untuk keperluan publikasi acara.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-05.jpg",
            alt: "di Gedung Nusantara V, MPR-RI",
            width: 16,
            height: 9,
          },
        ],
      },

      {
        company: "Panggung Gembira 609",
        timeframe: "Agustus 2024",
        role: "FOH Coordinator Supervisor",
        achievements: [
          "Mengawasi koordinasi teknis di area Front of House (FOH), memastikan sinkronisasi antara operator sound, visual, dan tim acara.",
        ],
      },
      {
        company: "Khutbatul Arsy 2024",
        timeframe: "Agustus 2024",
        role: "Dokumentation Supervisor",
        achievements: [
          "Memimpin dan mengarahkan tim dokumentasi untuk meliput rangkaian acara pekan perkenalan.",
          "Memastikan kualitas visual (foto/video) memenuhi standar publikasi institusi.",
        ],
      },
      {
        company: "Khataman Santri Akhir 2024",
        timeframe: "Maret 2024",
        role: "Secretary",
        achievements: [
          "Mengelola seluruh korespondensi resmi kepanitiaan serta penyusunan berbagai surat undangan kegiatan.",
        ],
      },
      {
        company: "OPPM (Organisasi Pelajar Pondok Modern)",
        timeframe: "2023 - 2024",
        role: "Language Section - Secretary",
        achievements: [
          "Mengelola seluruh administrasi dan surat-menyurat Divisi Bahasa",
          "Menyusun Laporan Pertanggungjawaban (LPJ) program kerja tahunan.",
          "Menegakkan wajib berbahasa Arab dan Inggris kepada seluruh santri",
        ],
      },
      {
        company: "Panggung Gembira 608",
        timeframe: "Juni 2023 - Agustus 2023",
        role: "Secretary, Graphic Design, and Coordinator FOH",
        achievements: [
          "Menjadi penghubung utama antara konsep acara panitia dengan vendor/tim teknis (sound system, videotron, dan live streaming)",
          "Mengelola dokumen resmi, surat-menyurat, dan pengarsipan seluruh proses kepanitiaan.",
        ],
      },
      {
        company: "Khutbatul Arsy 2023",
        timeframe: "Juni 2023 - Juli 2023",
        role: "Secretary",
        achievements: [
          "Mengelola seluruh korespondensi resmi kepanitiaan serta penyusunan berbagai surat undangan kegiatan.",
        ],
      },
      {
        company: "Jam'iyyatul Qurra' Pondok Modern Tazakka",
        timeframe: "Januari 2020 - Maret 2025",
        role: "Pengurus & Musyrif (Pembimbing)",
        achievements: [
          "Mengoordinasi kegiatan latihan dan pembinaan tilawah bagi anggota.",
          "Bertugas sebagai muadzin dan qori masjid di lingkungan pondok.",
          "Menjadi musyrif yang mendampingi dan membimbing para santri.",
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
            Berpengalaman dalam membangun aplikasi web modern yang responsif,
            cepat, dan scalable menggunakan ekosistem React terbaru.
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
            Mengelola database dan otentikasi menggunakan solusi cloud modern
            serta memastikan integritas data dengan skema yang kuat.
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
            Ahli dalam pembuatan konten visual, mulai dari desain hingga editing
            video dan dokumentasi kegiatan institusi.
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

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const project: Work = {
  path: "/project",
  label: "Project",
  title: `Project – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /project routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Licenses & certifications",
  title: `Licenses & certifications – ${person.name}`,
  description: `Professional certifications and achievements by ${person.name}`,
  // PENTING: Ganti 'images' menjadi 'certificates' seperti di bawah ini
  certificates: [
    {
      title: "Data Classification and Summarization with IBM Granite",
      issuer: "IBM SkillsBuild & Hacktiv4",
      date: "Oct 2025",
      image: "/images/gallery/IBMData.png",
      url: "https://www.credly.com/badges/8a96daae-43d7-4b68-b44f-bfa5c740ae8e/public_url",
    },
    {
      title: "Soedirman Digital School 2025 – Web Development Program",
      issuer: "BEM-U",
      date: "Nov 2025",
      image: "/images/gallery/SDSWeb.png",
    },
    {
      title: "Basic Artificial Intelligence Certificate",
      issuer: "Dicoding Indonesia",
      date: "Nov 2025",
      image: "/images/gallery/BasicAI.png",
      url: "https://www.dicoding.com/certificates/ERZR2DVO2PYV",
    },
    {
      title: "Basic Web Programming Certificate",
      issuer: "Dicoding Indonesia",
      date: "Dec 2025",
      image: "/images/gallery/DasarPemWeb.png",
      url: "https://www.dicoding.com/certificates/JMZVV7L53ZN9",
    },

    {
      title: "Basic JavaScript Programming Certificate",
      issuer: "Dicoding Indonesia",
      date: "Jan 2026",
      image: "/images/gallery/JSprogramming.png",
      url: "https://www.dicoding.com/certificates/RVZKGN0YOXD5",
    },
    {
      title: "Front-End Web Development Certificate",
      issuer: "Dicoding Indonesia",
      date: "Jan 2026",
      image: "/images/gallery/FE_DEV_DICODING.png",
      url: "https://www.dicoding.com/certificates/L4PQ2DY72ZO1",
    },
  ],
};

export { person, social, newsletter, home, about, blog, project, gallery };
