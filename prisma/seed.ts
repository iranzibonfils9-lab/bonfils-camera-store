import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with default Admin and Merchant accounts...");

  // 1. Create Master Admin Account
  const admin = await prisma.user.upsert({
    where: { email: "admin@bonfils.rw" },
    update: {},
    create: {
      name: "BONFILS Master Admin",
      email: "admin@bonfils.rw",
      phone: "0788000000",
      password: "admin123", // Default admin password
      role: "ADMIN",
    },
  });

  // 2. Create Sample Merchant Account
  const merchantUser = await prisma.user.upsert({
    where: { email: "merchant@bonfils.rw" },
    update: {},
    create: {
      name: "Bonfils Downtown Store",
      email: "merchant@bonfils.rw",
      phone: "0788123456",
      password: "merchant123",
      role: "MERCHANT",
      store: {
        create: {
          storeName: "BONFILS CAMERA - Tropical Branch",
          slug: "bonfils-tropical",
          location: "Kigali Downtown Tropical Plaza",
          phone: "0788123456",
          description: "Official reseller branch at Tropical Plaza",
        },
      },
    },
  });

  console.log("Seeding finished successfully!");
  console.log(`Admin User ID: ${admin.id}`);
  console.log(`Merchant User ID: ${merchantUser.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });