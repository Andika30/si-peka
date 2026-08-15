import { CheckCircle2 } from "lucide-react";
import { Kartu, warnaTeks } from "@/components/ui";
import type { BlokIsi, Warna } from "@/lib/tipe";

/**
 * Merender isi berblok — dipakai halaman materi dan halaman berita.
 *
 * Poin yang berurutan dikumpulkan jadi satu kartu supaya tidak jadi deretan
 * kartu bercentang satu-satu; blok lain dirender apa adanya, urut.
 */

type Tampil =
  | { jenis: "paragraf" | "gambar"; teks: string; keterangan?: string }
  | { jenis: "poin"; butir: string[] };

export function kelompokkan(isi: BlokIsi[]): Tampil[] {
  const hasil: Tampil[] = [];

  for (const b of isi) {
    // Subjudul sudah dipakai memecah bagian sebelum sampai ke sini, jadi
    // kalaupun lolos ia diabaikan daripada dirender sebagai paragraf biasa.
    if (b.jenis === "subjudul") continue;
    if (b.jenis !== "poin") {
      hasil.push({ jenis: b.jenis, teks: b.teks, keterangan: b.keterangan });
      continue;
    }
    const akhir = hasil[hasil.length - 1];
    if (akhir?.jenis === "poin") akhir.butir.push(b.teks);
    else hasil.push({ jenis: "poin", butir: [b.teks] });
  }

  return hasil;
}

export default function IsiBlok({
  isi,
  warna = "adukan",
  judulPoin = "Yang perlu diingat",
}: {
  isi: BlokIsi[];
  warna?: Warna;
  judulPoin?: string;
}) {
  return (
    <article className="flex flex-col gap-4">
      {kelompokkan(isi).map((blok, i) =>
        blok.jenis === "poin" ? (
          <Kartu aksen={warna} key={i}>
            <h2 className="mb-4 text-subjudul text-tinta">{judulPoin}</h2>
            <ul className="flex flex-col gap-3">
              {blok.butir.map((p) => (
                <li className="flex gap-3" key={p}>
                  <CheckCircle2
                    className={`mt-0.5 size-5 shrink-0 ${warnaTeks(warna)}`}
                    aria-hidden
                  />
                  <span className="text-isi text-tinta">{p}</span>
                </li>
              ))}
            </ul>
          </Kartu>
        ) : blok.jenis === "gambar" ? (
          <figure key={i}>
            {/* Gambar unggahan tidak diketahui ukurannya sejak awal, jadi
                tingginya dibiarkan mengikuti dan lebarnya yang dibatasi. */}
            <img
              alt={blok.keterangan ?? ""}
              className="w-full rounded-kartu border border-garis bg-white"
              loading="lazy"
              src={`/gambar/${blok.teks}`}
            />
            {blok.keterangan ? (
              <figcaption className="mt-2 text-kecil text-tinta-55">{blok.keterangan}</figcaption>
            ) : null}
          </figure>
        ) : (
          <p className="text-isi leading-relaxed text-tinta-70" key={i}>
            {blok.teks}
          </p>
        ),
      )}
    </article>
  );
}
