"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B192C] font-extrabold text-emerald-400">
            BC
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              BONFILS
            </span>
            <span className="text-[10px] font-bold tracking-widest text-emerald-600 block uppercase">
              Camera Store
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/products" className="transition hover:text-emerald-600">
            All Products
          </Link>
          <Link href="/merchant/store" className="transition hover:text-emerald-600">
            Find Stores
          </Link>
        </nav>

        {/* AUTH BUTTONS / PROFILE */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href={
                  session.user?.role === "ADMIN"
                    ? "/admin"
                    : session.user?.role === "MERCHANT"
                    ? "/merchant"
                    : "/products"
                }
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-200"
              >
                Dashboard ({session.user?.name?.split(" ")[0]})
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
              >
                Sign In
              </Link>
              <Link
                href="/merchant"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Become a Merchant
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}