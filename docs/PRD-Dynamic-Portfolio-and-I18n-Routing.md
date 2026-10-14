# Product Requirements Document (PRD)
## Migrasi Portofolio Dinamis (Prisma ORM & MySQL) & Arsitektur i18n URL Routing

- **Versi:** 1.0.0
- **Penulis:** Najmi Faza & Assistant
- **Status:** Approved / Planning
- **Target Platform:** Next.js App Router (v16), Prisma ORM, MySQL Database, Once UI System

---

## 1. Latar Belakang & Masalah
Saat ini portofolio pribadi Najmi Faza menyimpan konten secara statis di:
1. File konfigurasi TypeScript (`src/resources/i18n/id.tsx` dan `en.tsx`).
2. File MDX lokal (`src/app/project/projects/*.mdx`).

Sistem internasionalisasi (i18n) masih mengandalkan cookie murni di sisi browser (`NEXT_LOCALE`), tanpa mengubah struktur path URL. Hal ini mengakibatkan:
- **Keterbatasan SEO Internasional:** Mesin pencari (Googlebot) tidak dapat mengindeks konten bahasa Inggris secara terpisah karena tidak memiliki URL publik permanen seperti `/en`.
- **Pengunjung Luar Negeri:** Pengunjung internasional yang mengakses root domain tidak otomatis diarahkan ke versi bahasa Inggris berdasarkan preferensi bahasa browser (`Accept-Language`).
- **Skalabilitas Konten Rendah:** Setiap penambahan project atau perubahan profil mewajibkan commit Git, editing file MDX lokal, dan rebuild aplikasi secara penuh.

---

## 2. Tujuan & Sasaran (Objectives & Key Results)
1. **Dinamisasi Konten:** Memindahkan data portofolio (Projects, Profile/About, Skills, Experience, Social Links) ke database MySQL yang terhubung via Prisma ORM.
2. **Standar Industri Routing i18n:**
   - Bahasa default (ID): `/` dan sub-path reguler (atau `/id`).
   - Bahasa Inggris (EN): Prefix terisolasi `/en/...` (contoh: `/en`, `/en/project`, `/en/project/[slug]`).
3. **Deteksi Otomatis Pengunjung Luar Negeri:** Next.js Middleware otomatis membaca header `Accept-Language` dan cookie preferensi untuk mengarahkan pengguna luar negeri ke rute `/en`.
4. **Optimasi SEO Multi-Bahasa:**
   - Penerapan tag `<link rel="alternate" hreflang="..." />` di setiap halaman.
   - Sitemap XML dinamis mencakup URL kedua bahasa lengkap dengan anotasi `xhtml:link`.
   - Metadata OpenGraph dan canonical URL yang independen per locale.

---

## 3. Arsitektur Teknis

### 3.1 Tech Stack
- **Framework:** Next.js 16 (App Router, Server Components, Server Actions).
- **Internationalization (i18n):** `next-intl` (Official industry standard for Next.js App Router).
- **ORM:** Prisma v6+.
- **Database:** MySQL 8.x / MariaDB (koneksi via `DATABASE_URL` di `.env`).
- **CDN / Media Asset Storage:** Eksternal Asset Uploader (`https://assets.najmifaza.my.id/`) via Bearer Token.
- **Auto-Translation Engine:** Server Action + Translation Service (Google Translate / DeepL / LLM) untuk otomatisasi `id` -> `en`.
- **Styling & UI:** Once UI Design System, SCSS Modules.
- **Markdown Renderer:** `next-mdx-remote` / unified processor untuk rendering konten artikel/proyek dari database.

### 3.2 Strategi Routing & Middleware i18n via `next-intl`
- **Routing Configuration (`localePrefix: 'as-needed'`):**
  - Bahasa default (ID): `/` dan sub-path reguler tanpa prefix.
  - Bahasa alternatif (EN): `/en/...` (contoh: `/en`, `/en/project`, `/en/project/[slug]`).
- **Routing Engine (`src/middleware.ts`):**
  - Menggunakan `createMiddleware` dari `next-intl/middleware`.
  - Otomatis memeriksa cookie preferensi dan header `Accept-Language` browser (pengunjung luar negeri otomatis diarahkan ke `/en`).
  - Bot mesin pencari (crawlers) diizinkan membaca path tanpa redirect paksa untuk pengindeksan lengkap.
