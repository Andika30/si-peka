import { redirect } from "next/navigation";
import { adminSaatIni } from "@/lib/admin/sesi";
import FormMasuk from "./FormMasuk";

export default async function HalamanMasukAdmin() {
  // Yang sudah masuk tidak perlu melihat layar ini lagi.
  if (await adminSaatIni()) redirect("/admin");
  return <FormMasuk />;
}
