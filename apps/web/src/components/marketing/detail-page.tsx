import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureSection } from "@/components/marketing/feature-section";

interface DetailPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[];
}

export function DetailPage({ eyebrow, title, description, sections }: DetailPageProps) {
  return (
    <>
      <section className="py-20">
        <div className="shell max-w-4xl">
          <span className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">{eyebrow}</span>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-5 text-lg text-mist">{description}</p>
        </div>
      </section>
      <FeatureSection title="Platform details" description="Implementation-ready content for the EasyCampus product experience." items={sections} />
      <CtaBanner />
    </>
  );
}

