import { DetailPage } from "@/components/marketing/detail-page";

export default function FeaturesPage() {
  return (
    <DetailPage
      eyebrow="University ERP Features"
      title="Every core academic workflow in one platform"
      description="From student lifecycle management to mentor mapping, attendance, marks, communication, and analytics, EasyCampus is designed as the operational core of a modern campus."
      sections={[
        { title: "Student lifecycle management", body: "Admission, enrollment, progression, records, and academic visibility." },
        { title: "Mentor-student mapping", body: "Assign groups intelligently and track structured engagement." },
        { title: "Attendance and marks", body: "Support fast data entry, threshold alerts, and result generation." }
      ]}
    />
  );
}

