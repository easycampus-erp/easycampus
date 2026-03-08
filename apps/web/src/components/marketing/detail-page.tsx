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
      <section className="py-20 lg:py-24">
        <div className="shell">
          <div className="glass max-w-5xl rounded-[38px] p-8 lg:p-10">
            <p className="section-kicker text-xs font-semibold text-brand">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-mist">{description}</p>
          </div>
        </div>
      </section>
      <FeatureSection title="Platform details" description="Implementation-ready content for the EasyCampus product experience." items={sections} />
      <CtaBanner />
    </>
  );
}
