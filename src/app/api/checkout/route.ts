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

    // Calculate total retail and wholesale profits
    const orderItemsData = await Promise.all(
      items.map(async (item: { productId: string; quantity: number; retailPrice: number }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) throw new Error("Product not found");

        const wholesalePrice = product.wholesalePrice || 0;
        const itemProfit = (item.retailPrice - wholesalePrice) * item.quantity;
        
        totalAmount += item.retailPrice * item.quantity;
        netProfit += itemProfit;

        return {
          productId: item.productId,
          quantity: item.quantity,
          retailPrice: item.retailPrice,
          wholesalePrice: wholesalePrice,
        };
      })
    );

    // Create Order with automated profit splitting
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        deliveryAddress,
        totalAmount,
        netProfit,
        status: "PENDING",
        paymentMethod: "MTN_MOMO",
        items: {
          create: orderItemsData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully! MoMo Payment initiated.",
      orderId: order.id,
      totalAmount,
      netProfit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}