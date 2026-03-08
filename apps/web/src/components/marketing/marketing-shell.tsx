import type { ReactNode } from "react";
import Link from "next/link";
import { marketingNav } from "@easycampus/config";

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-300 text-white shadow-soft">EC</span>
            <span>
              EasyCampus
              <span className="block text-sm font-normal text-mist">Smart University Operating System</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm text-mist">
            {marketingNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            <Link href="/features" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold">
              Explore Platform
            </Link>
            <Link href="/request-demo" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft">
              Request Demo
            </Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="py-10 text-mist">
        <div className="shell grid gap-6 md:grid-cols-4">
          <div>
            <h3 className="mb-2 font-semibold text-ink">EasyCampus</h3>
            <p className="text-sm">AI-powered ERP for universities, colleges, and modern academic operations.</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-ink">Platform</h4>
            <div className="space-y-2 text-sm">
              <Link href="/features">Features</Link>
              <Link href="/university-erp">University ERP</Link>
              <Link href="/analytics">Analytics</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-ink">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link href="/blog">Blog</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/request-demo">Deployment Ready</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-ink">Actions</h4>
            <div className="space-y-2 text-sm">
              <Link href="/contact">Contact</Link>
              <Link href="/request-demo">Request Demo</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

