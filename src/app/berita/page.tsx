import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { Anak, Berurutan } from "@/components/gerak";
import KartuBerita from "@/components/KartuBerita";
import { Finder, Halaman } from "@/components/ui";
import { ambilBerita } from "@/lib/konten";

/**
 * Sengaja BUKAN bagian dari dashboard peserta.
 *
 * Empat kelompok fitur di blok konsep tetap empat. Berita adalah komunikasi
 * kelembagaan di halaman publik — bisa dibaca orang yang belum masuk sama
 * sekali, sama seperti halaman depan dan halaman Tentang.
 */
export default async function DaftarBerita() {
  const berita = await ambilBerita();

  return (
    <>
      <header className="border-b border-garis bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-9 place-content-center rounded-dalam gradien-merek">
              <span className="grid grid-cols-2 gap-0.5" aria-hidden>
                <Finder className="size-2.5" warna="putih" />
                <Finder className="size-2.5" warna="putih" />
                <Finder className="size-2.5" warna="putih" />
                <span className="size-2.5" />
              </span>
            </span>
            <span className="text-subjudul text-institusi">PeKA</span>
          </Link>
          <Link
            className="flex items-center gap-2 text-kecil font-bold text-tinta-55 transition-colors hover:text-institusi"
            href="/"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Halaman depan
          </Link>
        </div>
      </header>

      <Halaman>
        <div className="mb-8">
          <span className="font-mono text-data uppercase text-tinta-55">Kabar</span>
          <h1 className="mt-1 text-display text-tinta">Berita &amp; pengumuman</h1>
          <p className="mt-2 max-w-2xl text-isi text-tinta-70">
            Kabar dari Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Tenggara seputar keamanan
            pembayaran digital. Setiap kabar mencantumkan tanggal dan sumbernya.
          </p>
        </div>

        {berita.length === 0 ? (
          <div className="rounded-kartu border border-dashed border-garis p-12 text-center">
            <Newspaper className="mx-auto mb-3 size-10 text-tinta-55" aria-hidden />
            <p className="text-isi text-tinta-70">Belum ada berita yang diterbitkan.</p>
          </div>
        ) : (
          <Berurutan className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {berita.map((b) => (
              <Anak key={b.id}>
                <KartuBerita b={b} />
              </Anak>
            ))}
          </Berurutan>
        )}
      </Halaman>
    </>
  );
}
