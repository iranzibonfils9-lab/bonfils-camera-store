import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero */}
      <section className="bg-[#0B192C] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
              Professional Security Solutions
            </div>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Protect What
              <span className="block text-emerald-400">
                Matters Most.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              High-quality CCTV cameras, security systems and
              professional installation for homes, businesses and
              organizations in Rwanda.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-lg bg-emerald-500 px-7 py-3.5 font-semibold hover:bg-emerald-600">
                Shop Cameras
              </button>

              <button className="rounded-lg border border-slate-500 px-7 py-3.5 font-semibold hover:bg-white hover:text-[#0B192C]">
                Contact Us
              </button>
            </div>
          </div>

          {/* Camera visual */}
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-slate-700 bg-[#1E3E62]">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full border-8 border-slate-300 bg-slate-900 shadow-2xl">
                <div className="h-14 w-14 rounded-full bg-emerald-500 shadow-lg" />
              </div>

              <p className="text-xl font-semibold">
                Smart CCTV Security
              </p>

              <p className="mt-2 text-slate-300">
                Protection you can trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-semibold text-emerald-600">
            OUR PRODUCTS
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0F172A] md:text-4xl">
            Security Solutions for Every Need
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Choose from our range of professional CCTV and
            security products.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Dome Cameras",
              description: "Reliable indoor and outdoor surveillance.",
            },
            {
              title: "Bullet Cameras",
              description: "Powerful cameras for perimeter security.",
            },
            {
              title: "PTZ Cameras",
              description: "Pan, tilt and zoom for wider coverage.",
            },
            {
              title: "NVR Recorders",
              description: "Secure recording and video management.",
            },
            {
              title: "Wireless Kits",
              description: "Flexible wireless security solutions.",
            },
            {
              title: "Accessories",
              description: "Cables, storage and CCTV accessories.",
            },
          ].map((category) => (
            <div
              key={category.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B192C] text-emerald-400">
                ✓
              </div>

              <h3 className="text-xl font-bold text-[#0F172A]">
                {category.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {category.description}
              </p>

              <button className="mt-5 font-semibold text-[#1E3E62] hover:text-emerald-600">
                Explore →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-[#0B192C] px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 text-center md:grid-cols-3">
          <div>
            <p className="text-4xl font-bold text-emerald-400">
              1 Year
            </p>
            <p className="mt-2 text-slate-300">
              Warranty
            </p>
          </div>

          <div>
            <p className="text-4xl font-bold text-emerald-400">
              24/7
            </p>
            <p className="mt-2 text-slate-300">
              Security
            </p>
          </div>

          <div>
            <p className="text-4xl font-bold text-emerald-400">
              Rwanda
            </p>
            <p className="mt-2 text-slate-300">
              Installation & Support
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row">
          <div>
            <h3 className="text-xl font-bold">BONFILS</h3>
            <p className="mt-1 text-sm text-slate-400">
              CAMERA STORE
            </p>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 BONFILS CAMERA STORE. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}