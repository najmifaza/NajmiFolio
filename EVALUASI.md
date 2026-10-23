# Evaluasi Proyek — magic-portfolio-next.js (Najmi Folio)

**Stack:** Next.js 16.1.1 (App Router) · React 19 · Prisma 6 + Supabase PostgreSQL · CMS admin custom
**Tanggal evaluasi:** 23 Oktober 2026

**Ringkasan:** fitur lengkap, tapi ada 3 lubang auth yang membuat CMS bisa dibobol, plus route tree dobel.

---

## 🔴 KRITIS — Keamanan

### 1. Fallback secret hardcoded (`src/lib/auth.ts:3`)

```ts
const SECRET_KEY = process.env.PAGE_ACCESS_PASSWORD || "najmi-cms-secret-key-2026";
```

Kalau env hilang/kosong di deploy, token bisa diforge siapa saja. **Fail-open.** Harus `throw`, bukan fallback.

### 2. Token tidak bisa direvoke (`src/lib/auth.ts:15,41`)

Token = `HMAC(timestamp)` saja, tanpa nonce/session id. Konsekuensi:

- tidak bisa revoke
- satu token berlaku 7 hari
- semua login pada milidetik sama dapat token identik
- tidak ada logout server-side — `DELETE /api/authenticate` hanya hapus cookie klien, token tetap valid kalau dicuri

### 3. Skema auth tidak konsisten (`src/app/api/check-auth/route.ts:8`)

```ts
if (cookies.authToken === "authenticated") { ... }
```

Sedangkan token asli berformat `timestamp.hmac`. Endpoint ini **selalu 401 untuk user valid** → `RouteGuard` memakai endpoint ini, jadi proteksi klien mati.

Ditambah `protectedRoutes` berisi typo: `"/project/nnama"` (`src/resources/once-ui.config.ts:33`).

### 4. Brute-force bebas (`src/app/api/authenticate/route.ts:15`)

```ts
if (password === correctPassword)
```

Tanpa rate limit, tanpa constant-time compare, tanpa lockout / attempt counter di login page.

### 5. SSRF guard bocor (`src/lib/ssrf.ts`, `src/app/api/og/proxy/route.ts`)

- Cek hostname string saja, tanpa DNS resolve → **DNS rebinding lolos**
- `fetch()` default `redirect: "follow"` → URL publik yang 302 ke `http://169.254.169.254` lolos filter sepenuhnya
- Tidak blok `100.64.0.0/10`, `0.0.0.0/8` (hanya `o1 === 0`), bentuk IP desimal/hex, `::ffff:127.0.0.1`
- Proxy tanpa batas ukuran & validasi content-type → memory DoS + open proxy

### 6. Middleware bypass via titik (`src/middleware.ts:13`)

```ts
pathname.includes(".")
```

Path ber-titik seperti `/admin/x.y` lolos guard admin. Saat ini aman hanya karena `src/app/admin/page.tsx:10` verifikasi ulang — footgun.

### 7. Server action tanpa auth (`src/app/admin/actions.ts:21`)

`translateAction` tidak memanggil `verifyAuth()`. Semua action lain dicek. Anonim bisa membakar kuota MyMemory.

### 8. Body limit global 50 MB (`next.config.mjs:24`)

```js
serverActions: { bodySizeLimit: "50mb" }
```

Permukaan DoS upload. Turunkan ke ukuran realistis, dan validasi tipe file di `assetsUploader.ts` (sekarang hanya menebak dari ekstensi).

---

## 🟠 SEDANG — Correctness

### 9. OG image selalu locale `id` (`src/app/api/og/generate/route.tsx:8`)

`getDictionary()` dipanggil tanpa argumen → OG image di `/en` tetap Bahasa Indonesia.

### 10. Data team di-hardcode (`src/services/projectService.ts:91-98`)

Objek `team` ditulis langsung di service, bukan dari DB. Schema Prisma tidak punya model team. Jadi klaim "dynamic CMS" separuh palsu.

### 11. Cache in-memory tidak konsisten

- `contentService.ts` memakai `globalThis`
- `projectService.ts:27` memakai modul-level const

