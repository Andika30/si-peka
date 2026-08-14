import LayarKuesioner from "@/components/layar/LayarKuesioner";
import { ambilSus } from "@/lib/konten";

export default async function HalamanKuesioner() {
  return <LayarKuesioner sus={await ambilSus()} />;
}
