"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-black text-emerald-400">
            BC
          </div>
          <div>
            <span className="block font-black tracking-tight text-slate-900">
              BONFILS
            </span>
            <span className="block text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
              CAMERA STORE
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden items-center gap-8 md:flex text-xs font-extrabold text-slate-700">
          <Link href="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-emerald-600 transition">
            All Products
          </Link>
          <Link href="/stores" className="hover:text-emerald-600 transition">
            Find Stores (Resellers)
          </Link>
          {role === "MERCHANT" && (
            <Link href="/merchant" className="text-emerald-600 font-black">
              Merchant Portal
            </Link>
          )}
          {role === "ADMIN" && (
            <Link href="/admin" className="text-blue-600 font-black">
              Admin Portal
            </Link>
          )}
        </nav>

        {/* AUTH ACTIONS */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
              >
                Become a Reseller
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}