Di Vercel multi-instance, `invalidateContentCache()` hanya membersihkan instance yang menerima request → edit CMS bisa tidak muncul sampai TTL habis.

### 12. Supabase URL ditebak dari `DATABASE_URL` (`src/lib/assetsUploader.ts:13-19`)

```ts
const match = dbUrl.match(/postgres(?:ql)?:\/\/postgres\.([a-z0-9]+):/i);
if (match?.[1]) supabaseUrl = `https://${match[1]}.supabase.co`;
```

Hack rapuh, menimpa `NEXT_PUBLIC_SUPABASE_URL`, patah kalau DB bukan Supabase.

### 13. Hostname Supabase hardcoded (`next.config.mjs:15`)

`remotePatterns` di-pin ke satu project ref. Pindah project = gambar mati.

---

## 🟡 ARSITEKTUR

### 14. Route tree dobel

- `src/app/page.tsx` (846 LOC total)
- `src/app/[locale]/page.tsx` (912 LOC total)

Logika sama, metadata beda. Dua tempat update tiap perubahan → drift sudah terjadi.

### 15. `next-intl` terpasang tapi 0 referensi

i18n dikerjakan manual: cookie `NEXT_LOCALE` + redirect middleware + `[locale]`. Pakai satu mekanisme saja.

### 16. `AdminDashboard.tsx` 2935 baris

Satu client component raksasa. Tidak bisa di-review, tidak bisa di-test.

### 17. `actions.ts` 792 baris tanpa type safety

`model: any` di `reorderEntities` (`:54`), dan biome `noExplicitAny: "off"`. Nol type safety di lapisan tulis data.

---

## ⚪ HYGIENE

| # | Temuan | Lokasi |
|---|---|---|
| 18 | Nol test, tidak ada script `test` | `package.json` |
| 19 | `"lint": "next lint"` — dihapus di Next 16, `npm run lint` gagal (`Invalid project directory ... \lint`). `"export": "next export"` juga mati | `package.json` |
| 20 | Tidak ada security headers — no CSP, X-Frame-Options, HSTS | `next.config.mjs` |
| 21 | File sampah di root (untracked): `CV_Adridinan_Najmi_Faza.docx`, `avatar_cv.png`, `generate_cv_docx.py` | root |
| 22 | `typeRoots: ["./types", ...]` — folder `types/` tidak ada | `tsconfig.json` |
| 23 | `.env.example` tidak lengkap: kode membaca `SUPABASE_URL`, `ASSETS_UPLOAD_URL`, `ASSETS_BEARER_TOKEN` | `.env.example` |
| 24 | `catch {}` kosong — kegagalan translate senyap, user tidak tahu | `src/services/translatorService.ts:17` |
| 25 | Folder `state/` kosong tapi ter-track | `state/` |

---

## ✅ Yang Sudah Bagus

- `.env` dan `scripts/*.json` sudah gitignored
- `verifyAuth()` dicek di 15 dari 16 server action
- Cookie password: `httpOnly` + `secure` + `sameSite=lax`
- `prisma.ts` singleton benar
- SSRF guard ada niatnya — banyak proyek portfolio tidak punya sama sekali

---

## Prioritas Fix (urut dampak/effort)

| Prioritas | Aksi | File |
|---|---|---|
| 1 | `auth.ts` fail-closed + nonce di token (`crypto.randomUUID()`) | `src/lib/auth.ts` |
| 2 | Hapus `check-auth/route.ts` atau sinkronkan dengan `verifyAuthToken` | `src/app/api/check-auth/route.ts` |
| 3 | Rate limit `/api/authenticate` (5/menit per IP, in-memory Map cukup) | `src/app/api/authenticate/route.ts` |
| 4 | `redirect: "manual"`, cap `Content-Length` 5MB, resolve DNS + cek IP hasil resolve | `src/lib/ssrf.ts`, `src/app/api/og/*` |
| 5 | Tambah `verifyAuth()` ke `translateAction` | `src/app/admin/actions.ts` |
| 6 | Perbaiki script `lint`/`export`, tambah `test` | `package.json` |
| 7 | Konsolidasi route tree — hapus root tree, sisakan `[locale]` | `src/app/` |
