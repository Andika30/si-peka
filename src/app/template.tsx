"use client";

import { MotionConfig } from "motion/react";

/**
 * Transisi antar halaman.
 *
 * `template.tsx` dipasang ulang setiap navigasi — berbeda dari `layout.tsx`
 * yang bertahan — jadi di sinilah animasi masuk halaman ditaruh. Karena
 * simpulnya benar-benar baru tiap navigasi, animasi CSS ikut terputar ulang
 * tanpa perlu JavaScript sama sekali.
 *
 * Dan itu justru penting: pembungkus ini menyelimuti SELURUH isi halaman.
 * Kalau keadaan awalnya `opacity: 0` lewat JavaScript, maka seluruh halaman
 * tak terlihat sampai bundel selesai diunduh dan dihidrasi — di sinyal
 * seadanya bisa beberapa detik. CSS berjalan pada cat pertama.
 *
 * `MotionConfig` tidak menghasilkan simpul DOM; ia hanya memastikan seluruh
 * animasi interaktif di bawahnya menghormati pilihan hemat gerak pengguna.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="gerak-halaman">{children}</div>
    </MotionConfig>
  );
}
