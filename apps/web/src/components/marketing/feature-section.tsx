interface FeatureSectionProps {
  title: string;
  description: string;
  items: { title: string; body: string }[];
}

export function FeatureSection({ title, description, items }: FeatureSectionProps) {
  return (
    <section className="py-10">
      <div className="shell">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-3 text-mist">{description}</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="glass rounded-3xl p-6">
              <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm text-mist">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

