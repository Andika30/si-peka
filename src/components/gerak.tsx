"use client";

import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Primitif gerak Kalosara.
 *
 * Aturannya tiga:
 *  1. Gerak melayani orientasi dan umpan balik, bukan hiasan. Kalau sebuah
 *     animasi tidak menjelaskan apa pun, dia dibuang.
 *  2. Hanya `transform` dan `opacity` — keduanya ditangani GPU. Audiens
 *     aplikasi ini memakai ponsel kelas menengah, bukan perangkat kelas atas.
 *  3. `prefers-reduced-motion` selalu dihormati: gerak berhenti, isinya tetap
 *     tampil utuh. Tidak ada informasi yang hanya bisa diakses lewat animasi.
 */

const HALUS = [0.2, 0, 0, 1] as const;

/**
 * Pembagian tugas: animasi KEMUNCULAN ditangani CSS, animasi INTERAKSI
 * ditangani pustaka gerak.
 *
 * Alasannya keterbacaan, bukan ukuran bundel. Elemen yang keadaan awalnya
 * `opacity: 0` lewat JavaScript akan tetap tak terlihat sampai bundel selesai
 * diunduh dan dihidrasi — di ponsel kelas menengah dengan sinyal seadanya itu
 * berarti halaman kosong selama beberapa detik. CSS berjalan pada cat pertama,
 * jadi isinya tidak pernah bergantung pada JavaScript untuk menjadi terlihat.
 *
 * Konsekuensinya `Muncul`, `Berurutan`, `Anak`, dan `Rayakan` cuma pembungkus
 * dengan kelas CSS — tanpa hook, jadi aman dipakai di komponen server juga.
 * Mode hemat gerak ditangani `@media (prefers-reduced-motion)` di globals.css.
 */

/** Naik sedikit sambil memudar masuk. Murni CSS — lihat catatan di atas. */
export function Muncul({
  children,
  tunda = 0,
  className = "",
}: {
  children: ReactNode;
  tunda?: number;
  className?: string;
}) {
  return (
    <div
      className={`gerak-muncul ${className}`}
      style={tunda ? { animationDelay: `${tunda}s` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Wadah daftar: anak-anaknya muncul berurutan, bukan serentak.
 * Jeda 60 ms — cukup untuk mengarahkan mata dari atas ke bawah tanpa
 * membuat orang menunggu. Jedanya diatur `:nth-child` di globals.css.
 */
export function Berurutan({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`gerak-berurutan ${className}`}>{children}</div>;
}

/** Satu butir di dalam `Berurutan`. Jedanya ditentukan urutannya di CSS. */
export function Anak({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/**
 * Kartu yang bisa ditekan: terangkat saat disentuh, menekan saat ditekan.
 *
 * Jenis elemennya TIDAK boleh berubah mengikuti `useReducedMotion` — nilai
 * hook itu berbeda antara server dan klien, jadi mengganti `motion.div`
 * menjadi `div` akan memecah hidrasi dan menghilangkan isinya. Yang berubah
 * hanya propertinya.
 */
export function Sentuh({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const hemat = useReducedMotion();

  return (
    <motion.div
      className={className}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      whileHover={hemat ? undefined : { y: -3 }}
      whileTap={hemat ? undefined : { scale: 0.985 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Angka yang berhitung naik. Dipakai untuk skor dan poin — perubahan angka
 * jadi terbaca sebagai capaian, bukan sekadar nilai yang tiba-tiba ada.
 */
export function Angka({
  nilai,
  akhiran = "",
  durasi = 0.9,
}: {
  nilai: number;
  akhiran?: string;
  durasi?: number;
}) {
  const hemat = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const terlihat = useInView(ref, { once: true, margin: "-40px" });

  // Angkanya ditulis langsung ke DOM, bukan lewat state React. Dua alasan:
  // hasil render server sudah memuat nilai akhir — jadi benar walau JavaScript
  // gagal dimuat — dan tidak ada render berantai tiap bingkai animasi.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (hemat || !terlihat) {
      el.textContent = `${nilai}${akhiran}`;
      return;
    }
    const kendali = animate(0, nilai, {
      duration: durasi,
      ease: HALUS,
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${akhiran}`;
      },
    });
    return () => kendali.stop();
  }, [akhiran, durasi, hemat, nilai, terlihat]);

  return (
    <span ref={ref}>
      {nilai}
      {akhiran}
    </span>
  );
}

/**
 * Konten yang bertukar di tempat — soal kuis, hasil saringan daftar.
 * Yang lama keluar dulu (`mode="wait"`) supaya tidak ada dua isi bertumpuk;
 * arahnya mendatar untuk urutan maju, tegak untuk pergantian biasa.
 */
export function Tukar({
  children,
  kunci,
  arah = "tegak",
  className = "",
}: {
  children: ReactNode;
  kunci: string | number;
  arah?: "tegak" | "mendatar";
  className?: string;
}) {
  const hemat = useReducedMotion();
  const geser = arah === "mendatar" ? { x: 24 } : { y: 12 };
  const balik = arah === "mendatar" ? { x: -24 } : { y: -12 };

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className={className}
        exit={hemat ? { opacity: 1 } : { opacity: 0, ...balik }}
        initial={hemat ? { opacity: 1 } : { opacity: 0, ...geser }}
        key={kunci}
        transition={{ duration: hemat ? 0 : 0.24, ease: HALUS }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Getaran singkat untuk jawaban yang keliru.
 *
 * Dipakai hemat: satu kali, 0,4 detik, dan tidak pernah untuk hal lain —
 * getaran adalah bahasa "ada yang salah", bukan hiasan. Di mode hemat gerak
 * getarannya hilang; pesan salahnya tetap terbaca dari warna dan teks.
 */
export function Getar({
  children,
  aktif,
  className = "",
}: {
  children: ReactNode;
  aktif: boolean;
  className?: string;
}) {
  const hemat = useReducedMotion();

  return (
    <motion.div
      animate={aktif && !hemat ? { x: [0, -7, 6, -4, 3, 0] } : { x: 0 }}
      className={className}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Momen perayaan: sekali, pada hasil kuis. Tidak dipakai di tempat lain. */
export function Rayakan({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`gerak-rayakan ${className}`}>{children}</div>;
}

export { motion };
