import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Cangkang from "@/components/admin/Cangkang";
import { adminSaatIni, akhiriSesi } from "@/lib/admin/sesi";

async function keluar() {
  "use server";
  await akhiriSesi();
  redirect("/admin/masuk");
}

/**
 * Penjaga panel.
 *
 * Yang dijaga di sini hanya TAMPILAN. Server action bisa dipanggil langsung
 * tanpa melewati tata letak mana pun, jadi setiap aksi yang mengubah data
 * memanggil `wajibAdmin()` sendiri.
 */
export default async function TataLetakPanel({ children }: { children: ReactNode }) {
  const admin = await adminSaatIni();
  if (!admin) redirect("/admin/masuk");

  return (
    <Cangkang admin={{ nama: admin.nama, pengguna: admin.pengguna }} keluar={keluar}>
      {children}
    </Cangkang>
  );
}
