interface FeatureSectionProps {
  title: string;
  description: string;
  items: { title: string; body: string }[];
}

export function FeatureSection({ title, description, items }: FeatureSectionProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="section-kicker text-xs font-semibold text-brand">Platform Layers</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-8 text-mist">{description}</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <article key={item.title} className="glass group rounded-[30px] p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-mist">0{index + 1}</span>
                <span className="h-2.5 w-2.5 rounded-full bg-brand/70 transition group-hover:bg-meadow" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mist">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
