import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role, storeName } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password, // In production, hash with bcrypt
        role: role || "BUYER",
        ...(role === "MERCHANT" && storeName
          ? {
              store: {
                create: {
                  storeName,
                  slug: storeName.toLowerCase().replace(/[^a-z0-0]/g, "-"),
                  phone,
                  location: "Kigali Downtown",
                },
              },
            }
          : {}),
      },
      include: { store: true },
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}