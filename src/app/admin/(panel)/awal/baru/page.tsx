import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormInfoAwal from "../FormInfoAwal";

export default function InfoAwalBaru() {
  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/awal"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Info penanganan awal
      </Link>
      <h2 className="mb-6 text-display text-tinta">Butir baru</h2>
      <FormInfoAwal />
    </>
  );
}
