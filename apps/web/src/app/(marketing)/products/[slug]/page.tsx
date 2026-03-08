import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureSection } from "@/components/marketing/feature-section";
import { productMenu } from "@easycampus/config";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productMenu.find((entry) => entry.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="py-20 lg:py-24">
        <div className="shell">
          <div className="glass max-w-5xl rounded-[38px] p-8 lg:p-10">
            <p className="section-kicker text-xs font-semibold text-brand">{product.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">{product.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-mist">{product.blurb}</p>
            <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-mist">
              Best for: {product.audience}
            </div>
          </div>
        </div>
      </section>
      <FeatureSection title={`${product.name} modules`} description="A focused product layer inside the EasyCampus product family." items={product.sections} />
      <CtaBanner />
    </>
  );
}
