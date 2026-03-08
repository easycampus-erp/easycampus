export type Role = "admin" | "faculty" | "mentor" | "student";

export interface KpiCard {
  label: string;
  value: string;
  helper: string;
}

export interface DashboardPanel {
  title: string;
  description: string;
  items: string[];
}

