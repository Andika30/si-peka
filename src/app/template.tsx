"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";

/**
 * Transisi antar halaman.
 *
 * `template.tsx` dipasang ulang setiap navigasi — berbeda dari `layout.tsx`
 * yang bertahan — jadi di sinilah animasi masuk halaman ditaruh.
 *
 * Sengaja pendek (260 ms) dan hanya memudar sambil naik sedikit: cukup untuk
 * memberi tahu bahwa halaman berganti, tidak sampai memperlambat orang yang
 * sedang mencari kanal pengaduan.
 *
 * `MotionConfig reducedMotion="user"` memastikan seluruh animasi di bawah
 * pohon ini — termasuk animasi tata letak seperti penanda navigasi yang
 * meluncur — ikut berhenti kalau pengguna memilih mengurangi gerak.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const hemat = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={hemat ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: hemat ? 0 : 0.26, ease: [0.2, 0, 0, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
