import type { KpiCard } from "../../types/src";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const sampleKpis: KpiCard[] = [
  { label: "Total Students", value: "24,880", helper: "Across all departments" },
  { label: "Attendance", value: "91.8%", helper: "Institution average" },
  { label: "Defaulters", value: "128", helper: "Need immediate action" },
  { label: "Mentor Groups", value: "312", helper: "Active this semester" }
];


