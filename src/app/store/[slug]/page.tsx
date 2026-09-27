export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function StoresMainPage() {
  // Find primary store or any available store
  const store = await prisma.store.findFirst({
    include: {
      merchantProducts: {
        include: { product: true },
      },
    },
  });

  if (!store) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-800">No Registered Stores Found</h1>
          <p className="mt-2 text-xs text-slate-500">
            Nta duka rirandikwa muri database. Kora Login/Register nka Reseller ureme iduka ryawe.
          </p>
          <Link
            href="/auth/register"
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white"
          >
            Register Reseller Store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <section className="bg-slate-900 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider border border-emerald-500/30">
            OFFICIAL SUPPLIER STOREFRONT
          </span>
          <h1 className="mt-3 text-3xl font-black">{store.storeName}</h1>
          <p className="mt-1 text-xs text-slate-300">
            📍 {store.location || "Kigali Downtown Tropical Plaza"} • 📞 {store.phone || "0788000000"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Available Products ({store.merchantProducts.length})
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {store.merchantProducts.map(({ product, retailPrice }) => (
            <div
              key={product.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                <h3 className="mt-2 font-bold text-slate-900 text-sm">{product.name}</h3>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">
                  {retailPrice.toLocaleString()} RWF
                </span>
                <Link
                  href="/products"
                  className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white"
                >
                  Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}