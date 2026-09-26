export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ResellerPublicStorefront({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      merchantProducts: {
        include: { product: true },
      },
    },
  });

  if (!store) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 text-white font-black text-3xl shadow-2xl border-2 border-emerald-400">
              {store.storeName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/30 px-3 py-0.5 text-[11px] font-black text-emerald-300 uppercase tracking-wider">
                  GOLD SUPPLIER • VERIFIED
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-black">{store.storeName}</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                📍 {store.location || "Kigali Downtown Tropical Plaza"} • 📞 {store.phone || "0788000000"}
              </p>
            </div>
          </div>

          <div>
            <a
              href={`https://wa.me/250${store.phone?.replace(/^0/, "")}`}
              target="_blank"
              className="rounded-xl bg-emerald-500 px-5 py-3 text-xs font-extrabold text-slate-950 shadow-lg hover:bg-emerald-400 transition"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-xl font-black text-slate-900 mb-6">
          Store Catalog ({store.merchantProducts.length} Items)
        </h2>

        {store.merchantProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Nta gicuruzwa gihari kugeza ubu mu duka rya {store.storeName}.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {store.merchantProducts.map(({ product, retailPrice }) => (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>
                  <h3 className="mt-2 font-bold text-slate-900 text-base">{product.name}</h3>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Price</span>
                    <span className="text-base font-black text-slate-900">{retailPrice.toLocaleString()} RWF</span>
                  </div>

                  <Link
                    href={`/checkout?productId=${product.id}`}
                    className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Order Now
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