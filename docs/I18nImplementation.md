# 🌐 Implementation Plan: Bilingual Support (ID/EN) untuk NajmiFolio

## Analisis Arsitektur Saat Ini

Berdasarkan review codebase:

| Aspek              | Detail                                                        |
| ------------------ | ------------------------------------------------------------- |
| **Framework**      | Next.js 16 (App Router)                                       |
| **Content Source** | `src/resources/content.tsx` — semua teks statis (hardcoded)   |
| **UI Library**     | Once UI System                                                |
| **Routing**        | Flat routes (`/`, `/about`, `/project`, `/blog`, `/licenses`) |
| **MDX Content**    | Blog posts & project pages sebagai `.mdx` files               |

> [!IMPORTANT]
> Semua teks UI saat ini **hardcoded** di `content.tsx` — ini sebenarnya mempermudah implementasi i18n karena sudah terpusat di satu file.

---

## 3 Opsi Pendekatan

### Opsi A: 🏆 Dictionary Pattern (Recommended)

**Tanpa library tambahan, tanpa perubahan routing**

Pendekatan paling ringan. Memecah `content.tsx` menjadi dictionary per-bahasa, lalu toggle via cookie/localStorage.

| Pro                                 | Kontra                                |
| ----------------------------------- | ------------------------------------- |
| ✅ Tidak perlu install library baru | ⚠️ URL tidak berubah (no `/en/about`) |
| ✅ Minimal perubahan struktur       | ⚠️ SEO per-bahasa kurang optimal      |
| ✅ Mudah di-maintain                |                                       |
| ✅ Build time tetap cepat           |                                       |

**Cocok untuk:** Portfolio pribadi yang prioritasnya UX, bukan SEO multi-bahasa.

---

### Opsi B: Next.js Built-in i18n (Subdirectory Routing)

**URL-based language switching: `/en/about`, `/id/about`**

Menggunakan `[locale]` dynamic segment di App Router.

| Pro                                              | Kontra                                          |
| ------------------------------------------------ | ----------------------------------------------- |
| ✅ SEO optimal (setiap bahasa punya URL sendiri) | ⚠️ Harus refactor SEMUA route ke `[locale]/...` |
| ✅ Google bisa index kedua bahasa                | ⚠️ Perlu middleware untuk redirect              |
| ✅ `hreflang` tags otomatis                      | ⚠️ Cukup banyak file yang harus dipindah        |

**Cocok untuk:** Jika ingin ranking SEO di Google untuk English AND Indonesian keywords.

---

### Opsi C: Library `next-intl`

**Full-featured i18n solution**

| Pro                                                 | Kontra                      |
| --------------------------------------------------- | --------------------------- |
| ✅ Fitur paling lengkap (pluralization, formatting) | ⚠️ Dependency baru          |
| ✅ Type-safe translations                           | ⚠️ Learning curve           |
| ✅ Server Component support                         | ⚠️ Overkill untuk portfolio |

**Cocok untuk:** Aplikasi besar dengan banyak halaman dan konten dinamis.

---

## ✅ Rekomendasi: Opsi A (Dictionary Pattern)

Untuk portfolio pribadi, **Opsi A** paling masuk akal karena:

1. Tidak menambah complexity
2. Tidak perlu install apa-apa
3. Perubahan terpusat di `content.tsx` + 1 context provider + 1 toggle button

---

## Rencana Implementasi (Opsi A)

### Step 1: Buat Translation Files

```
src/resources/
├── i18n/
│   ├── id.tsx    ← konten Bahasa Indonesia (copy dari content.tsx saat ini)
│   └── en.tsx    ← konten Bahasa Inggris (terjemahan)
├── content.tsx   ← menjadi "router" yang memilih bahasa aktif
└── ...
```

### Step 2: Buat Language Context

File baru: `src/components/LanguageProvider.tsx`

- React Context untuk state bahasa aktif (`id` | `en`)
- Simpan preferensi di `localStorage`
- Hook `useLanguage()` untuk akses di seluruh app

### Step 3: Buat Language Toggle Component

- Tombol toggle `ID | EN` di Header (sebelah ThemeToggle)
- Animasi smooth saat switch

### Step 4: Update `content.tsx`

- Import dari `i18n/id.tsx` atau `i18n/en.tsx` berdasarkan bahasa aktif
- Export tetap sama (`person`, `home`, `about`, dll.)

### Step 5: Handle MDX Content (Blog/Project)

- Untuk MDX: buat versi bilingual dengan frontmatter `locale: "id"` / `locale: "en"`
- Atau: simpan MDX hanya dalam satu bahasa (karena project description biasanya teknis/English)

---

## Estimasi Perubahan

| File                                  | Aksi                                    |
| ------------------------------------- | --------------------------------------- |
| `src/resources/i18n/id.tsx`           | **Baru** — konten Indonesia             |
| `src/resources/i18n/en.tsx`           | **Baru** — konten English               |
| `src/resources/content.tsx`           | **Edit** — jadi language router         |
| `src/components/LanguageProvider.tsx` | **Baru** — context + hook               |
| `src/components/LanguageToggle.tsx`   | **Baru** — tombol switch                |
| `src/components/Header.tsx`           | **Edit** — tambah LanguageToggle        |
| `src/app/layout.tsx`                  | **Edit** — wrap dengan LanguageProvider |

---

## Pertanyaan untuk Kamu

> [!NOTE]
> Sebelum mulai implementasi, tolong jawab:

1. **Mau pakai opsi mana?** A (Dictionary), B (URL-based), atau C (next-intl)?
2. **Bahasa default** yang mana? Indonesia atau English?
3. **MDX content (project/blog)** perlu diterjemahkan juga, atau cukup UI text saja?
4. **Posisi toggle** di Header, atau mau di tempat lain (footer, dropdown)?
