"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { marketingNav } from "@easycampus/config";
import { ProductMenu } from "@/components/marketing/product-menu";

const serviceItems = [
  "Online Registration",
  "Student Information System",
  "School Fee Management",
  "Exam & Result Management",
  "Library Management",
  "Staff Information Management",
  "School Financial Accounting",
  "Staff Payroll Management",
  "Inventory Management",
  "Bus Transport & GPS",
  "Attendance Management"
];

export function MarketingShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="pb-10">
      <div className="border-b border-slate-200/60 bg-[#f7fbff]">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3 text-xs font-medium uppercase tracking-[0.16em] text-mist">
          <span>Smart University Operating System</span>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] text-brand shadow-soft">AI-powered academic operations</span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-white/50 bg-white/78 backdrop-blur-2xl">
        <div className="shell flex items-center justify-between gap-5 py-4">
          <Link href="/" className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand via-sky-400 to-cyan-300 text-lg font-semibold text-white shadow-soft">
              EC
            </span>
            <span>
              <span className="block text-xl font-semibold tracking-tight text-ink">EasyCampus</span>
              <span className="block text-sm text-mist">Smart University Operating System</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-mist xl:flex">
            <ProductMenu />
            {marketingNav.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/features" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/30 hover:text-brand">
              Explore Platform
            </Link>
            <Link href="/request-demo" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-600">
              Request Demo
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink lg:hidden"
          >
            Menu
          </button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-slate-200/70 bg-white lg:hidden">
            <div className="shell space-y-4 py-5">
              <ProductMenu />
              <div className="grid gap-3">
                {marketingNav.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-ink">
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/features" onClick={() => setMobileOpen(false)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-ink">
                  Explore Platform
                </Link>
                <Link href="/request-demo" onClick={() => setMobileOpen(false)} className="rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white shadow-soft">
                  Request Demo
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {children}

      <footer className="pt-16 text-mist">
        <div className="shell glass rounded-[36px] px-8 py-10">
          <div className="grid gap-8 xl:grid-cols-[1fr_1fr_1.4fr]">
            <div>
              <h3 className="text-xl font-semibold text-ink">EasyCampus</h3>
              <p className="mt-3 max-w-sm text-sm leading-6">
                AI-powered ERP for universities, colleges, and institutes that want operational clarity, student success visibility, and institutional scale.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-mist">Contact</h4>
              <div className="mt-4 space-y-4 text-sm leading-7">
                <div>
                  <p className="font-semibold text-ink">Phone Number</p>
                  <a href="tel:+91878020587" className="text-mist transition hover:text-brand">+91-8780 20587</a>
                </div>
                <div>
                  <p className="font-semibold text-ink">Email</p>
                  <a href="mailto:easycampus.erp@gmail.com" className="text-mist transition hover:text-brand">easycampus.erp@gmail.com</a>
                </div>
                <div>
                  <p className="font-semibold text-ink">Location</p>
                  <p>Ahmedabad GJ India - 380001</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-mist">Our Services</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {serviceItems.map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink shadow-soft">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
