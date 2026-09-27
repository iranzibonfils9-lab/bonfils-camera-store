export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function PublicStoresDirectoryPage() {
  const stores = await prisma.store.findMany({
    include: {
      merchantProducts: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <section className="bg-slate-900 px-6 py-12 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider border border-emerald-500/30">
            BONFILS RESELLER NETWORK
          </span>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">
            Verified CCTV Camera Stores in Rwanda
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-slate-300">
            Shakisha amaduka yo mu mugi wa Kigali n'ahandi akorana na BONFILS CAMERA STORE.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((st) => (
            <div
              key={st.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl">
                    {st.storeName.charAt(0)}
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                    ✓ Gold Supplier
                  </span>
                </div>

                <h3 className="mt-4 font-black text-slate-900 text-lg">
                  {st.storeName}
                </h3>
                <p className="mt-1 text-xs text-slate-500">📍 {st.location || "Kigali Downtown"}</p>
              </div>

              <div className="mt-6">
                <Link
                  href={`/stores/${st.slug}`}
                  className="block w-full text-center rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-emerald-600 transition"
                >
                  Visit Public Storefront &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}