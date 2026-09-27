export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function MerchantStoreManagementPage() {
  const store = await prisma.store.findFirst({
    include: {
      merchantProducts: {
        include: { product: true },
      },
    },
  });

  const slug = store?.slug || "bonfils-tropical";
  const publicUrl = `/stores/${slug}`;

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              PUBLIC STOREFRONT MANAGER
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Live Storefront Settings & Preview
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Cunga uburyo iduka ryawe rigaragara mu maso y'abakiriya muri Kigali no kuri internet.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={publicUrl}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-emerald-700 flex items-center gap-2"
            >
              <span>👁️</span> Open Live Public Storefront
            </Link>
            <Link
              href="/merchant"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-emerald-500 transition"
            >
              &larr; Back to Dashboard
            </Link>
          </div>
        </div>

        {/* PREVIEW CARDS */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              Iduka Ryawe Profiling
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 block">Store Name:</span>
                <p className="text-sm font-black text-slate-900">{store?.storeName || "BONFILS CAMERA STORE"}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 block">Store Public Link:</span>
                <p className="font-mono text-emerald-600 bg-emerald-50 p-2 rounded-xl text-[11px] font-bold">
                  https://bonfils-camera-store.vercel.app/stores/{slug}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-500 block">Location:</span>
                <p className="font-bold text-slate-800">{store?.location || "Kigali Downtown Tropical Plaza"}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 block">Active Products:</span>
                <p className="font-bold text-slate-800">{store?.merchantProducts.length || 0} Listed Items</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href={publicUrl}
                className="w-full block text-center rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Launch Public View Page
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-2">
              Live Catalog Preview
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Ibicuruzwa abakiriya babona ku paji y'iduka ryawe.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
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
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                      Live
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}