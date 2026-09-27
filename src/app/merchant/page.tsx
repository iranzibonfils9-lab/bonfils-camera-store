export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MerchantDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "MERCHANT" || !user.store) {
    redirect("/auth/login");
  }

  const store = user.store;

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              MERCHANT DASHBOARD • {store.storeName}
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Reseller Partner Portal
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/stores"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-emerald-700 flex items-center gap-2"
            >
              <span>🏪</span> View Live Public Store
            </Link>
          </div>
        </div>

        {/* QUICK NAVIGATION GRID */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <Link
            href="/merchant/products"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-500 transition"
          >
            <h3 className="text-lg font-bold text-slate-900">🛍️ Add Central Products</h3>
            <p className="mt-1 text-xs text-slate-500">
              Toranya ibikoresho wo muri stock ya BONFILS ubishyire muri store yawe.
            </p>
          </Link>

          <Link
            href="/merchant/payouts"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-500 transition"
          >
            <h3 className="text-lg font-bold text-slate-900">💳 MTN MoMo Payouts</h3>
            <p className="mt-1 text-xs text-slate-500">
              Saba inyungu zawe no kuzijyana kuri MTN Mobile Money account.
            </p>
          </Link>

          <Link
            href="/merchant/sourcing"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-500 transition"
          >
            <h3 className="text-lg font-bold text-slate-900">🇨🇳 China Sourcing</h3>
            <p className="mt-1 text-xs text-slate-500">
              Saba gutumiza ibikoresho bishya muri China utipagurije.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}