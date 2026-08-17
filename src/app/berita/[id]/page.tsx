import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import IsiBlok from "@/components/IsiBlok";
import KartuBerita, { tanggalPanjang } from "@/components/KartuBerita";
import { Finder, Halaman, Kartu, Tombol } from "@/components/ui";
import { ambilBerita, cariBerita } from "@/lib/konten";

export default async function HalamanBerita({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await cariBerita(id);
  if (!b) notFound();

  const lainnya = (await ambilBerita()).filter((x) => x.id !== b.id).slice(0, 3);

  return (
    <>
      <header className="border-b border-garis bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-9 place-content-center rounded-dalam gradien-merek">
              <span className="grid grid-cols-2 gap-0.5" aria-hidden>
                <Finder className="size-2.5" warna="putih" />
                <Finder className="size-2.5" warna="putih" />
                <Finder className="size-2.5" warna="putih" />
                <span className="size-2.5" />
              </span>
            </span>
            <span className="text-subjudul text-institusi">Kalosara</span>
          </Link>
          <Link
            className="flex items-center gap-2 text-kecil font-bold text-tinta-55 transition-colors hover:text-institusi"
            href="/berita"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Semua berita
          </Link>
        </div>
      </header>

      <Halaman sempit>
        <article>
          <span className="font-mono text-data uppercase text-tinta-55">
            {tanggalPanjang(b.tanggal)}
          </span>
          <h1 className="mt-2 text-display text-tinta">{b.judul}</h1>
          <p className="mt-3 text-isi leading-relaxed text-tinta-70">{b.ringkas}</p>

          {b.gambar ? (
            <img
              alt={b.gambarAlt ?? ""}
              className="mt-6 w-full rounded-kartu border border-garis"
              src={`/gambar/${b.gambar}`}
            />
          ) : null}

          <div className="mt-6">
            <IsiBlok isi={b.isi} judulPoin="Ringkasnya" warna="adukan" />
          </div>
        </article>

        <p className="mt-8 border-t border-garis pt-5 font-mono text-data uppercase text-tinta-55">
          Sumber: {b.sumber}
        </p>

        <Kartu className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center" nada="adukan">
          <div className="min-w-0 flex-1">
            <h2 className="text-subjudul text-tinta">Belajar keamanan pembayaran digital</h2>
            <p className="mt-1 text-kecil text-tinta-70">
              Materi singkat, kuis, dan simulasi — semuanya gratis dan tanpa pendaftaran.
            </p>
          </div>
          <Tombol className="shrink-0" href="/masuk">
            Mulai belajar
            <ArrowRight className="size-4" aria-hidden />
          </Tombol>
        </Kartu>

        {lainnya.length > 0 ? (
          <section className="mt-10">
            <h2 className="mb-4 text-subjudul text-tinta">Kabar lainnya</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {lainnya.map((x) => (
                <KartuBerita b={x} key={x.id} />
              ))}
            </div>
          </section>
        ) : null}
      </Halaman>
    </>
  );
}
