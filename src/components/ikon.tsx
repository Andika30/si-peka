import {
  Award,
  Bell,
  Compass,
  CreditCard,
  Crown,
  Gamepad2,
  Gavel,
  KeyRound,
  LayoutGrid,
  type LucideIcon,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Sprout,
  Target,
  TriangleAlert,
} from "lucide-react";

/** Nama ikon disimpan di JSON, bukan komponen — supaya konten tetap data. */
const PETA: Record<string, LucideIcon> = {
  kartu: CreditCard,
  perisai: ShieldCheck,
  kunci: KeyRound,
  waspada: TriangleAlert,
  qr: QrCode,
  lonceng: Bell,
  tunas: Sprout,
  target: Target,
  mahkota: Crown,
  kompas: Compass,
  piala: Award,
  simulasi: Gamepad2,
  adukan: Gavel,
  feedback: MessageSquare,
};

export const ambilIkon = (nama: string): LucideIcon => PETA[nama] ?? LayoutGrid;
