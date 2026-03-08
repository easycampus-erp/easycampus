export const mobileNavigation = [
  "Dashboard",
  "Attendance",
  "Marks",
  "Timetable",
  "Assignments",
  "Mentor",
  "Notifications"
] as const;

export type MobileSection = (typeof mobileNavigation)[number];

