import { DetailPage } from "@/components/marketing/detail-page";

export default function FaqPage() {
  return (
    <DetailPage
      eyebrow="FAQ"
      title="Answers for university leadership, IT teams, and operations heads"
      description="Help decision-makers understand implementation timelines, role-based dashboards, mobile access, and integration paths."
      sections={[
        { title: "Implementation", body: "Typical rollouts range from 6 to 16 weeks depending on modules and migration complexity." },
        { title: "Role dashboards", body: "Admins, faculty, mentors, and students each get distinct experiences." },
        { title: "Mobile support", body: "The student experience includes a dedicated React Native app shell." }
      ]}
    />
  );
}

