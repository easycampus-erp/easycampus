import type { KpiCard } from "../../types/src";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const sampleKpis: KpiCard[] = [
  { label: "Active Students", value: "18,460", helper: "Across UG, PG, and diploma cohorts" },
  { label: "Attendance Health", value: "93.4%", helper: "Institution-wide weekly average" },
  { label: "At-Risk Students", value: "284", helper: "Flagged for academic or attendance follow-up" },
  { label: "Mentor Pods", value: "486", helper: "Live groups running this semester" }
];
