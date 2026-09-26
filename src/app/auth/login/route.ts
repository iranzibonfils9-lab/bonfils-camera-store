import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in Database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set auth cookie session
    await setAuthCookie(user.id);

    // Determine redirect destination based on Role
    let redirectUrl = "/products";
    if (user.role === "ADMIN") {
      redirectUrl = "/admin";
    } else if (user.role === "MERCHANT") {
      redirectUrl = "/merchant";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectUrl,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}