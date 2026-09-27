import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, deliveryAddress, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let totalAmount = 0;
    let netProfit = 0;
    let merchantEarning = 0;

    // Process order items and calculate automated profit margin
    const orderItemsData = await Promise.all(
      items.map(async (item: { productId: string; quantity: number; retailPrice: number }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) throw new Error("Product not found");

        const wholesalePrice = product.wholesalePrice || 0;
        const retailPrice = item.retailPrice || product.suggestedRetail;
        const lineTotal = retailPrice * item.quantity;
        const itemProfit = (retailPrice - wholesalePrice) * item.quantity;

        totalAmount += lineTotal;
        netProfit += itemProfit;
        merchantEarning += itemProfit; // Merchant net gain after wholesale cost

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: retailPrice,
          retailPrice: retailPrice,
        };
      })
    );

    // Fetch primary store to assign order to
    const store = await prisma.store.findFirst();

    // Generate unique Tracking Code
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create order entry in database
    const order = await prisma.order.create({
      data: {
        trackingNumber,
        customerName,
        customerPhone,
        deliveryAddress,
        totalAmount,
        netProfit,
        merchantEarning,
        status: "PENDING",
        storeId: store?.id,
        items: {
          create: orderItemsData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      totalAmount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process checkout" },
      { status: 500 }
    );
  }
}