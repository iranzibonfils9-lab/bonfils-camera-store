import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, deliveryAddress, items, storeId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let totalAmount = 0;
    let platformFee = 0;
    let merchantEarning = 0;

    const trackingNumber = `TRK-KGL-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderItemsData = await Promise.all(
      items.map(async (item: { productId: string; quantity: number; retailPrice: number }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) throw new Error("Product not found");

        const lineTotal = item.retailPrice * item.quantity;
        totalAmount += lineTotal;

        // CALCULATE COMMISSIONS & FEES
        if (product.isCustomMerchantProduct) {
          // Custom product: Admin takes 2% platform fee, Merchant gets 98%
          const fee = lineTotal * 0.02;
          platformFee += fee;
          merchantEarning += lineTotal - fee;
        } else {
          // Admin wholesale stock: Merchant gets 5% commission on retail sale
          const comm = lineTotal * 0.05;
          merchantEarning += comm;
          platformFee += lineTotal - comm;
        }

        return {
          productId: item.productId,
          quantity: item.quantity,
          retailPrice: item.retailPrice,
          wholesalePrice: product.wholesalePrice || 0,
        };
      })
    );

    const order = await prisma.order.create({
      data: {
        trackingNumber,
        customerName,
        customerPhone,
        deliveryAddress,
        totalAmount,
        platformFee,
        merchantEarning,
        storeId,
        status: "PROCESSING",
        paymentMethod: "MTN_MOMO",
        items: {
          create: orderItemsData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order & Invoice generated successfully!",
      trackingNumber: order.trackingNumber,
      orderId: order.id,
      invoice: {
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        platformFee: order.platformFee,
        merchantEarning: order.merchantEarning,
        status: order.status,
        date: order.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}