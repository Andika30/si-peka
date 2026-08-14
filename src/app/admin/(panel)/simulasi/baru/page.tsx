import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormSkenario from "../FormSkenario";

export default function SkenarioBaru() {
  return (
    <>
      <Link
        className="mb-4 inline-flex items-center gap-2 text-kecil font-bold text-tinta-55 hover:text-institusi"
        href="/admin/simulasi"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Simulasi
      </Link>
      <h1 className="mb-6 text-display text-tinta">Skenario baru</h1>
      <FormSkenario />
    </>
  );
}
