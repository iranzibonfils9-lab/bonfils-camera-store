export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function MerchantStorePage() {
  const store = await prisma.store.findFirst({
    include: {
      merchantProducts: {
        include: { product: true },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              PUBLIC STOREFRONT PREVIEW
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              {store?.storeName || "BONFILS CAMERA STORE"}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              📍 {store?.location || "Kigali Downtown Tropical Plaza"}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/stores"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-emerald-700 flex items-center gap-2"
            >
              <span>👁️</span> Open All Active Stores Directory
            </Link>
            <Link
              href="/merchant"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-emerald-500 transition"
            >
              &larr; Dashboard
            </Link>
          </div>
        </div>

        {/* CATALOG PREVIEW */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">
            Live Store Catalog ({store?.merchantProducts.length || 0} Items)
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {store?.merchantProducts.map(({ product, retailPrice }) => (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h3 className="mt-2 font-bold text-slate-900 text-sm">{product.name}</h3>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="font-black text-emerald-600 text-sm">
                    {retailPrice.toLocaleString()} RWF
                  </span>
                  <Link
                    href="/products"
                    className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}