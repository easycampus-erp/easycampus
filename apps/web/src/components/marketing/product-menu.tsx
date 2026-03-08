"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { productMenu } from "@easycampus/config";

export function ProductMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/30 hover:text-brand"
      >
        Products
      </button>
      {open ? (
        <div className="absolute left-1/2 top-[calc(100%+0.8rem)] z-40 w-[420px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_24px_70px_rgba(18,38,63,0.16)]">
          <div className="mb-2 px-3 py-2">
            <p className="section-kicker text-[11px] font-semibold text-brand">Product Family</p>
            <p className="mt-2 text-sm text-mist">Choose the workspace built for each campus stakeholder.</p>
          </div>
          <div className="grid gap-2 max-h-[420px] overflow-y-auto pr-1">
            {productMenu.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4 transition hover:border-brand/20 hover:bg-white hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">{product.eyebrow}</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink">{product.name}</h3>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">View</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-mist line-clamp-2">{product.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
