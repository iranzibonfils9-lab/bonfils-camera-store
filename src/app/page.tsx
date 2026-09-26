export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  // Fetch all active merchant products for Homepage showcase
  const publicProducts = await prisma.merchantProduct.findMany({
    where: { isListed: true },
    include: {
      product: true,
      store: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* HERO SECTION */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <span className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest border border-emerald-500/30">
            BONFILS CAMERA B2B & RETAIL MARKETPLACE
          </span>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Kigali Security & Surveillance Hub
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Buy authentic Hikvision, Dahua CCTV Cameras, DVRs, and Accessories directly from verified resellers at Kigali Downtown Tropical Plaza.
          </p>
        </div>
      </section>

      {/* PRODUCTS DISPLAY */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Cameras & Hardware</h2>
            <p className="text-xs text-slate-500">Live products supplied by verified marketplace resellers</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-emerald-600 hover:underline"
          >
            View All Catalog &rarr;
          </Link>
        </div>

        {publicProducts.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center">
            <p className="text-slate-500 font-medium">No products listed on marketplace home yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicProducts.map((mp) => (
              <div
                key={mp.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {mp.product.brand}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      {mp.store.storeName}
                    </span>
                  </div>

                  <h3 className="mt-3 font-bold text-slate-900 text-lg">
                    {mp.product.name}
                  </h3>
                  <p className="text-xs text-slate-500">{mp.product.category}</p>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                    {mp.product.description || "High performance security equipment available in Kigali."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Retail Price</span>
                    <span className="text-lg font-extrabold text-emerald-600">
                      {mp.retailPrice.toLocaleString()} RWF
                    </span>
                  </div>

                  <Link
                    href={`/products/${mp.productId}`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}