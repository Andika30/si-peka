import LayarSimulasi from "@/components/layar/LayarSimulasi";
import { ambilSkenario } from "@/lib/konten";

export default async function HalamanDaftarSimulasi() {
  return <LayarSimulasi skenario={await ambilSkenario()} />;
}
