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
| `modul.json` | Enam modul: materi + kuis masing-masing. Menambah objek = menambah modul, kartu, rute, dan progresnya |
| `skenario.json` | Skenario simulasi Kenali, termasuk teks konsekuensi tiap pilihan keliru |
| `kasus.json` | Lima jenis masalah Adukan beserta langkah dan aturan eskalasinya |
| `soal.json` | Bank soal cek awal & akhir, berpasangan per indikator |
| `checklist.json` | Butir Checklist Sebelum Bayar |
| `penyelenggara.json` | Daftar penyelenggara, jenis layanan, dan kanal Bank Indonesia |
| `sus.json` | Sepuluh pernyataan System Usability Scale |
| `lencana.json` | Nilai poin dan syarat tiap lencana |

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
    page.tsx                     Landing — halaman merek, satu-satunya tanpa shell
    beranda/                     Dashboard: progres, lanjutkan materi, menu
    materi/                      Daftar modul → materi/[id]
    kuis/[id]/                   Kuis modul → kuis/[id]/hasil
    simulasi/                    Daftar skenario → simulasi/[n]
    adukan/                      Langkah 1 → layanan → penyelenggara → hasil
      hasil/[kasus]/             Hasil berbeda untuk tiap jenis masalah
      eskalasi/                  Satu-satunya layar dengan kanal BI menonjol
      kanal/                     Urutan: penyelenggara dulu, BI terakhir
    riwayat/ pencapaian/ profil/ Bagian akun (tab bawah di ponsel)
    feedback/ checklist/ tentang/
    persetujuan/ cek/[fase]/     Instrumen penelitian
    kuesioner/ hasil/            SUS, lalu skor & N-Gain
  components/
    AppShell.tsx                 Sidebar desktop · rail tablet · bilah bawah ponsel
    ui.tsx                       Chip, Kartu, Tombol, KartuPilihan, BarProgres…
    ikon.tsx                     Nama ikon di JSON → komponen
    IsiModul.tsx KuisModul.tsx HasilKuis.tsx
    Simulasi.tsx                 Mesin keadaan soal → konsekuensi → penjelasan
    Kuis.tsx                     Cek awal & cek akhir
    Hasil.tsx                    PekaMark, BarSkor
  content/                       Seluruh isi aplikasi
  lib/
    konten.ts                    Pemuat bertipe
    skor.ts                      Progres, poin, lencana, N-Gain, skor SUS
```

### Navigasi menyesuaikan alat

| Lebar | Navigasi | Alasan |
|---|---|---|
| < 768px | Bilah bawah 4 tab | Jangkauan ibu jari; fitur dicapai lewat kisi di Beranda |
| ≥ 768px | Rail kiri ikon | Layar cukup lebar, tapi belum cukup untuk label |
| ≥ 1280px | Sidebar penuh, dua kelompok | Tidak ada alasan menyembunyikan menu di layar selebar ini |

Bilah navigasi bawah pada layar 1440px adalah pola yang salah tempat — karena
itu shell-nya berganti bentuk, bukan sekadar melar.

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

**Alur pengukuran menunjukkan posisinya.** `AlurPengukuran` muncul di
persetujuan, cek awal, cek akhir, penilaian, dan hasil. Rangkaian ini memakan
waktu, dan orang berhenti di tengah bukan karena malas — tapi karena tidak tahu
tinggal berapa langkah lagi. Peserta yang berhenti di tengah berarti data
penelitian tidak lengkap, jadi ini bukan sekadar urusan rupa. Halaman
persetujuan juga menuliskan lebih dulu apa saja yang akan dilalui beserta
jumlah soal dan modulnya.

**Alur linear tidak punya navigasi.** Persetujuan, kuis, simulasi, dan kuesioner
sengaja tanpa bilah navigasi: memberi jalan keluar di tengah pengukuran merusak
datanya.

**Ilustrasi digambar sendiri.** Dua belas adegan di `src/components/Ilustrasi.tsx`
adalah SVG inline buatan sendiri, bukan dari pustaka ilustrasi luar. Aplikasi ini
berlabel Bank Indonesia, jadi seluruh aset harus jelas asal-usulnya. Keuntungan
lainnya: warnanya ikut palet tiap modul lewat prop `warna`, tajam di resolusi apa
pun, dan tidak menambah satu pun berkas gambar maupun permintaan jaringan.

Kosakata bentuknya dibatasi — ponsel, kartu, gelembung pesan, perisai, dan kotak
sudut kode QR — supaya dua belas adegan terbaca sebagai satu keluarga. Tidak ada
wajah manusia: sulit digambar rapi dengan SVG datar, dan menghindari kesan
menggambarkan orang tertentu. Menambah adegan berarti menambah satu `case` di
`Adegan` dan satu nama di `NamaIlustrasi`.

**Gerak melayani orientasi, bukan hiasan.** Primitif di
`src/components/gerak.tsx` (motion) dipakai dengan tiga aturan: hanya
menyentuh `transform` dan `opacity` karena audiensnya memakai ponsel kelas
menengah; setiap animasi harus menjelaskan sesuatu — kemunculan berurutan
mengarahkan mata dari modul 01 ke bawah, angka berhitung membuat skor terbaca
sebagai capaian, panel yang naik menandai umpan balik atas pilihan barusan; dan
perayaan hanya ada satu, di layar hasil kuis.

Dua jebakan yang sudah ditemui dan diperbaiki — jangan diulang:

1. **Jangan mengganti jenis elemen** berdasarkan `useReducedMotion()`. Nilai
   hook itu berbeda antara server dan klien, jadi `motion.div` yang berubah
   menjadi `div` akan memecah hidrasi dan menghilangkan isi halaman.
2. **Jangan memakai `initial={false}`** untuk mematikan animasi. Motion memang
   melewati animasinya, tapi `opacity: 0` hasil render server tetap menempel dan
   kontennya tidak pernah terlihat. Saat mode hemat, keadaan awal harus langsung
   sama dengan keadaan akhir.

**Gamifikasi sengaja dibatasi.** Poin dan lencana hanya menghitung modul,
simulasi, dan checklist. Cek awal dan cek akhir tidak berpoin dan tidak bisa
diulang — kalau bisa, orang akan mengulangnya demi poin dan N-Gain penelitian
jadi tidak sahih. Keterlibatan tidak boleh dibayar dengan validitas data.

---

## Yang masih perlu dilengkapi

- **Warna `#0e2f6b`** masih perkiraan Biru Institusi BI. Cocokkan dengan pedoman
  merek resmi, lalu ubah `--color-institusi` di `src/app/globals.css`.
- **Nama penyelenggara** masih placeholder ("Penyelenggara A"). Ganti setelah
  penggunaan nama merek disetujui pembimbing.
- **Pengiriman skor** masih berhenti di perangkat. Untuk mengumpulkan data
  penelitian, tambahkan satu `fetch` ke Google Apps Script pada akhir alur
  kuesioner — tanpa mengubah apa pun yang lain.
