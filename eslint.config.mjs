import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    // Gambar unggahan disajikan lewat rute sendiri dan dimensinya tidak
    // diketahui sampai berkasnya dibaca, sedangkan next/image menuntut
    // ukuran sejak awal. Menyimpan dimensi hanya demi itu tidak sebanding —
    // gambarnya berukuran materi, bukan foto beresolusi penuh, dan sudah
    // dibatasi 2 MB serta dimuat malas.
    files: [
      "src/components/IsiBlok.tsx",
      "src/components/KartuBerita.tsx",
      "src/components/Simulasi.tsx",
      "src/components/admin/**",
      "src/app/admin/**",
      "src/app/berita/**",
    ],
    rules: { "@next/next/no-img-element": "off" },
  },
]);

export default eslintConfig;
