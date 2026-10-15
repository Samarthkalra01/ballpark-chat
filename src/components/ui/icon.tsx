import {
  Compass,
  Table2,
  Target,
  PieChart,
  Layers,
  IndianRupee,
  Calculator,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Compass,
  Table2,
  Target,
  PieChart,
  Layers,
  IndianRupee,
  Calculator,
  Lightbulb,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? Compass;
  return <Cmp className={className} />;
}
