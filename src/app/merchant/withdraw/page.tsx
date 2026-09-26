"use client";

import { useState } from "react";
import Link from "next/link";

const stats = [
  {
    label: "Total Sales",
    value: "0 RWF",
    note: "This month",
  },
  {
    label: "Orders",
    value: "0",
    note: "All orders",
  },
  {
    label: "Earnings",
    value: "0 RWF",
    note: "Available balance",
  },
  {
    label: "Products",
    value: "0",
    note: "In your store",
  },
];

const navigation = [
  { name: "Dashboard", href: "/merchant" },
  { name: "My Store", href: "/merchant/store" },
  { name: "Products", href: "/merchant/products" },
  { name: "Orders", href: "/merchant/orders" },
  { name: "Customers", href: "/merchant/customers" },
];

export default function MerchantDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-xl font-bold tracking-tight">
              <span className="text-emerald-500">BON</span>
              <span className="text-[#0B192C]">FILS</span>
            </p>

            <p className="text-[9px] tracking-[0.22em] text-slate-400">
              MERCHANT
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg border border-slate-200 p-2.5"
            aria-label="Open menu"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-slate-700" />
              <span className="block h-0.5 w-5 bg-slate-700" />
              <span className="block h-0.5 w-5 bg-slate-700" />
            </div>
          </button>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#0B192C] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="border-b border-slate-700 px-6 py-6">
              <Link href="/" className="block">
                <div className="text-2xl font-bold tracking-tight">
                  <span className="text-emerald-400">BON</span>
                  <span className="text-white">FILS</span>
                </div>

                <p className="mt-1 text-[10px] tracking-[0.25em] text-slate-400">
                  CAMERA MARKETPLACE
                </p>
              </Link>
            </div>

            {/* Merchant Profile */}
            <div className="border-b border-slate-700 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 font-bold text-white">
                  B
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    Merchant Account
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    BONFILS Seller
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
              <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Merchant Menu
              </p>

              <div className="space-y-1">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      index === 0
                        ? "bg-[#1E3E62] text-white"
                        : "text-slate-300 hover:bg-[#1E3E62] hover:text-white"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                      {index === 0 && "⌂"}
                      {index === 1 && "▣"}
                      {index === 2 && "▤"}
                      {index === 3 && "◫"}
                      {index === 4 && "♙"}
                    </span>

                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Bottom Links */}
            <div className="border-t border-slate-700 p-4">
              <Link
                href="/products"
                className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-[#1E3E62] hover:text-white"
              >
                <span>◈</span>
                Browse Marketplace
              </Link>

              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-[#1E3E62] hover:text-white"
              >
                <span>←</span>
                Back to Website
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          />
        )}

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            {/* Top Bar */}
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Merchant Dashboard
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B192C] md:text-4xl">
                  Welcome back, Merchant
                </h1>

                <p className="mt-2 text-slate-600">
                  Manage your store, products, customers and orders from one
                  place.
                </p>
              </div>

              <Link
                href="/merchant/products"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                + Add Products
              </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-2xl font-bold text-[#0B192C]">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Main Cards */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Store */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-semibold text-emerald-600">
                      Your Store
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#0B192C]">
                      Bonfils Security Hub
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Your marketplace storefront is ready to be managed.
                    </p>
                  </div>

                  <Link
                    href="/merchant/store"
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#1E3E62] hover:text-[#1E3E62]"
                  >
                    View Store
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Store Status
                    </p>

                    <p className="mt-2 font-semibold text-emerald-600">
                      Active
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Products
                    </p>

                    <p className="mt-2 font-semibold text-[#0B192C]">
                      0
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Store Link
                    </p>

                    <p className="mt-2 truncate text-sm font-semibold text-[#1E3E62]">
                      bonfils.store/merchant
                    </p>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="rounded-2xl bg-[#1E3E62] p-6 text-white shadow-sm">
                <p className="text-sm font-semibold text-emerald-300">
                  Available Earnings
                </p>

                <p className="mt-4 text-3xl font-bold">
                  0 RWF
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  Earnings from your marketplace sales.
                </p>

                <Link
                  href="/merchant/withdraw"
                  className="mt-7 block w-full rounded-xl bg-emerald-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-600"
                >
                  Withdraw Earnings
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <section className="mt-8">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-600">
                  Quick Actions
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0B192C]">
                  Manage your marketplace business
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/merchant/store"
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="text-2xl">▣</div>

                  <h3 className="mt-4 font-bold text-[#0B192C]">
                    My Store
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Manage your storefront and listings.
                  </p>
                </Link>

                <Link
                  href="/merchant/products"
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="text-2xl">▤</div>

                  <h3 className="mt-4 font-bold text-[#0B192C]">
                    Add Products
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose BONFILS products for your store.
                  </p>
                </Link>

                <Link
                  href="/merchant/orders"
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="text-2xl">◫</div>

                  <h3 className="mt-4 font-bold text-[#0B192C]">
                    Orders
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Track customer orders and fulfillment.
                  </p>
                </Link>

                <Link
                  href="/merchant/customers"
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="text-2xl">♙</div>

                  <h3 className="mt-4 font-bold text-[#0B192C]">
                    Customers
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    View and manage your customers.
                  </p>
                </Link>
              </div>
            </section>

            {/* How It Works */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-600">
                How BONFILS Marketplace Works
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#0B192C]">
                Sell BONFILS products through your own store
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    1
                  </div>

                  <h3 className="mt-4 font-bold text-[#0B192C]">
                    Choose Products
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select products from BONFILS stock and add them to your
                    marketplace store.
                  </p>
                </div>

                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    2
                  </div>

                  <h3 className="mt-4 font-bold text-[#0B192C]">
                    Set Your Price
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Set your own selling price and earn from the difference.
                  </p>
                </div>

                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    3
                  </div>

                  <h3 className="mt-4 font-bold text-[#0B192C]">
                    Sell & Earn
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Customers buy through your store and you track your sales
                    and earnings here.
                  </p>
                </div>
              </div>
            </section>

            <footer className="mt-10 border-t border-slate-200 py-6 text-center text-sm text-slate-400">
              © 2026 BONFILS CAMERA STORE. All rights reserved.
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}