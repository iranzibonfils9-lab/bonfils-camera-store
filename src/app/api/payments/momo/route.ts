import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount, reference } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { error: "Phone number and amount are required" },
        { status: 400 }
      );
    }

    // MTN MoMo API Request simulation / Integration Handler
    return NextResponse.json({
      success: true,
      message: "MTN MoMo payment prompt sent to customer phone",
      transactionId: `MOMO-${Date.now()}`,
      reference: reference || `REF-${Math.floor(Math.random() * 1000000)}`,
      amount,
      phone,
      status: "PENDING",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process MoMo payment" },
      { status: 500 }
    );
  }
}