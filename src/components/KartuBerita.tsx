import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import type { Berita } from "@/lib/tipe";

export const tanggalPanjang = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * Kartu berita.
 *
 * Tanggal ditaruh di atas judul, bukan disembunyikan di kaki. Kabar yang
 * terikat waktu harus bisa dinilai kebaruannya sebelum dibaca, bukan setelah.
 */
export default function KartuBerita({ b }: { b: Berita }) {
  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-kartu border border-garis bg-white shadow-kartu transition-shadow motion-safe:hover:shadow-angkat"
      href={`/berita/${b.id}`}
    >
      {b.gambar ? (
        <span className="block h-44 overflow-hidden bg-kertas-tua">
          <img
            alt={b.gambarAlt ?? ""}
            className="size-full object-cover transition-transform motion-safe:group-hover:scale-105"
            loading="lazy"
            src={`/gambar/${b.gambar}`}
          />
        </span>
      ) : (
        <span className="flex h-44 items-center justify-center bg-adukan-lembut">
          <Newspaper className="size-10 text-adukan/40" aria-hidden />
        </span>
      )}

      <span className="flex flex-1 flex-col p-5">
        <span className="font-mono text-data uppercase text-tinta-55">
          {tanggalPanjang(b.tanggal)}
        </span>
        <span className="mt-2 text-subjudul text-tinta">{b.judul}</span>
        <span className="mt-2 line-clamp-3 flex-1 text-kecil leading-relaxed text-tinta-70">
          {b.ringkas}
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 text-kecil font-bold text-adukan">
          Baca selengkapnya
          <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </Link>
  );
}
