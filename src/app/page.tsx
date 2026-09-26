export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  // Fetch products live from database
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HERO SECTION */}
      <section className="bg-slate-900 py-16 px-6 text-white text-center">
        <div className="mx-auto max-w-4xl">
          <span className="rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            BONFILS CAMERA STORE • RWANDA B2B & RETAIL MARKETPLACE
          </span>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            High-Quality CCTV & Security Equipment in Kigali
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto">
            Gura ibicuruzwa bya CCTV Cameras, DVR Systems, no kubikoresho by'umutekano ku giciro cy'amatsinda.
          </p>
        </div>
      </section>

      {/* LIVE PRODUCTS MARKETPLACE */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Featured Security Products</h2>
            <p className="text-xs text-slate-500">Live products from verified suppliers & resellers.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {p.category}
                </span>
                <h3 className="mt-2 font-bold text-slate-900 text-base">{p.name}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {p.description || "High quality surveillance gear."}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Retail Price</span>
                  <span className="text-base font-black text-slate-900">
                    {p.suggestedRetail.toLocaleString()} RWF
                  </span>
                </div>

                <Link
                  href={`/checkout?productId=${p.id}`}
                  className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}