import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mapPath = path.join(process.cwd(), "scripts", "cdn-assets-map.json");
let cdnFlatMap: Record<string, string> = {};
if (fs.existsSync(mapPath)) {
  try {
    cdnFlatMap = JSON.parse(fs.readFileSync(mapPath, "utf-8")).flat || {};
  } catch {
    // ignore
  }
}
const toCdn = (p: string) => cdnFlatMap[p] || p;

async function main() {
  console.log("Seeding database...");

  // 1. Profile & Translations
  await prisma.profile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      avatar: toCdn("/images/avatar.png"),
      email: "adridinan99@gmail.com",
      location: "Asia/Jakarta",
      languages: ["English", "Indonesian", "Arabic"],
      translations: {
        create: [
          {
            locale: "id",
            name: "Adridinan Najmi Faza",
            role: "Web Developer",
            headline: "Passionate about EdTech & Social Impact",
            subline:
              "I'm Adridinan Najmi Faza, an undergraduate Informatics student at Universitas Jenderal Soedirman. I believe in technology with purpose - building systems that enable people.",
            intro:
              "Mahasiswa Informatika dengan pengalaman di content production dan media operation. Terbiasa bekerja dengan deadline, mengelola konten digital, serta menerjemahkan kebutuhan non-teknis menjadi output visual dan informasi yang terstruktur. Memiliki pengalaman mengajar, koordinasi tim, dan dokumentasi kegiatan skala institusi negara.",
            aboutTitle: "About – Adridinan Najmi Faza",
            aboutDesc: "Meet Adridinan Najmi Faza, Web Developer from Asia/Jakarta",
          },
          {
            locale: "en",
            name: "Adridinan Najmi Faza",
            role: "Web Developer",
            headline: "Passionate about EdTech & Social Impact",
            subline:
              "I'm Adridinan Najmi Faza, an undergraduate Informatics student at Universitas Jenderal Soedirman. I believe in technology with purpose - building systems that enable people.",
            intro:
              "Informatics student with experience in content production and media operation. Accustomed to working with deadlines, managing digital content, and translating non-technical requirements into visual and structured information output. Experienced in teaching, team coordination, and documentation of state institution scale activities.",
            aboutTitle: "About – Adridinan Najmi Faza",
            aboutDesc: "Meet Adridinan Najmi Faza, Web Developer from Asia/Jakarta",
          },
        ],
      },
    },
  });

  // 2. Social Links
  const socialLinks = [
    {
      name: "GitHub",
      icon: "github",
      link: "https://github.com/najmifaza",
      essential: true,
      order: 1,
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      link: "https://www.linkedin.com/in/adridinan-najmi-faza-80b88a301",
      essential: true,
      order: 2,
    },
    {
      name: "Instagram",
      icon: "instagram",
      link: "https://www.instagram.com/najmi.zaa/",
      essential: true,
      order: 3,
    },
    {
      name: "Email",
      icon: "email",
      link: "mailto:adridinan99@gmail.com",
      essential: true,
      order: 4,
    },
  ];

  await prisma.socialLink.deleteMany({ where: { profileId: "default" } });
  for (const s of socialLinks) {
    await prisma.socialLink.create({
      data: {
        profileId: "default",
        ...s,
      },
    });
  }

  // 3. Work & Organization Experiences
  const experiences = [
    {
      company: "Rumio.id",
      timeframe: "Juni 2026 - Present",
      order: 1,
      images: null,
      id_role: "Full-stack Web Developer",
      id_achievements: [
        "Mengembangkan platform eksplorasi dan pemasaran properti komprehensif menggunakan Next.js (App Router), Prisma ORM, dan Tailwind CSS.",
        "Mengimplementasikan fitur Virtual Tour 360° interaktif, sistem autentikasi aman dengan NextAuth, dashboard admin terintegrasi, dan CMS blog.",
        "Melakukan optimasi performa database untuk menghilangkan masalah N+1 query, serta menerapkan rate-limiting dan sanitasi XSS untuk meningkatkan keamanan platform.",
      ],
      en_role: "Full-stack Web Developer",
      en_achievements: [
        "Developed a comprehensive property exploration and marketing platform using Next.js (App Router), Prisma ORM, and Tailwind CSS.",
        "Implemented an interactive 360° Virtual Tour feature, secure authentication system with NextAuth, integrated admin dashboard, and blog CMS.",
        "Optimized database performance to eliminate N+1 query issues, and implemented rate-limiting and XSS sanitization to improve platform security.",
      ],
    },
    {
      company: "Panggih Sedulur",
      timeframe: "April 2026 - Present",
      order: 2,
      images: [
        {
          src: "/images/projects/project-01/panggihsedulur.webp",
          alt: "Panggih Sedulur's Website",
        },
      ],
      id_role: "IT Coordinator",
      id_achievements: [
        "Bertanggung jawab atas pengembangan dan pengelolaan platform web Panggih Sedulur yang terintegrasi langsung dengan sistem CRM dan database",
        "Mengimplementasikan fitur-fitur krusial termasuk Google Login, formulir kuisioner interaktif dengan branching logic, serta sistem rekomendasi personalized untuk Unit Kegiatan Mahasiswa (UKM) Unsoed.",
      ],
      en_role: "IT Coordinator",
      en_achievements: [
        "Responsible for the development and management of the Panggih Sedulur web platform which integrates directly with the CRM system and database.",
        "Implemented crucial features including Google Login, interactive questionnaire forms with branching logic, and personalized recommendation systems for Student Activity Units (UKM) at Unsoed.",
      ],
    },
    {
      company: "Badan Eksekutif Mahasiswa Universitas Jenderal Soedirman",
      timeframe: "Februari 2026 - Present",
      order: 3,
      images: [
        {
          src: "/images/projects/project-01/pelantikan-bem-u.webp",
          alt: "Pelantikan BEM-U 2026/2027",
        },
      ],
      id_role: "Web Development Staff",
      id_achievements: [
        "Mengelola dan mengembangkan website resmi BEM-U menggunakan WordPress, merancang tata letak halaman dengan Elementor, serta melakukan kustomisasi tingkat lanjut melalui inject HTML/CSS.",
        "Membangun ekosistem digital untuk mendukung komunikasi dan publikasi kegiatan BEM-U, termasuk pemesanan konten, dan pembuatan aplikasi shortlink untuk memudahkan akses informasi bagi mahasiswa.",
      ],
      en_role: "Web Development Staff",
      en_achievements: [
        "Managed and developed the official BEM-U website using WordPress, designed page layouts with Elementor, and performed advanced customization via HTML/CSS injections.",
        "Built a digital ecosystem to support communication and publication of BEM-U activities, including content ordering and creating a shortlink application to facilitate information access for students.",
      ],
    },
    {
      company: "Rabiha Tour & Travel",
      timeframe: "2025 - 2026",
      order: 4,
      images: [
        { src: "/images/projects/project-01/cover-01.webp", alt: "Rabiha's Instagram Project" },
      ],
      id_role: "Social Media Specialist",
      id_achievements: ["Mengelola konten dan tampilan media sosial perusahaan."],
      en_role: "Social Media Specialist",
      en_achievements: ["Managed company social media content and appearance."],
    },
    {
      company: "Media Center - Pondok Modern Tazakka",
      timeframe: "2024 - 2025",
      order: 5,
      images: [{ src: "/images/projects/project-01/cover-06.webp", alt: "Tim media center" }],
      id_role: "Staff Media",
      id_achievements: [
        "Mengelola, menyunting, dan mempublikasikan konten berita serta artikel pada website resmi pondok menggunakan WordPress.",
        "Bertanggung jawab penuh atas pengelolaan dokumentasi visual dan informasi kegiatan pondok.",
      ],
      en_role: "Media Staff",
      en_achievements: [
        "Managed, edited, and published news content and articles on the official boarding school website using WordPress.",
        "Fully responsible for managing visual documentation and information on boarding school activities.",
      ],
    },
    {
      company: "KMI - Pondok Modern Tazakka",
      timeframe: "2024 - 2025",
      order: 6,
      images: [{ src: "/images/projects/project-01/cover-07.webp", alt: "Guru KMI 2024/2025" }],
      id_role: "Pengajar",
      id_achievements: [
        "Mengajar dengan jadwal rutin (4x per minggu) dengan mapel Media Jurnalistik dan Grammar 3.",
        "Berperan dalam bimbingan akademik dan pengembangan karakter santri.",
      ],
      en_role: "Teacher",
      en_achievements: [
        "Taught with a routine schedule (4x per week) with Journalism Media and Grammar 3 subjects.",
        "Played a role in academic guidance and character development of students.",
      ],
    },
    {
      company: "PT Promedia Teknologi Indonesia (Melintas.id)",
      timeframe: "2025",
      order: 7,
      images: [
        { src: "/images/projects/project-01/cover-09.webp", alt: "Landing page at Melintas.Id" },
      ],
      id_role: "Web Content Writer",
      id_achievements: ["Berkontribusi sebagai staf penulis lepas pada platform media Melintas.id"],
      en_role: "Web Content Writer",
      en_achievements: ["Contributed as freelance writer staff on the Melintas.id media platform."],
    },
    {
      company: "OPPM (Organisasi Pelajar Pondok Modern)",
      timeframe: "2023 - 2024",
      order: 8,
      images: null,
      id_role: "Language Section - Secretary",
      id_achievements: [
        "Mengelola seluruh administrasi dan surat-menyurat Divisi Bahasa",
        "Menyusun Laporan Pertanggungjawaban (LPJ) program kerja tahunan.",
        "Menegakkan wajib berbahasa Arab dan Inggris kepada seluruh santri",
      ],
      en_role: "Language Section - Secretary",
      en_achievements: [
        "Managed all administration and correspondence of Language Division.",
        "Compiled annual work program Accountability Report.",
        "Enforced mandatory Arabic and English for all students.",
      ],
    },
    {
      company: "Seminar Nasional di MPR-RI - LAZIS Assalam Fil Alamin",
      timeframe: "Juli 2025",
      order: 9,
      images: [
        { src: "/images/projects/project-01/cover-05.webp", alt: "Gedung Nusantara V, MPR-RI" },
      ],
      id_role: "Jurnalis & Dokumenter",
      id_achievements: [
        "Bertanggung jawab dalam peliputan jurnalistik dan dokumentasi pada acara Seminar Nasional Pelepasan Duta Asfa yang diselenggarakan di MPR RI.",
        "Menyusun narasi berita dan mengelola aset dokumentasi visual untuk keperluan publikasi acara.",
      ],
      en_role: "Journalist & Documenter",
      en_achievements: [
        "Responsible for journalistic coverage and documentation at National Seminar.",
        "Drafted news narratives and managed visual documentation assets.",
      ],
    },
  ];

  await prisma.experience.deleteMany({ where: { profileId: "default" } });
  for (const exp of experiences) {
    await prisma.experience.create({
      data: {
        profileId: "default",
        company: exp.company,
        timeframe: exp.timeframe,
        order: exp.order,
        images: exp.images ? JSON.parse(JSON.stringify(exp.images)) : null,
        translations: {
          create: [
            {
              locale: "id",
              role: exp.id_role,
              achievements: exp.id_achievements,
            },
            {
              locale: "en",
              role: exp.en_role,
              achievements: exp.en_achievements,
            },
          ],
        },
      },
    });
  }

  // 4. Studies
  const studies = [
    {
      institution: "Universitas Jenderal Soedirman",
      timeframe: "2024 - Sekarang",
      order: 1,
      id_degree: "S1 Informatika",
      id_desc: "Bachelor of Informatics Engineering",
      en_degree: "Bachelor of Informatics Engineering",
      en_desc: "Undergraduate student focusing on web engineering and information systems.",
    },
    {
      institution: "Pondok Modern Tazakka",
      timeframe: "2018 - 2024",
      order: 2,
      id_degree: "KMI Curriculum Graduate",
      id_desc: "High school based on KMI curriculum",
      en_degree: "KMI Curriculum Graduate",
      en_desc: "High school based on KMI curriculum with intensive language & leadership training.",
    },
  ];

  await prisma.study.deleteMany({ where: { profileId: "default" } });
  for (const st of studies) {
    await prisma.study.create({
      data: {
        profileId: "default",
        institution: st.institution,
        timeframe: st.timeframe,
        order: st.order,
        translations: {
          create: [
            { locale: "id", degree: st.id_degree, description: st.id_desc },
            { locale: "en", degree: st.en_degree, description: st.en_desc },
          ],
        },
      },
    });
  }

  // 5. Technical Skill Groups
  const skillGroups = [
    {
      title: "Modern Web Development",
      order: 1,
      skills: [
        { name: "Next.js", icon: "nextjs" },
        { name: "React", icon: "javascript" },
        { name: "TypeScript", icon: "javascript" },
        { name: "Tailwind CSS", icon: "css" },
        { name: "Shadcn/UI", icon: "figma" },
      ],
      id_desc:
        "Berpengalaman dalam membangun aplikasi web modern yang responsif, cepat, dan scalable menggunakan ekosistem React terbaru.",
      en_desc:
        "Experienced in building responsive, fast, and scalable modern web applications using the latest React ecosystem.",
    },
    {
      title: "Backend & Infrastructure",
      order: 2,
      skills: [
        { name: "Supabase", icon: "supabase" },
        { name: "PostgreSQL", icon: "postgree" },
        { name: "MySQL", icon: "document" },
        { name: "Zod", icon: "document" },
        { name: "GitHub", icon: "github" },
      ],
      id_desc:
        "Mengelola database dan otentikasi menggunakan solusi cloud modern serta memastikan integritas data dengan skema yang kuat.",
      en_desc:
        "Managing database and authentication using modern cloud solutions and ensuring data integrity with robust schemas.",
    },
    {
      title: "Editing & Design",
      order: 3,
      skills: [
        { name: "Adobe Photoshop", icon: "Adobephotoshop" },
        { name: "Adobe Premierepro", icon: "Adobepremierepro" },
        { name: "Adobe Lightroom", icon: "Adobelightroom" },
        { name: "Coreldraw", icon: "Coreldraw" },
      ],
      id_desc:
        "Ahli dalam pembuatan konten visual, mulai dari desain hingga editing video dan dokumentasi kegiatan institusi.",
      en_desc:
        "Expert in visual content creation, from design to video editing and documentation of institutional activities.",
    },
  ];

  await prisma.skillGroup.deleteMany({ where: { profileId: "default" } });
  for (const sg of skillGroups) {
    await prisma.skillGroup.create({
      data: {
        profileId: "default",
        title: sg.title,
        order: sg.order,
        skills: sg.skills,
        translations: {
          create: [
            { locale: "id", title: sg.title, description: sg.id_desc },
            { locale: "en", title: sg.title, description: sg.en_desc },
          ],
        },
      },
    });
  }

  // 6. Certificates
  const certificates = [
    {
      title: "Data Classification and Summarization with IBM Granite",
      issuer: "IBM SkillsBuild & Hacktiv4",
      date: "Oct 2025",
      image: "/images/licenses/IBMData.png",
      url: "https://www.credly.com/badges/8a96daae-43d7-4b68-b44f-bfa5c740ae8e/public_url",
      order: 1,
    },
    {
      title: "Soedirman Digital School 2025 – Web Development Program",
      issuer: "BEM-U",
      date: "Nov 2025",
      image: "/images/licenses/SDSWeb.png",
      order: 2,
    },
    {
      title: "Basic Artificial Intelligence Certificate",
      issuer: "Dicoding Indonesia",
      date: "Nov 2025",
      image: "/images/licenses/BasicAI.png",
      url: "https://www.dicoding.com/certificates/ERZR2DVO2PYV",
      order: 3,
    },
    {
      title: "Basic Web Programming Certificate",
      issuer: "Dicoding Indonesia",
      date: "Dec 2025",
      image: "/images/licenses/DasarPemWeb.png",
      url: "https://www.dicoding.com/certificates/JMZVV7L53ZN9",
      order: 4,
    },
    {
      title: "Basic JavaScript Programming Certificate",
      issuer: "Dicoding Indonesia",
      date: "Jan 2026",
      image: "/images/licenses/JSprogramming.png",
      url: "https://www.dicoding.com/certificates/RVZKGN0YOXD5",
      order: 5,
    },
    {
      title: "Front-End Web Development Certificate",
      issuer: "Dicoding Indonesia",
      date: "Jan 2026",
      image: "/images/licenses/FE_DEV_DICODING.png",
      url: "https://www.dicoding.com/certificates/L4PQ2DY72ZO1",
      order: 6,
    },
  ];

  await prisma.certificate.deleteMany({ where: { profileId: "default" } });
  for (const cert of certificates) {
    await prisma.certificate.create({
      data: {
        profileId: "default",
        ...cert,
      },
    });
  }

  // 7. Projects from MDX files (if present during initial setup)
  const projectsDir = path.join(process.cwd(), "src", "app", "project", "projects");
  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir);

    const parseFrontmatter = (raw: string) => {
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!match) return { data: {} as Record<string, any>, content: raw };
      const yaml = match[1];
      const content = match[2];
      const data: Record<string, any> = {};
      for (const line of yaml.split("\n")) {
        const colon = line.indexOf(":");
        if (colon > 0) {
          const key = line.slice(0, colon).trim();
          const val = line
            .slice(colon + 1)
            .trim()
            .replace(/^["']|["']$/g, "");
          data[key] = val;
        }
      }
      return { data, content };
    };

    // Group files by base slug (e.g. 'CheatSheet-Tailwind' from 'CheatSheet-Tailwind.id.mdx')
    const projectMap: Record<string, { idFile?: string; enFile?: string }> = {};

    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      if (file.endsWith(".id.mdx")) {
        const slug = file.replace(".id.mdx", "");
        projectMap[slug] = { ...projectMap[slug], idFile: file };
      } else if (file.endsWith(".en.mdx")) {
        const slug = file.replace(".en.mdx", "");
        projectMap[slug] = { ...projectMap[slug], enFile: file };
      }
    }

    let projectOrder = 1;
    for (const [slug, pair] of Object.entries(projectMap)) {
      const idPath = pair.idFile ? path.join(projectsDir, pair.idFile) : null;
      const enPath = pair.enFile ? path.join(projectsDir, pair.enFile) : null;

      const idContent = idPath ? fs.readFileSync(idPath, "utf-8") : null;
      const enContent = enPath ? fs.readFileSync(enPath, "utf-8") : null;

      const idParsed = idContent ? parseFrontmatter(idContent) : null;
      const enParsed = enContent ? parseFrontmatter(enContent) : null;

      const metadata = idParsed?.data || enParsed?.data || {};

      const images: string[] = [];
      if (Array.isArray(metadata.images)) {
        images.push(...metadata.images);
      } else if (typeof metadata.image === "string") {
        images.push(metadata.image);
      }

      const publishedAt = metadata.publishedAt ? new Date(metadata.publishedAt) : new Date();

      const project = await prisma.project.upsert({
        where: { slug },
        update: {
          link: metadata.link || null,
          github: metadata.github || null,
          images: images,
          publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
          order: projectOrder++,
        },
        create: {
          slug,
          link: metadata.link || null,
          github: metadata.github || null,
          images: images,
          publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
          order: projectOrder++,
        },
      });

      if (idParsed) {
        await prisma.projectTranslation.upsert({
          where: {
            projectId_locale: {
              projectId: project.id,
              locale: "id",
            },
          },
          update: {
            title: idParsed.data.title || slug,
            summary: idParsed.data.summary || "",
            content: idParsed.content,
          },
          create: {
            projectId: project.id,
            locale: "id",
            title: idParsed.data.title || slug,
            summary: idParsed.data.summary || "",
            content: idParsed.content,
          },
        });
      }

      if (enParsed) {
        await prisma.projectTranslation.upsert({
          where: {
            projectId_locale: {
              projectId: project.id,
              locale: "en",
            },
          },
          update: {
            title: enParsed.data.title || slug,
            summary: enParsed.data.summary || "",
            content: enParsed.content,
          },
          create: {
            projectId: project.id,
            locale: "en",
            title: enParsed.data.title || slug,
            summary: enParsed.data.summary || "",
            content: enParsed.content,
          },
        });
      }
      console.log(`Seeded project: ${slug}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