- **Navigation & Switcher:**
  - Navigasi antar halaman menggunakan `Link` dan `useRouter` / `usePathname` yang dibungkus oleh `createNavigation(routing)` dari `next-intl`.
  - Tombol switch ID/EN di `LanguageToggle.tsx` memicu transisi URL instan (`/project/slug` <-> `/en/project/slug`).

### 3.3 Skema Database Prisma Lengkap (Full Dynamic Portfolio)

Semua konten web (Profil, Hero/Home, About, Experience, Studies, Technical Skills, Social Links, Projects) dibuat dinamis dan multi-bahasa via MySQL:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Profil & Person Data
model Profile {
  id           String               @id @default("default")
  avatar       String               // URL avatar (bisa CDN assets.najmifaza.my.id)
  email        String
  location     String               // "Asia/Jakarta"
  languages    Json                 // ["English", "Indonesian", "Arabic"]
  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @updatedAt
  translations ProfileTranslation[]
  socialLinks  SocialLink[]
  experiences  Experience[]
  studies      Study[]
  skills       SkillGroup[]
}

model ProfileTranslation {
  id          String   @id @default(cuid())
  profileId   String
  locale      String   // "id" | "en"
  name        String
  role        String   // "Web Developer"
  headline    String   @db.Text // "Passionate about EdTech & Social Impact"
  subline     String   @db.Text
  intro       String   @db.LongText
  aboutTitle  String?
  aboutDesc   String?  @db.Text
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@unique([profileId, locale])
  @@index([locale])
}

