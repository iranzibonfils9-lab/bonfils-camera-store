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

  const storeId = user.store.id;

  // 1. DYNAMIC CALCULATIONS FROM NEON DB
  const orders = await prisma.order.findMany({
    where: { storeId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const totalSales = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const totalOrders = orders.length;
  const merchantEarningTotal = orders.reduce((sum, ord) => sum + ord.merchantEarning, 0);

  // Unique Customers Count
  const uniqueCustomerPhones = new Set(orders.map((o) => o.customerPhone));
  const totalCustomers = uniqueCustomerPhones.size;

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* DASHBOARD HEADER */}
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              MERCHANT DASHBOARD • {user.store.storeName}
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage products, view live sales, track customer orders, and manage payouts.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/merchant/products/add"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
            >
              + Add New Product
            </Link>
            <Link
              href={`/stores/${user.store.slug}`}
              target="_blank"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:border-emerald-500"
            >
              Live View 👁️
            </Link>
          </div>
        </div>
      </section>

      {/* DYNAMIC METRICS CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Total Sales Volume</span>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {totalSales.toLocaleString()} RWF
            </p>
            <span className="mt-1 text-[11px] text-emerald-600 font-semibold">Gross store checkout</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Total Orders</span>
            <p className="mt-2 text-2xl font-black text-slate-900">{totalOrders}</p>
            <span className="mt-1 text-[11px] text-slate-500">Fulfilled & pending orders</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Total Unique Customers</span>
            <p className="mt-2 text-2xl font-black text-slate-900">{totalCustomers}</p>
            <span className="mt-1 text-[11px] text-slate-500">Direct buyers list</span>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase text-emerald-800">Wallet / Net Earning</span>
            <p className="mt-2 text-2xl font-black text-emerald-700">
              {merchantEarningTotal.toLocaleString()} RWF
            </p>
            <span className="mt-1 text-[11px] text-emerald-600 font-semibold">Ready for MoMo Payout</span>
          </div>
        </div>
      </section>

      {/* MANAGEMENT MODULES NAVIGATION */}
      <section className="mx-auto max-w-7xl px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Management Modules</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* CATALOG */}
          <Link
            href="/merchant/products"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-700 uppercase">Catalog</span>
              <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">Products &rarr;</span>
            </div>
            <h3 className="mt-3 font-extrabold text-slate-900 text-lg">Products & Inventory</h3>
            <p className="mt-1 text-xs text-slate-500">
              Manage your store inventory, pricing, stock status, and add custom hardware.
            </p>
          </Link>

          {/* ORDERS */}
          <Link
            href="/merchant/orders"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-700 uppercase">Sales</span>
              <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">Orders &rarr;</span>
            </div>
            <h3 className="mt-3 font-extrabold text-slate-900 text-lg">Orders & Deliveries</h3>
            <p className="mt-1 text-xs text-slate-500">
              Track customer orders, status fulfillments, generate invoices, and tracking.
            </p>
          </Link>

          {/* CUSTOMERS */}
          <Link
            href="/merchant/customers"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-700 uppercase">CRM</span>
              <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">Customers &rarr;</span>
            </div>
            <h3 className="mt-3 font-extrabold text-slate-900 text-lg">Customer Directory</h3>
            <p className="mt-1 text-xs text-slate-500">
              View customer profiles, purchase history, and direct phone contact details.
            </p>
          </Link>

          {/* STORE SETTINGS */}
          <Link
            href="/merchant/settings"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-700 uppercase">Profile</span>
              <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">Store Settings &rarr;</span>
            </div>
            <h3 className="mt-3 font-extrabold text-slate-900 text-lg">Store Profile & Branding</h3>
            <p className="mt-1 text-xs text-slate-500">
              Customize store name, Tropical Plaza location details, and phone contacts.
            </p>
          </Link>

          {/* PAYOUTS */}
          <Link
            href="/merchant/payouts"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-700 uppercase">Payouts</span>
              <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">Withdrawals &rarr;</span>
            </div>
            <h3 className="mt-3 font-extrabold text-slate-900 text-lg">MTN MoMo Payouts</h3>
            <p className="mt-1 text-xs text-slate-500">
              Manage your wallet earnings, request MTN MoMo withdrawals, and transaction logs.
            </p>
          </Link>

          {/* PUBLIC STORE */}
          <Link
            href={`/stores/${user.store.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-700 uppercase">Live View</span>
              <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600">Public Store &rarr;</span>
            </div>
            <h3 className="mt-3 font-extrabold text-slate-900 text-lg">Public Storefront</h3>
            <p className="mt-1 text-xs text-slate-500">
              Preview how local customers see your store front in Kigali.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}