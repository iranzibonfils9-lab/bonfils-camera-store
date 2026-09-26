import Header from "@/components/layout/Header";

const merchantStoreInfo = {
  name: "BONFILS CAMERA - Tropical Branch",
  merchantName: "Iranzi Bonfils",
  location: "Kigali Downtown Tropical Plaza, Floor 1",
  phone: "078 800 0000",
  email: "store@bonfilscamera.rw",
  description: "Official reseller of high-quality security cameras, CCTV systems, DVRs, and smart surveillance accessories in Kigali.",
};

const storeProducts = [
  {
    id: "prod-1",
    name: "Hikvision 4MP Outdoor PTZ Camera",
    category: "CCTV Cameras",
    retailPrice: 80000,
    inStock: true,
  },
  {
    id: "prod-2",
    name: "Dahua 8-Channel DVR System",
    category: "Recorders",
    retailPrice: 135000,
    inStock: true,
  },
];

export default function MerchantPublicStorePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* BANNER / STORE HEADER */}
      <section className="border-b border-slate-200 bg-[#0B192C] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                Verified Reseller Store
              </span>
              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                {merchantStoreInfo.name}
              </h1>
              <p className="mt-2 text-slate-300 max-w-2xl text-sm md:text-base">
                {merchantStoreInfo.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                <span>📍 {merchantStoreInfo.location}</span>
                <span>📞 {merchantStoreInfo.phone}</span>
                <span>✉️ {merchantStoreInfo.email}</span>
              </div>
            </div>

            <a
              href="/merchant"
              className="self-start rounded-xl bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* CATALOG PREVIEW */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Store Catalog
              </h2>
              <p className="text-sm text-slate-500">
                Showing {storeProducts.length} items currently offered by this storefront.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {storeProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-48 items-center justify-center bg-slate-100 p-6 text-slate-400">
                  <span className="text-sm font-semibold">[ Product Image Placeholder ]</span>
                </div>

                <div className="p-6">
                  <span className="text-xs font-semibold text-emerald-600">
                    {product.category}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {product.name}
                  </h3>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="text-xl font-bold text-slate-900">
                        {product.retailPrice.toLocaleString()} RWF
                      </p>
                    </div>

                    <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}