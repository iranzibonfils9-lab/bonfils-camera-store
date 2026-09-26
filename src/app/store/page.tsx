export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function PublicStoresPage() {
  const stores = await prisma.store.findMany({
    include: {
      merchantProducts: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      {/* HERO BANNER */}
      <section className="bg-slate-900 py-12 px-6 text-white text-center">
        <div className="mx-auto max-w-4xl">
          <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
            VERIFIED SUPPLIER DIRECTORY
          </span>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">
            Explore Reseller Stores at Kigali Downtown Tropical Plaza
          </h1>
          <p className="mt-2 text-xs text-slate-300">
            Sura amaduka agurisha CCTV cameras n'ibikoresho by'umutekano uducuruzi muri Kigali.
          </p>
        </div>
      </section>

      {/* STORES GRID */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <div
              key={s.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl shadow-md">
                    {s.storeName.charAt(0)}
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-800 flex items-center gap-1">
                    ✓ Verified Gold Supplier
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-black text-slate-900">{s.storeName}</h2>
                <p className="mt-1 text-xs font-bold text-slate-500 flex items-center gap-1">
                  📍 {s.location || "Tropical Plaza, Kigali Downtown"}
                </p>

                <p className="mt-3 text-xs text-slate-600 line-clamp-3">
                  {s.description || "Official security hardware vendor."}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Products Listed</span>
                  <span className="text-sm font-black text-slate-900">{s.merchantProducts.length} Items</span>
                </div>

                <Link
                  href={`/stores/${s.slug}`}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition"
                >
                  Visit Storefront &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}