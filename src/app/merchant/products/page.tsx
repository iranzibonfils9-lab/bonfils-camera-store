"use client";

import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";

export default function MerchantProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [retailPrices, setRetailPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToStore = async (productId: string, defaultRetail: number) => {
    setAddingId(productId);
    const priceToSet = retailPrices[productId] || defaultRetail;

    try {
      const res = await fetch("/api/merchant/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          retailPrice: priceToSet,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Igicuruzwa gishyizwe muri Store yawe neza!");
        fetchProducts();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err: any) {
      alert("Failed to update store");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS B2B MARKETPLACE
          </p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Supplier Central Inventory
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Toranya ibikoresho ushaka gucuruza muri Store yawe, ushyireho igiciro cyawe (Retail Price) wibonere inyungu.
              </p>
            </div>
            <a
              href="/merchant"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <p className="text-center py-10 font-bold text-slate-500">Loading Central Inventory...</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {item.category}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">{item.name}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      In Stock: {item.stockQuantity}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 border-y border-slate-100 py-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">BONFILS Wholesale Price:</span>
                      <span className="font-bold text-slate-900">{item.wholesalePrice.toLocaleString()} RWF</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Set Your Retail Selling Price:</span>
                      <input
                        type="number"
                        defaultValue={item.suggestedRetail}
                        onChange={(e) =>
                          setRetailPrices({
                            ...retailPrices,
                            [item.id]: parseFloat(e.target.value),
                          })
                        }
                        className="w-36 rounded-xl border border-slate-300 px-3 py-1.5 font-bold text-emerald-600 text-right focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToStore(item.id, item.suggestedRetail)}
                    disabled={addingId === item.id}
                    className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {addingId === item.id ? "Adding to Store..." : "+ Add to My Reseller Store"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}