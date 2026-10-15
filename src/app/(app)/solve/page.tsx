import { PracticeSetup } from "@/components/solve/practice-setup";
import { isCategoryKey, type CategoryKey } from "@/lib/constants";

export const metadata = { title: "Set up your practice" };

export default async function SolvePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initial: CategoryKey | null = isCategoryKey(category) ? category : null;
  return <PracticeSetup initialCategory={initial} />;
}
