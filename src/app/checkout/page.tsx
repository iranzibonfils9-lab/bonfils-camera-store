"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Order Checkout
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Complete your shipping details and mobile money payment.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl">
          {success ? (
            <div className="rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-600">
                ✓
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                Order Placed Successfully!
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Your order prompt has been sent to your MTN MoMo phone. Once confirmed, BONFILS warehouse will dispatch your order.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <a
                  href="/products"
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 text-sm"
                >
                  Continue Shopping
                </a>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                Delivery Details
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eric Manzi"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    MTN MoMo Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="078 XXX XXXX"
                    className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Delivery Address / Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kigali, Nyarugenge, Market Plaza Room 12"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Payment Method
                </h2>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 font-extrabold text-slate-900 text-xs">
                    MoMo
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      MTN Mobile Money Direct Pay
                    </p>
                    <p className="text-xs text-slate-500">
                      USSD PIN prompt will pop up on your phone.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Processing Order..." : "Confirm Order & Pay"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}