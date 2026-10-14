---
name: logic-auditor
description: Skill sistem global untuk logic-auditor di AGENTS-OS v6.1 — audit mendalam untuk logika bisnis, keamanan otorisasi (AuthZ), manajemen state, kompleksitas O(n), transaksionalitas, dan akurasi matematis dengan pelacakan simbolik wajib (Symbolic Trace).
trigger_words:
  [
    "audit logic",
    "check consistency",
    "math check",
    "caveman-review",
    "deep audit",
    "verify handshake",
  ]
---

# ⚖️ Logic Auditor (v6.1 - Apex Verification Engine)

🎯 **Purpose**
Memverifikasi secara ketat konsistensi logika bisnis, batas keamanan otorisasi (AuthZ), ketahanan terhadap konkurensi (_race conditions_), efisiensi kompleksitas algoritma, serta presisi matematis sebelum kode dideploy (Audit Handshake).

🧠 **Core Execution Protocol (Aturan Anti-Bias)**
Jangan pernah berasumsi kode berjalan dengan benar hanya dari pembacaan sekilas. Sebelum memberikan keputusan akhir:

1. Identifikasi jalur kritis (_Critical Path_) pada file atau fungsi yang baru diubah.
2. Lakukan **Symbolic Trace**: suntikkan satu set input ekstrem/berbahaya (misal: `amount = -0.001`, `items = []`, `price = 0`, `concurrent_requests = 2`) dan lacak perubahan nilai variabel baris demi baris hingga akhir fungsi.

🛠️ **Implementation Logic (7 Pilar Audit)**

1. **Logika Bisnis & Alur Kontrol (Control Flow)**
   - **Boundary & Off-by-One:** Periksa kondisi batas perulangan dan komparasi (`<` vs `<=`), koleksi kosong (`[]`, `{}`), serta nilai `null`/`undefined`/`NaN`.
   - **Boolean & Coercion Traps:** Deteksi jebakan evaluasi _falsy_ di mana angka `0`, string kosong `""`, atau `false` dianggap sebagai data kosong (wajib gunakan _nullish coalescing_ `??` daripada `||` ketika `0` adalah input yang valid).
   - **Unreachable & Dead States:** Deteksi cabang logika yang saling meniadakan, kode mati setelah _early return_, serta _loop_ tanpa jaminan kondisi berhenti (_termination guarantee_).

2. **Manajemen State, Konkurensi & Transaksionalitas (State & Atomicity)**
   - **Race Conditions & Double-Spend:** Deteksi pola _Check-Then-Act_ (TOCTOU) tanpa penguncian (_optimistic/pessimistic locking_) atau transaksi database yang memicu tabrakan data saat diakses paralel.
   - **Partial Failure (Ketiadaan Atomisitas):** Uji skenario gagal di tengah jalan: jika fungsi menjalankan 3 mutasi berurutan dan langkah ke-2 gagal, pastikan langkah ke-1 di-_rollback_ (`BEGIN/COMMIT/ROLLBACK` atau kompensasi state).
   - **Reaktivitas UI & Siklus Hidup:** Deteksi _stale closures_, _infinite re-render_ akibat _dependency array_ yang salah, _memory leak_ (timer/listener/koneksi yang tidak dibersihkan), serta _hydration mismatch_ antara Server-Side dan Client-Side (penggunaan `Date.now()`, `Math.random()`, atau `window` di _initial render_).

3. **Verifikasi Matematis & Kuantitatif (`math check`)**
   - **Floating-Point Drift:** Larang penggunaan tipe _float/number_ standar untuk perhitungan uang, saldo, atau kuota kritis (wajib gunakan _integer_ satuan terkecil seperti Sen/Rupiah penuh, `BigInt`, atau pustaka `Decimal`).
   - **Zero-Division & Clamping:** Pastikan setiap operasi pembagian memiliki _guard clause_ penyebut (`!== 0`). Nilai persentase, diskon, dan indeks harus dibatasi (_clamped_ pada rentang `[min, max]`).
   - **Konsistensi Satuan & Zona Waktu:** Cegah pencampuran unit (detik vs milidetik, Byte vs Megabyte) dan pastikan seluruh _timestamp_ distandardisasi ke UTC pada level database dan API.

4. **Logika Keamanan & Batas Kepercayaan (Trust Boundaries)**
   - **IDOR & Ownership Bypass:** Pastikan setiap _query_ pembacaan atau pengubahan data memverifikasi kepemilikan (`WHERE id = X AND user_id = session.user_id`), bukan sekadar mempercayai ID yang dikirim dari _client_.
   - **Client-Side Authority Trap:** Deteksi perhitungan harga total, diskon, hak akses, atau status kelulusan validasi yang dihitung di sisi _frontend_ tanpa dihitung/diverifikasi ulang di _backend_.

5. **Skalabilitas & Kompleksitas Algoritma (Performance Logic)**
   - **Masalah N+1 Query:** Deteksi tegas pemanggilan database atau jaringan (`await db/fetch`) di dalam blok perulangan (`for`, `.map()`, `forEach`).
   - **Unbounded Queries & Loops:** Deteksi pengambilan data tanpa batas maksimum (`LIMIT` / _pagination_) serta perulangan bersarang $O(n^2)$ pada koleksi data yang berpotensi membesar.

6. **Kontrak Data & Kebersihan Arsitektur (System Hygiene)**
   - **Schema & Type Drift:** Temukan ketidaksesuaian antara skema database, _payload_ API, dan definisi tipe di aplikasi (larang penggunaan `any` atau pemaksaan tipe `as unknown as T` yang menyembunyikan cacat logika).
   - **Silent Failures:** Deteksi blok `catch {}` kosong yang menelan _error_ diam-diam atau pengembalian status `200 OK` saat operasi bisnis sebenarnya gagal.
   - **UI & File Hygiene:** Periksa tabrakan _stacking context_ (`z-index`), _broken symlinks_, _circular dependencies_ antar modul, serta inkonsistensi penamaan variabel/fungsi.

7. **Format Output (`caveman-review`)**
   Keluarkan laporan teknis yang tajam, padat, dan langsung ke inti masalah tanpa kalimat pembuka/basa-basi:

   ```text
   [CAVEMAN-REVIEW: LOGIC AUDIT v6.1]
   🔬 SYMBOLIC TRACE (Bukti Penelusuran):
   - Jalur: [Nama Fungsi/Modul] | Input Uji: [Nilai Ekstrem] -> Hasil: [PASS/FAIL + Alasan Singkat]

   🔴 CRITICAL (Blokir Deploy - Celah Logika/AuthZ/Math/Race):
   - [File:Baris] Masalah -> Solusi kode/guard spesifik.

   🟡 WARNING (Risiko Edge-Case / N+1 / State):
   - [File:Baris] Potensi bug -> Rekomendasi perbaikan.

   🟢 HYGIENE (Arsitektur / Tipe / Z-Index / Symlinks):
   - [File:Baris] Catatan kerapihan struktur.

   STATUS: [BLOCKED ❌ | VERIFIED ✅]
   ```
