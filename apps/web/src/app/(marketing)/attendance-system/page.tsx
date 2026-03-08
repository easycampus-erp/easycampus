import { DetailPage } from "@/components/marketing/detail-page";

export default function AttendanceSystemPage() {
  return (
    <DetailPage
      eyebrow="Attendance System"
      title="Reliable attendance capture with instant visibility"
      description="Record lecture and lab attendance quickly while giving mentors and administrators real-time trends and defaulter alerts."
      sections={[
        { title: "Lecture attendance", body: "Period-wise capture linked to faculty, subject, and section." },
        { title: "Lab attendance", body: "Support split batches and practical sessions with audit trails." },
        { title: "Defaulter alerts", body: "Automate escalation when thresholds are crossed." }
      ]}
    />
  );
}

