import LayarProfil from "@/components/layar/LayarProfil";
import { ambilRingkasKonten } from "@/lib/konten";

export default async function HalamanProfil() {
  return <LayarProfil konten={await ambilRingkasKonten()} />;
}