// 2. Social Links
model SocialLink {
  id        String   @id @default(cuid())
  profileId String
  name      String   // "GitHub", "LinkedIn", "Instagram", "Email"
  icon      String   // "github", "linkedin", "instagram", "email"
  link      String
  essential Boolean  @default(true)
  order     Int      @default(0)
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

// 3. Experience (Organisasi / Kerja)
model Experience {
  id           String                  @id @default(cuid())
  profileId    String
  company      String
  timeframe    String                  // "Juni 2026 - Present"
  order        Int                     @default(0)
  images       Json?                   // array gambar cover/dokumentasi
  profile      Profile                 @relation(fields: [profileId], references: [id], onDelete: Cascade)
  translations ExperienceTranslation[]
}

model ExperienceTranslation {
  id           String     @id @default(cuid())
  experienceId String
  locale       String     // "id" | "en"
  role         String
  achievements Json       // array string poin pencapaian
  experience   Experience @relation(fields: [experienceId], references: [id], onDelete: Cascade)

  @@unique([experienceId, locale])
}

// 4. Studies / Edukasi
model Study {
  id           String             @id @default(cuid())
  profileId    String
  institution  String             // "Universitas Jenderal Soedirman"
  timeframe    String             // "2024 - Sekarang"
  order        Int                @default(0)
  images       Json?
  profile      Profile            @relation(fields: [profileId], references: [id], onDelete: Cascade)
  translations StudyTranslation[]
}

model StudyTranslation {
  id          String   @id @default(cuid())
  studyId     String
  locale      String   // "id" | "en"
  degree      String   // "S1 Informatika"
  description String   @db.Text
  study       Study    @relation(fields: [studyId], references: [id], onDelete: Cascade)

  @@unique([studyId, locale])
}

// 5. Technical Skills
model SkillGroup {
  id        String   @id @default(cuid())
  profileId String
  title     String   // "Frontend", "Backend", "Tools"
  order     Int      @default(0)
  skills    Json     // ["React", "Next.js", "TypeScript", "Tailwind CSS"]
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

// 6. Projects & Translations
model Project {
  id           String               @id @default(cuid())
  slug         String               @unique
  link         String?
  github       String?
  featured     Boolean              @default(false)
  order        Int                  @default(0)
  images       Json                 // Array URL gambar
  publishedAt  DateTime
  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @updatedAt
  translations ProjectTranslation[]
}

model ProjectTranslation {
  id        String   @id @default(cuid())
  projectId String
  locale    String   // "id" | "en"
  title     String
  summary   String   @db.Text
  content   String   @db.LongText // MDX / Markdown
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, locale])
  @@index([locale])
}
```

### 3.4 Mekanisme Single-Language Input & Auto-Translation
Untuk mempermudah input di CMS tanpa harus menulis dua kali:
1. **Input Tunggal (ID First):** Admin cukup mengisi konten dalam bahasa Indonesia (Title, Summary, Content MDX).
2. **Auto-Translation Pipeline:**
   - Server Action di CMS mendeteksi jika field bahasa Inggris dibiarkan kosong.
   - Layanan translator otomatis menerjemahkan teks Indonesia ke bahasa Inggris.
   - Hasil terjemahan otomatis disimpan ke tabel `ProjectTranslation` dengan `locale = "en"`.
   - Admin tetap memiliki opsi override manual jika ingin menyesuaikan kata-kata terjemahan.
3. **Graceful Fallback:**
   - Jika service translator mengalami kendala (misal limit/timeout), query frontend secara otomatis mengembalikan versi `id` agar halaman `/en/...` tidak kosong atau error.

### 3.5 Spesifikasi CMS Dashboard Admin (`/admin`)
Untuk memfasilitasi penambahan dan pengubahan konten tanpa menyentuh database manual:
1. **Autentikasi & Proteksi Akses:**
   - Rute `/admin` dilindungi oleh session cookie `authToken`.
   - Login page meminta password (`PAGE_ACCESS_PASSWORD` dari `.env.local`).
   - Sesi terlindungi via middleware & Server Actions, tombol logout untuk clear cookie.
2. **Manajemen Proyek (`/admin/projects`):**
   - Daftar proyek dengan fitur reorder, edit, dan delete.
   - Form pembuatan/pengeditan proyek:
     - Slug unik, URL demo, URL GitHub, status featured.
     - Media uploader: Upload file langsung ke CDN `assets.najmifaza.my.id` dan simpan URL CDN ke list `images`.
     - Editor konten (Title, Summary, Markdown Content) dalam bahasa Indonesia.
     - Auto-translate trigger: Tombol otomatis menerjemahkan Title, Summary, dan Content ke bahasa Inggris sebelum simpan.
     - Tab editor manual untuk penyesuaian konten bahasa Inggris (`en`).
3. **Manajemen Profil & About (`/admin/profile`):**
   - Edit identitas: Nama, Role, Headline, Intro, Avatar (upload CDN), Email, Lokasi, dan Bahasa.
   - Manajemen Social Links (tambah/edit/hapus link GitHub, LinkedIn, dsb.).
4. **Manajemen Pengalaman & Sertifikat (`/admin/experiences` & `/admin/certificates`):**
   - CRUD Pengalaman Organisasi & Kerja (perusahaan, timeframe, role, achievements).
   - CRUD Lisensi & Sertifikat (judul, penerbit, tanggal, upload sertifikat ke CDN, URL kredensial).

---

## 4. Kebutuhan SEO & Metadata Internasional

1. **Tag Alternates (Hreflang):**
   Setiap Server Component halaman (`page.tsx`) mengimplementasikan `generateMetadata`:
   ```typescript
   export async function generateMetadata({ params }): Promise<Metadata> {
     const { locale = "id", slug } = await params;
     const baseUrl = "https://najmifaza.com";
     const basePath = slug ? `/project/${slug}` : "";

     return {
       alternates: {
         canonical: locale === "en" ? `${baseUrl}/en${basePath}` : `${baseUrl}${basePath}`,
         languages: {
           "id-ID": `${baseUrl}${basePath}`,
           "en-US": `${baseUrl}/en${basePath}`,
           "x-default": `${baseUrl}/en${basePath}`, // fallback internasional
         },
       },
     };
   }
   ```
2. **Sitemap Dinamis (`src/app/sitemap.ts`):**
   - Mengambil seluruh project dari Prisma DB.
   - Menghasilkan URL pasangan `/project/{slug}` dan `/en/project/{slug}` dengan anotasi `xhtml:link`.
3. **HTML Attribute:**
   - Root Layout menentukan atribut `<html lang={locale}>` dinamis sesuai parameter locale rute aktif.

---

### 5. Tahapan Implementasi & Refactoring (Roadmap)

### Fase 0: Integrasi Media Uploader (`assets.najmifaza.my.id`)
1. Tambahkan environment variable di `.env.local` (jangan commit ke VCS / dokumen publik):
   - `ASSETS_UPLOAD_URL="https://assets.najmifaza.my.id/"`
   - `ASSETS_BEARER_TOKEN="your_token_here"`
2. Buat utility uploader `src/lib/assetsUploader.ts` (mengunggah file media lewat `FormData` via Node.js/Server Actions ke layanan asset eksternal).
3. Buat skrip migrasi untuk membaca gambar lokal di `public/images/projects/` dan mengunggahnya secara batch ke CDN `assets.najmifaza.my.id`, kemudian memperbarui path URL menjadi URL CDN publik.

### Fase 1: Setup Prisma & Migrasi Skema
1. Install dependensi: `npm install @prisma/client` dan `npm install -D prisma`.
2. Inisialisasi skema Prisma di folder `prisma/schema.prisma`.
3. Sinkronisasi skema ke database MySQL lokal (`npx prisma db push` atau `npx prisma migrate dev`).
4. Buat Prisma client singleton di `src/lib/prisma.ts`.

### Fase 2: Skrip Data Seeder (Migration MDX & JSON ke DB)
1. Buat skrip `prisma/seed.ts`.
2. Parsing seluruh file MDX yang ada di `src/app/project/projects/*.mdx` menggunakan `gray-matter`.
3. Masukkan data profil, project, dan terjemahan (`id` dan `en`) ke database MySQL secara otomatis.
4. Verifikasi konsistensi data di database (menggunakan Prisma Studio / CLI).

### Fase 3: Routing i18n & Middleware via `next-intl`
1. Install `next-intl`.
2. Buat konfigurasi i18n routing di `src/i18n/routing.ts` (`locales: ['id', 'en']`, `defaultLocale: 'id'`, `localePrefix: 'as-needed'`).
3. Setup `src/middleware.ts` menggunakan middleware bawaan `next-intl`.
4. Wrap routing navigasi (`Link`, `useRouter`, `usePathname`) di `src/i18n/navigation.ts`.
5. Update `LanguageToggle.tsx` agar mengganti path URL dengan locale baru.

### Fase 4: Refactor Data Fetching Halaman
1. Buat service query data di `src/services/projectService.ts` dan `src/services/profileService.ts`.
2. Ubah `src/app/[locale]/project/page.tsx` dan `src/app/[locale]/project/[slug]/page.tsx` untuk mengambil data langsung dari Prisma.
3. Berikan fallback aman (*graceful error handling*) jika database mengalami kendala timeout.

### Fase 5: Optimasi SEO, Build Check & Verifikasi
1. Update `src/app/sitemap.ts` dan metadata `robots.ts`.
2. Jalankan audit build: `npm run lint` dan `npm run build`.
3. Uji alur pengunjung lokal (Indonesia) vs luar negeri (simulasi header `Accept-Language: en-US`).

### Fase 6: Implementasi CMS Dashboard Admin (`/admin`)
1. Buat halaman login & proteksi auth di `/admin/login` dan middleware route guard `/admin/*`.
2. Buat layout dashboard admin dengan navigasi: Projects, Profile, Experiences, Certificates.
3. Buat Server Actions CRUD:
   - Proyek (`createProject`, `updateProject`, `deleteProject`).
   - Profil & Sosmed (`updateProfile`, `updateSocialLinks`).
   - Pengalaman & Lisensi (`saveExperience`, `deleteExperience`, `saveCertificate`, `deleteCertificate`).
4. Integrasikan uploader form media langsung ke `src/lib/assetsUploader.ts` (CDN `assets.najmifaza.my.id`).
5. Integrasikan tombol Auto-Translate ID -> EN di form edit/create menggunakan `autoTranslate`.

---

## 6. Risiko & Rencana Mitigasi
- **Risiko:** Database timeout membuat halaman blank / crash.
  - **Mitigasi:** Gunakan Next.js Incremental Static Regeneration (ISR) / `revalidate` cache pada fungsi data fetching, dan sediakan komponen fallback (`error.tsx`).
- **Risiko:** Duplicate Content Issue di Google Search Console karena transisi rute `/en`.
  - **Mitigasi:** Pemasangan tag `canonical` dan `hreflang` self-referencing yang ketat pada `generateMetadata`.
