# PeKA — Peduli, Kenali, Adukan

Media edukasi dan simulasi keamanan pembayaran digital untuk masyarakat Sulawesi
Tenggara. Dikembangkan pada kegiatan magang di Kantor Perwakilan Bank Indonesia
Provinsi Sulawesi Tenggara.

**Next.js 16 · React 19 · Tailwind v4 · konten dari JSON**

---

## Batasan proyek

Ini yang membentuk hampir semua keputusan teknis di bawah. Aplikasi ini **tidak**:

- menerima laporan masyarakat
- menyimpan data pengaduan
- meminta data finansial
- meminta OTP/PIN
- memproses transaksi
- menggantikan kanal resmi BI atau penyelenggara

PeKA adalah **pengarah kanal**, bukan sistem pengaduan. Setiap alur Adukan selalu
berakhir di kanal pihak lain — tidak ada satu pun tombol "kirim ke kami".

Konsekuensinya di kode: tidak ada basis data, tidak ada backend, tidak ada
autentikasi. Skor disimpan di `localStorage` perangkat pengguna dengan ID sesi
acak — tanpa nama, nomor telepon, atau data transaksi.

---

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build produksi
npm run start      # jalankan hasil build
npm run lint
```

---

## Mengubah isi tanpa menyentuh kode

Semua isi aplikasi ada di `src/content/`. Ubah JSON-nya, jalankan `npm run build`,
selesai — tidak ada komponen yang perlu disunting.

| Berkas | Isi |
|---|---|
| `materi.json` | Materi modul Peduli. Menambah objek = menambah halaman materi |
| `skenario.json` | Skenario simulasi Kenali, termasuk teks konsekuensi tiap pilihan keliru |
| `kasus.json` | Lima jenis masalah Adukan beserta langkah dan aturan eskalasinya |
| `soal.json` | Bank soal cek awal & akhir, berpasangan per indikator |
| `checklist.json` | Butir Checklist Sebelum Bayar |
| `penyelenggara.json` | Daftar penyelenggara, jenis layanan, dan kanal Bank Indonesia |
| `sus.json` | Sepuluh pernyataan System Usability Scale |

Komponen tidak pernah mengimpor JSON langsung — semuanya lewat `src/lib/konten.ts`.
Kalau nanti sumbernya pindah (misalnya ke Google Sheets), hanya berkas itu yang
berubah.

### Dua hal yang jangan diubah tanpa alasan

**`eskalasiBI` di `kasus.json`.** Menentukan apakah jalur Bank Indonesia
ditawarkan. Hanya kasus yang sudah melewati penyelenggara yang bernilai `true`.
Mengubahnya menjadi `true` untuk semua kasus akan mengarahkan orang ke BI untuk
masalah yang seharusnya selesai di penyelenggara.

**Urutan pernyataan di `sus.json`.** Butir positif dan negatif berselang-seling.
Kalau urutannya diacak, rumus penilaian SUS tidak lagi berlaku.

### Kolom `diverifikasi`

Nomor dan tautan kanal resmi berubah. Kolom ini membuat kebasian data terlihat,
bukan tersembunyi — perbarui berkala. Data yang basi di sini bisa mengarahkan
orang yang sedang panik ke tempat yang salah.

---

## Struktur

```
src/
  app/
    page.tsx                     Beranda — dua pintu masuk
    persetujuan/                 Persetujuan sebelum pengukuran
    cek/[fase]/                  Cek awal & cek akhir
    belajar/                     Modul, materi, checklist
    simulasi/[n]/                Skenario Kenali
    adukan/                      Langkah 1 → layanan → penyelenggara → hasil
      hasil/[kasus]/             Hasil berbeda untuk tiap jenis masalah
      eskalasi/                  Satu-satunya layar dengan kanal BI menonjol
      kanal/                     Urutan: penyelenggara dulu, BI terakhir
    kuesioner/                   SUS
    hasil/                       Skor, N-Gain, rekomendasi
  components/
    dasar.tsx                    Finder, Halaman, Kartu, Tombol, KartuPilihan…
    Nav.tsx                      Bawah di ponsel, atas di desktop
    Simulasi.tsx                 Mesin keadaan soal → konsekuensi → penjelasan
    Kuis.tsx                     Cek awal & akhir
    Hasil.tsx                    PekaMark, BarSkor
  content/                       Seluruh isi aplikasi
  lib/
    konten.ts                    Pemuat bertipe
    skor.ts                      Penyimpanan, N-Gain, skor SUS
```

---

## Catatan desain

**Finder pattern.** Kode QR punya tepat tiga kotak sudut yang dipakai pemindai
untuk mengunci posisi. PeKA punya tepat tiga pilar. Motif itu jadi penanda
progres, penanda modul, dan visual skor akhir. Selalu bersudut tajam, kontras
dengan kartu yang membulat. Cincin luarnya tidak pernah dihilangkan — tanpa itu
bentuknya hanya kotak biasa.

**Simulasi tidak memvonis.** Pilihan keliru lanjut ke layar konsekuensi lebih
dulu, baru penjelasan. "Benar/salah" tidak mengajarkan apa pun; yang mengajarkan
adalah melihat akibatnya.

**Cek awal tidak memperlihatkan pembahasan.** Kalau diperlihatkan, peserta
belajar dari pretest dan kenaikan di posttest tidak lagi murni berasal dari
medianya. Pembahasan baru dibuka di cek akhir.

**Soal awal dan akhir berpasangan** — indikator sama, konteks berbeda. Peserta
tidak merasa mengulang soal identik, tapi secara statistik tetap setara sehingga
N-Gain tetap sahih.

**Alur linear tidak punya navigasi.** Persetujuan, kuis, simulasi, dan kuesioner
sengaja tanpa bilah navigasi: memberi jalan keluar di tengah pengukuran merusak
datanya.

---

## Yang masih perlu dilengkapi

- **Warna `#0e2f6b`** masih perkiraan Biru Institusi BI. Cocokkan dengan pedoman
  merek resmi, lalu ubah `--color-institusi` di `src/app/globals.css`.
- **Nama penyelenggara** masih placeholder ("Penyelenggara A"). Ganti setelah
  penggunaan nama merek disetujui pembimbing.
- **Pengiriman skor** masih berhenti di perangkat. Untuk mengumpulkan data
  penelitian, tambahkan satu `fetch` ke Google Apps Script pada akhir alur
  kuesioner — tanpa mengubah apa pun yang lain.
