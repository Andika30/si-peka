import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormKategori from "../FormKategori";

export default function KategoriBaru() {
  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/kategori"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kategori materi
      </Link>
      <h2 className="mb-6 text-display text-tinta">Kategori baru</h2>
      <FormKategori />
    </>
  );
}