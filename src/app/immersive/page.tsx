import ZcashImmersivePage from "@/components/ZcashImmersivePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zcash Israel — החוויה האימרסיבית",
  description: "גלה את כוח הפרטיות המוכחת מתמטית של Zcash — השחרור הקריפטוגרפי",
};

export default function ImmersivePage() {
  return <ZcashImmersivePage />;
}
