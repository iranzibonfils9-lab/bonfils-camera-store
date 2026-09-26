import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("bonfils_user_id")?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      store: true,
    },
  });

  return user;
}

export async function setAuthCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("bonfils_user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days session
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("bonfils_user_id");
}