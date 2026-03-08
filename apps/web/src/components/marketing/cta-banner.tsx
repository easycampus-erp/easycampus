import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-10">
      <div className="shell rounded-[32px] gradient-panel p-8 shadow-soft">
        <h2 className="text-3xl font-semibold tracking-tight">Build a smarter university experience with EasyCampus.</h2>
        <p className="mt-3 max-w-2xl text-white/80">
          Launch marketing, dashboards, APIs, mobile experiences, and institutional workflows from one product foundation.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/request-demo" className="rounded-full bg-white px-5 py-3 font-semibold text-ink">
            Request Demo
          </Link>
          <Link href="/admin" className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white">
            Preview Dashboards
          </Link>
        </div>
      </div>
    </section>
  );
}

