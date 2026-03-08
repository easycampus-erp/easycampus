import { DetailPage } from "@/components/marketing/detail-page";

export default function ContactPage() {
  return (
    <DetailPage
      eyebrow="Contact"
      title="Talk to the team behind EasyCampus"
      description="Share your institution size, challenges, and desired modules to start a tailored implementation conversation."
      sections={[
        { title: "Consultation", body: "Scope rollout plans for universities, colleges, and departments." },
        { title: "Partnerships", body: "Discuss channel, implementation, or regional expansion opportunities." },
        { title: "Next step", body: "Route prospects into demo booking and solution design." }
      ]}
    />
  );
}

