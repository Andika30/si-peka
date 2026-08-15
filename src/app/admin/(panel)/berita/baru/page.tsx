import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormBerita from "../FormBerita";

export default function BeritaBaru() {
  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/berita"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Berita
      </Link>
      <h2 className="mb-6 text-display text-tinta">Berita baru</h2>
      <FormBerita />
    </>
  );
}
