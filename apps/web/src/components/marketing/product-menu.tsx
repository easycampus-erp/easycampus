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
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(880px,calc(100vw-2rem))] rounded-[32px] border border-white/70 bg-white/92 p-5 shadow-[0_24px_80px_rgba(18,38,63,0.16)] backdrop-blur-2xl lg:w-[880px]">
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {productMenu.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5 transition hover:-translate-y-1 hover:border-brand/20 hover:bg-white"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{product.eyebrow}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{product.name}</h3>
                <p className="mt-2 text-sm leading-7 text-mist">{product.blurb}</p>
                <p className="mt-3 text-xs font-medium text-slate-500">{product.audience}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
