import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, retailPrice, storeId } = body;

    if (!productId || !retailPrice) {
      return NextResponse.json(
        { error: "Product ID and Retail Price are required" },
        { status: 400 }
      );
    }

    // Fetch primary reseller store if storeId is not provided
    const store = storeId
      ? await prisma.store.findUnique({ where: { id: storeId } })
      : await prisma.store.findFirst();

    if (!store) {
      return NextResponse.json(
        { error: "No merchant store found" },
        { status: 404 }
      );
    }

    const merchantProduct = await prisma.merchantProduct.upsert({
      where: {
        storeId_productId: {
          storeId: store.id,
          productId,
        },
      },
      update: {
        retailPrice: parseFloat(retailPrice),
        isListed: true,
      },
      create: {
        storeId: store.id,
        productId,
        retailPrice: parseFloat(retailPrice),
        isListed: true,
      },
    });

    return NextResponse.json({
      success: true,
      merchantProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to add product to store" },
      { status: 500 }
    );
  }
}