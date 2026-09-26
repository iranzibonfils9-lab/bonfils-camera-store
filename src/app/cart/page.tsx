"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: "prod-1",
      name: "Hikvision 4MP Outdoor PTZ Camera",
      price: 80000,
      quantity: 1,
      merchantStore: "BONFILS CAMERA - Tropical Branch",
    },
    {
      id: "prod-2",
      name: "Dahua 8-Channel DVR System",
      price: 135000,
      quantity: 1,
      merchantStore: "BONFILS CAMERA - Tropical Branch",
    },
  ]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = 2000; // RWF Kigali Delivery
  const grandTotal = subtotal + deliveryFee;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your selected surveillance hardware before checkout.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-lg font-bold text-slate-700">
                Your cart is currently empty.
              </p>
              <a
                href="/products"
                className="mt-4 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Browse Equipment Catalog
              </a>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* ITEM LIST */}
              <div className="space-y-4 lg:col-span-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div>
                      <span className="text-xs font-semibold text-emerald-600">
                        Merchant: {item.merchantStore}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-extrabold text-slate-900">
                        {item.price.toLocaleString()} RWF
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-sm"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-sm"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ORDER SUMMARY */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
                <h2 className="text-lg font-bold text-slate-900">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3 border-b border-slate-100 pb-4 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">
                      {subtotal.toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee (Kigali)</span>
                    <span className="font-bold text-slate-900">
                      {deliveryFee.toLocaleString()} RWF
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-emerald-600">
                    {grandTotal.toLocaleString()} RWF
                  </span>
                </div>

                <a
                  href="/checkout"
                  className="mt-6 block w-full rounded-xl bg-emerald-600 py-3.5 text-center font-bold text-white shadow-md transition hover:bg-emerald-700"
                >
                  Proceed to Checkout
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}