import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@bonfils.rw" },
    update: { role: "ADMIN" },
    create: {
      name: "BONFILS Master Admin",
      email: "admin@bonfils.rw",
      phone: "0788000000",
      password: "admin123",
      role: "ADMIN",
    },
  });

  const merchantUser = await prisma.user.upsert({
    where: { email: "merchant@bonfils.rw" },
    update: { role: "MERCHANT" },
    create: {
      name: "Bonfils Downtown Store",
      email: "merchant@bonfils.rw",
      phone: "0788123456",
      password: "merchant123",
      role: "MERCHANT",
    },
  });

  const existingStore = await prisma.store.findFirst({
    where: {
      OR: [
        { merchantId: merchantUser.id },
        { slug: "bonfils-tropical" },
      ],
    },
  });

  if (!existingStore) {
    await prisma.store.create({
      data: {
        storeName: "BONFILS CAMERA - Tropical Branch",
        slug: "bonfils-tropical",
        location: "Kigali Downtown Tropical Plaza",
        phone: "0788123456",
        description: "Official reseller branch at Tropical Plaza",
        merchantId: merchantUser.id,
      },
    });
  }

  console.log("Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });