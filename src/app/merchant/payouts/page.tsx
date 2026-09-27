export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function MerchantPayoutsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "MERCHANT" || !user.store) {
    redirect("/auth/login");
  }

  const store = user.store;

  // 1. Fetch Orders for this store to calculate real balances
  const storeOrders = await prisma.order.findMany({
    where: { storeId: store.id },
  });

  // Calculate earnings dynamically
  const totalLifetimeEarnings = storeOrders.reduce(
    (acc, ord) => acc + (ord.netProfit || 0),
    0
  );

  const pendingEscrowBalance = storeOrders
    .filter((ord) => ord.status === "PENDING" || ord.status === "PROCESSING")
    .reduce((acc, ord) => acc + (ord.netProfit || 0), 0);

  // 2. Fetch Payout History
  const payoutHistory = await prisma.payout.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  const totalWithdrawn = payoutHistory
    .filter((p) => p.status === "APPROVED" || p.status === "SUCCESS")
    .reduce((acc, p) => acc + p.amount, 0);

  const availableBalance = Math.max(0, totalLifetimeEarnings - totalWithdrawn - pendingEscrowBalance);

  // SERVER ACTION: Handle MTN MoMo Withdrawal Request
  async function requestMoMoPayout(formData: FormData) {
    "use server";

    const amount = parseFloat(formData.get("amount") as string);
    const phone = formData.get("phone") as string;
    const accountName = formData.get("accountName") as string;

    if (!amount || amount < 5000 || amount > availableBalance) {
      return;
    }

    if (!phone || !accountName) {
      return;
    }

    // Create Payout Record in DB
    await prisma.payout.create({
      data: {
        storeId: store.id,
        amount: amount,
        accountName: accountName,
        momoNumber: phone,
        status: "PENDING",
        referenceCode: `MOMO-RW-${Math.floor(100000 + Math.random() * 900000)}`,
      },
    });

    revalidatePath("/merchant/payouts");
    revalidatePath("/merchant");
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              ENTERPRISE WALLET • {store.storeName}
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              MTN MoMo Payouts & Earnings Wallet
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Saba ibihembo byawe, reba transfer history, no kureba inyungu z'amaduka yawe.
            </p>
          </div>

          <a
            href="/merchant"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-emerald-500 transition"
          >
            &larr; Back to Merchant Dashboard
          </a>
        </div>

        {/* FINANCIAL SUMMARY CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Available for Withdrawal
            </span>
            <h3 className="mt-2 text-2xl font-black text-emerald-600">
              {availableBalance.toLocaleString()} RWF
            </h3>
            <span className="mt-1 block text-[11px] font-bold text-slate-400">
              Ready for MTN MoMo Transfer
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Escrow Pending Balance
            </span>
            <h3 className="mt-2 text-2xl font-black text-amber-500">
              {pendingEscrowBalance.toLocaleString()} RWF
            </h3>
            <span className="mt-1 block text-[11px] font-bold text-slate-400">
              In Delivery / Processing
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Total Withdrawn to MoMo
            </span>
            <h3 className="mt-2 text-2xl font-black text-slate-900">
              {totalWithdrawn.toLocaleString()} RWF
            </h3>
            <span className="mt-1 block text-[11px] font-bold text-emerald-600">
              Paid Out Successfully
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Lifetime Net Profit
            </span>
            <h3 className="mt-2 text-2xl font-black text-slate-900">
              {totalLifetimeEarnings.toLocaleString()} RWF
            </h3>
            <span className="mt-1 block text-[11px] font-bold text-slate-400">
              All Time Revenue Generated
            </span>
          </div>
        </div>

        {/* WITHDRAWAL FORM & TRANSACTION LOGS */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT: REQUEST FORM (5 COLS) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl h-fit">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📱</span> Request MTN MoMo Withdrawal
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Amafaranga asabwa ahita ajya kuri MTN Mobile Money account yawe mu buryo bwa instant payout.
            </p>

            <form action={requestMoMoPayout} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Withdrawal Amount (RWF)
                </label>
                <input
                  type="number"
                  name="amount"
                  min="5000"
                  max={availableBalance}
                  required
                  placeholder="e.g. 50000"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                  Minimum withdrawal: 5,000 RWF
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  MTN MoMo Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={store.phone || user.phone}
                  required
                  placeholder="078X XXX XXX"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  MoMo Registered Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  defaultValue={user.name || "IRANZI BONFILS"}
                  required
                  placeholder="e.g. IRANZI BONFILS"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={availableBalance < 5000}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-xs font-black text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {availableBalance >= 5000
                  ? "Submit Instant Withdrawal Request"
                  : "Insufficient Available Balance"}
              </button>
            </form>
          </div>

          {/* RIGHT: PAYOUT LOGS TABLE (7 COLS) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              Payout & Transfer History
            </h2>

            {payoutHistory.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-xs text-slate-500">
                Nta paji n'imwe y'ikwirakwiza ry'amafaranga (payout) urasaba.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-100 font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Reference & Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Target MoMo</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payoutHistory.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-900 block">
                            {p.referenceCode}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-3 font-black text-emerald-600">
                          +{p.amount.toLocaleString()} RWF
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-800 block">
                            {p.momoNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">{p.accountName}</span>
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              p.status === "APPROVED" || p.status === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}