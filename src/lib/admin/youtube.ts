import "server-only";

/**
 * Mengubah tautan YouTube jadi ID video 11 karakter, atau `null` kalau
 * bukan tautan YouTube yang dikenali.
 *
 * Ini bukan sekadar kenyamanan — ID yang lolos dari sini adalah satu-satunya
 * hal dari isian admin yang dipakai menyusun alamat `<iframe>` di sisi
 * peserta. Dengan memvalidasi bentuknya ketat di sini, alamat video yang
 * dirender tidak pernah bisa memuat domain atau path lain selain yang
 * dibuat aplikasi sendiri.
 */
export function idYoutube(masukan: string): string | null {
  const s = masukan.trim();
  const ID = /^[\w-]{11}$/;

  // Tautan mentah — sudah pas.
  if (ID.test(s)) return s;

  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\.|^m\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return ID.test(id) ? id : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") {
      const id = u.searchParams.get("v") ?? "";
      return ID.test(id) ? id : null;
    }
    const cocok = /^\/(embed|shorts|live)\/([\w-]{11})/.exec(u.pathname);
    if (cocok) return cocok[2];
  }

  return null;
}
