export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import prisma from "@/lib/prisma";

export default async function MerchantPayoutsPage() {
  // Safe fetch for default reseller store
  const store = await prisma.store.findFirst({
    include: {
      orders: true,
      payouts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const storeOrders = store?.orders || [];
  const payoutHistory = store?.payouts || [];

  const totalLifetimeEarnings = storeOrders.reduce(
    (acc, ord) => acc + (ord.merchantEarning || ord.netProfit || 0),
    0
  );

  const pendingEscrowBalance = storeOrders
    .filter((ord) => ord.status === "PENDING" || ord.status === "PROCESSING")
    .reduce((acc, ord) => acc + (ord.merchantEarning || ord.netProfit || 0), 0);

  const totalWithdrawn = payoutHistory
    .filter((p) => p.status === "APPROVED" || p.status === "SUCCESS")
    .reduce((acc, p) => acc + p.amount, 0);

  const availableBalance = Math.max(0, totalLifetimeEarnings - totalWithdrawn - pendingEscrowBalance);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
          <div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              ENTERPRISE WALLET • {store?.storeName || "BONFILS STORE"}
            </span>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              MTN MoMo Payouts & Wallet Balance
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Saba ibihembo byawe mu buryo bwa Mobile Money, reba izasohowe no kugenzura inyungu.
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
              Available Balance
            </span>
            <h3 className="mt-2 text-2xl font-black text-emerald-600">
              {availableBalance.toLocaleString()} RWF
            </h3>
            <span className="mt-1 block text-[11px] font-bold text-slate-400">
              Ready for Instant MoMo Transfer
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
              Orders In Delivery
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Total Paid Out
            </span>
            <h3 className="mt-2 text-2xl font-black text-slate-900">
              {totalWithdrawn.toLocaleString()} RWF
            </h3>
            <span className="mt-1 block text-[11px] font-bold text-emerald-600">
              Successfully Transferred
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
              Total Revenue Generated
            </span>
          </div>
        </div>

        {/* WITHDRAWAL FORM & HISTORY */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* FORM (5 COLS) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl h-fit">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📱</span> Request MTN MoMo Withdrawal
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Amafaranga asabwa ahita yoherezwa kuri MTN Mobile Money account yawe.
            </p>

            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Withdrawal Amount (RWF)
                </label>
                <input
                  type="number"
                  min="5000"
                  max={availableBalance}
                  required
                  placeholder="e.g. 50000"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  MTN MoMo Phone Number
                </label>
                <input
                  type="text"
                  defaultValue={store?.phone || "0788123456"}
                  required
                  placeholder="078X XXX XXX"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  MoMo Registered Name
                </label>
                <input
                  type="text"
                  defaultValue="BONFILS RESELLER"
                  required
                  placeholder="e.g. IRANZI BONFILS"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-xs font-black text-white shadow-md transition hover:bg-emerald-700"
              >
                Submit Instant MoMo Withdrawal Request
              </button>
            </form>
          </div>

          {/* HISTORY TABLE (7 COLS) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              Payout & Transfer History
            </h2>

            {payoutHistory.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-8 text-center text-xs text-slate-500">
                Nta busabe bw'amafaranga (payouts) burakorwa.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-100 font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Target MoMo</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payoutHistory.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {p.referenceCode}
                        </td>
                        <td className="p-3 font-black text-emerald-600">
                          {p.amount.toLocaleString()} RWF
                        </td>
                        <td className="p-3 font-bold text-slate-800">
                          {p.momoNumber}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600">
                          {p.status}
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