import { CheckCircle2 } from "lucide-react";
import { Kartu, warnaIsi, warnaTeks } from "@/components/ui";
import type { BlokIsi, Warna } from "@/lib/tipe";

/**
 * Merender isi berblok — dipakai halaman materi dan halaman berita.
 *
 * Poin yang berurutan dikumpulkan jadi satu kartu supaya tidak jadi deretan
 * kartu bercentang satu-satu; blok lain dirender apa adanya, urut.
 */

type Tampil =
  | { jenis: "paragraf" | "gambar" | "video"; teks: string; keterangan?: string }
  | { jenis: "poin"; butir: string[] }
  | { jenis: "kartu-flip"; teks: string; keterangan?: string };

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

/** Nama berkas jadi alamat. Bisa diganti oleh pratinjau, yang gambarnya
    masih berupa blob di peramban dan belum punya nama di server. */
const alamatBawaan = (nama: string) => `/gambar/${nama}`;

export default function IsiBlok({
  isi,
  warna = "adukan",
  judulPoin = "Yang perlu diingat",
  alamatGambar = alamatBawaan,
}: {
  isi: BlokIsi[];
  warna?: Warna;
  judulPoin?: string;
  alamatGambar?: (nama: string) => string;
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
              src={alamatGambar(blok.teks)}
            />
            {blok.keterangan ? (
              <figcaption className="mt-2 text-kecil text-tinta-55">{blok.keterangan}</figcaption>
            ) : null}
          </figure>
        ) : blok.jenis === "kartu-flip" ? (
          // Muka untuk dipindai, belakang untuk detailnya — sama seperti
          // kartu di daftar materi. Di layar tanpa hover (sentuh) baliknya
          // tidak pernah kejadian, jadi `kartu-flip--konten` di globals.css
          // menumpuk dua sisinya jadi satu panel biasa alih-alih menyembunyikan
          // sisi belakang selamanya.
          <div className="kartu-flip kartu-flip--konten block" key={i}>
            <div className="kartu-flip__dalam block">
              <div className="kartu-flip__muka flex min-h-32 flex-col justify-center gap-1.5 rounded-kartu border border-garis bg-white p-5 shadow-kartu">
                <span className={`hanya-hover font-mono text-data uppercase ${warnaTeks(warna)}`}>
                  Arahkan kursor untuk detailnya
                </span>
                <span className="text-subjudul text-tinta">{blok.teks}</span>
              </div>
              <div
                className={`kartu-flip__belakang flex min-h-32 flex-col justify-center gap-1.5 rounded-kartu p-5 text-white shadow-angkat ${warnaIsi(warna)}`}
              >
                <span className="text-isi leading-relaxed">{blok.keterangan}</span>
              </div>
            </div>
          </div>
        ) : blok.jenis === "video" ? (
          <figure key={i}>
            {/* `teks` sudah berupa ID 11 karakter yang divalidasi server saat
                disimpan — alamat iframe di bawah ini tidak pernah dibangun
                langsung dari isian admin apa adanya. youtube-nocookie.com
                dipakai supaya video tidak menaruh kuki pelacak sebelum
                benar-benar diputar. */}
            <div className="aspect-video w-full overflow-hidden rounded-kartu border border-garis bg-black">
              <iframe
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="size-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={`https://www.youtube-nocookie.com/embed/${blok.teks}`}
                title={blok.keterangan || "Video YouTube"}
              />
            </div>
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
