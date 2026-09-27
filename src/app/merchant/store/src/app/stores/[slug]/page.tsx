export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function PublicStorefrontSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Search store by slug, ID, or fallback to first active store
  let store = await prisma.store.findFirst({
    where: {
      OR: [{ slug: slug }, { id: slug }],
    },
    include: {
      merchantProducts: {
        include: { product: true },
      },
    },
  });

  if (!store) {
    store = await prisma.store.findFirst({
      include: {
        merchantProducts: {
          include: { product: true },
        },
      },
    });
  }

  const phoneFormatted = store?.phone ? store.phone.replace(/[^0-9]/g, "") : "250788000000";

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-6 py-12 text-white shadow-xl">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-600 text-white font-black text-3xl shadow-2xl border-2 border-emerald-400">
              {store?.storeName?.charAt(0) || "B"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/30 px-3 py-0.5 text-[11px] font-black text-emerald-300 uppercase tracking-wider border border-emerald-500/40">
                  ✓ VERIFIED GOLD SUPPLIER
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-black">{store?.storeName || "BONFILS CAMERA STORE"}</h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>📍 {store?.location || "Kigali Downtown Tropical Plaza"}</span>
                <span>•</span>
                <span>📞 {store?.phone || "0788000000"}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={`https://wa.me/${phoneFormatted}?text=Hello%20${encodeURIComponent(
                store?.storeName || "Store"
              )},%20I%20want%20to%20order%20CCTV%20cameras.`}
              target="_blank"
              className="rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-slate-950 shadow-lg hover:bg-emerald-400 transition flex items-center gap-2"
            >
              <span>💬</span> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-2xl font-black text-slate-900 mb-6">
          Store Catalog ({store?.merchantProducts.length || 0} Products)
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {store?.merchantProducts.map(({ product, retailPrice }) => (
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
                <span className="text-base font-black text-slate-900">
                  {retailPrice.toLocaleString()} RWF
                </span>
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
      </section>
    </main>
  );
}