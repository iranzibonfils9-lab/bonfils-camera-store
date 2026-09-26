import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, retailPrice } = body;

    // Get default seed store (or dynamic logged in store)
    const store = await prisma.store.findFirst({
      where: { slug: "bonfils-tropical" },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Merchant Store not found" },
        { status: 404 }
      );
    }

    // Upsert merchant product entry
    const merchantProduct = await prisma.merchantProduct.upsert({
      where: {
        storeId_productId: {
          storeId: store.id,
          productId: productId,
        },
      },
      update: {
        retailPrice: parseFloat(retailPrice),
        isListed: true,
      },
      create: {
        storeId: store.id,
        productId: productId,
        retailPrice: parseFloat(retailPrice),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product added to your store successfully!",
      merchantProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to add product" },
      { status: 500 }
    );
  }
}