"use client";

import Header from "@/components/layout/Header";
import { useState } from "react";

export default function ChinaSourcingPage() {
  const [formData, setFormData] = useState({
    productName: "",
    category: "CCTV Cameras",
    quantity: 50,
    targetPrice: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/merchant/sourcing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Request yo gutumiza muri China yakiriwe neza! BONFILS Team iraguha quotation hano vuba!");
        setFormData({
          productName: "",
          category: "CCTV Cameras",
          quantity: 50,
          targetPrice: "",
          notes: "",
        });
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="border-b border-slate-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            BONFILS CHINA IMPORT SERVICE
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Custom Hardware & Camera Sourcing Request
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Saba gutumiza kamera zidasanzwe, solar lights, cyangwa ibikoresho muri China (Alibaba/Factory Direct) utipagurije.
          </p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700">Product / Camera Name & Model</label>
              <input
                type="text"
                required
                placeholder="e.g. 4G Wireless Dual Lens Solar Camera 20X Zoom"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                >
                  <option>CCTV Cameras</option>
                  <option>Solar Cameras</option>
                  <option>3D Wall Printing Machinery</option>
                  <option>Smart Glasses & IoT Hardware</option>
                  <option>DVR & NVR Storage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Quantity Needed (Units)</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Target Wholesale Price per Unit (RWF / USD)</label>
              <input
                type="text"
                placeholder="e.g. 45,000 RWF or $35"
                value={formData.targetPrice}
                onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Additional Specifications / Notes</label>
              <textarea
                rows={4}
                placeholder="Shyiramo ibiranga igicuruzwa (specifications, logo customization, packaging requirements)..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Submitting Request..." : "Submit China Sourcing Request"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}