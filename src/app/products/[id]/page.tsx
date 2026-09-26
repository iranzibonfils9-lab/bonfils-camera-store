import Header from "@/components/layout/Header";

// Mock Product Specifications
const productDetails = {
  id: "prod-1",
  name: "Hikvision 4MP Outdoor PTZ Camera",
  category: "CCTV Cameras",
  brand: "Hikvision",
  basePrice: 80000,
  stock: 42,
  description:
    "High-definition 4MP outdoor PTZ security camera with 30m IR night vision, IP66 weatherproof rating, pan-tilt-zoom control via smartphone app, and smart motion alerts.",
  specs: [
    { label: "Resolution", value: "4MP (2560 × 1440)" },
    { label: "Night Vision", value: "Up to 30 Meters IR" },
    { label: "Weatherproof Rating", value: "IP66 Outdoor Rated" },
    { label: "Connectivity", value: "PoE / Ethernet Cable" },
    { label: "Warranty", value: "1 Year BONFILS Warranty" },
  ],
  availableMerchants: [
    {
      storeName: "BONFILS CAMERA - Tropical Branch",
      location: "Kigali Downtown Tropical Plaza",
      price: 80000,
      rating: 4.9,
    },
    {
      storeName: "Kigali Security Hub",
      location: "Nyarugenge Commercial Zone",
      price: 82000,
      rating: 4.7,
    },
  ],
};

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* BREADCRUMB */}
      <div className="border-b border-slate-200 bg-white px-6 py-4 text-xs font-semibold text-slate-500">
        <div className="mx-auto max-w-7xl flex gap-2">
          <a href="/products" className="hover:text-emerald-600">
            Products
          </a>
          <span>/</span>
          <span className="text-slate-900">{productDetails.name}</span>
        </div>
      </div>

      {/* MAIN PRODUCT SHOWCASE */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* PRODUCT IMAGE PLACEHOLDER */}
            <div className="flex h-96 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm text-slate-400">
              <div className="text-center">
                <span className="text-4xl">📹</span>
                <p className="mt-2 text-sm font-semibold">[ 4MP PTZ Camera Image Placeholder ]</p>
              </div>
            </div>

            {/* PRODUCT SUMMARY */}
            <div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {productDetails.brand}
              </span>

              <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
                {productDetails.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <p className="text-3xl font-extrabold text-slate-900">
                  {productDetails.basePrice.toLocaleString()} RWF
                </p>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  In Stock ({productDetails.stock} units)
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {productDetails.description}
              </p>

              {/* SPECIFICATIONS TABLE */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-bold text-slate-900">
                  Technical Specifications
                </h3>

                <div className="mt-3 divide-y divide-slate-100 text-xs">
                  {productDetails.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between py-2 text-slate-600"
                    >
                      <span className="font-semibold text-slate-500">
                        {spec.label}
                      </span>
                      <span className="font-bold text-slate-900">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-8 flex gap-4">
                <a
                  href="/cart"
                  className="w-full rounded-xl bg-emerald-600 py-3.5 text-center font-bold text-white shadow-md transition hover:bg-emerald-700"
                >
                  Add to Cart
                </a>
              </div>
            </div>
          </div>

          {/* AVAILABLE RESELLERS / MERCHANTS SECTION */}
          <div className="mt-16 border-t border-slate-200 pt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Fulfilling Resellers & Merchants
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select an authorized BONFILS merchant to order from directly.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {productDetails.availableMerchants.map((merchant) => (
                <div
                  key={merchant.storeName}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {merchant.storeName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      📍 {merchant.location}
                    </p>
                    <p className="mt-2 text-sm font-extrabold text-emerald-600">
                      {merchant.price.toLocaleString()} RWF
                    </p>
                  </div>

                  <button className="rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white">
                    Select Merchant
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}