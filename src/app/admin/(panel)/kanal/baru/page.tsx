import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormPenyelenggara from "../FormPenyelenggara";

export default function PenyelenggaraBaru() {
  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/kanal"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kanal pengaduan
      </Link>
      <h2 className="mb-6 text-display text-tinta">Penyelenggara baru</h2>
      <FormPenyelenggara />
    </>
  );
}
