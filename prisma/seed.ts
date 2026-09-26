import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Create or Update Master Admin Account
  const admin = await prisma.user.upsert({
    where: { email: "admin@bonfils.rw" },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "BONFILS Master Admin",
      email: "admin@bonfils.rw",
      phone: "0788000000",
      password: "admin123",
      role: "ADMIN",
    },
  });

  console.log("✅ Master Admin Account Ready:", admin.email);

  // 2. Create or Update Merchant Account
  const merchantUser = await prisma.user.upsert({
    where: { email: "merchant@bonfils.rw" },
    update: {
      role: "MERCHANT",
    },
    create: {
      name: "Bonfils Downtown Store",
      email: "merchant@bonfils.rw",
      phone: "0795708460",
      password: "merchant123",
      role: "MERCHANT",
    },
  });

  // 3. Create or Update Merchant Store safely
  const existingStore = await prisma.store.findUnique({
    where: { merchantId: merchantUser.id },
  });

  if (!existingStore) {
    await prisma.store.create({
      data: {
        storeName: "BONFILS CAMERA - Tropical Branch",
        slug: "bonfils-tropical",
        location: "Kigali Downtown Tropical Plaza",
        phone: "0795708460",
        description: "Official reseller branch at Tropical Plaza",import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Create or Update Master Admin Account
  const admin = await prisma.user.upsert({
    where: { email: "admin@bonfils.rw" },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "BONFILS Master Admin",
      email: "admin@bonfils.rw",
      phone: "0788000000",
      password: "admin123",
      role: "ADMIN",
    },
  });

  console.log("✅ Master Admin Account Ready:", admin.email);

  // 2. Create or Update Merchant Account
  const merchantUser = await prisma.user.upsert({
    where: { email: "merchant@bonfils.rw" },
    update: {
      role: "MERCHANT",
    },
    create: {
      name: "Bonfils Downtown Store",
      email: "merchant@bonfils.rw",
      phone: "0788123456",
      password: "merchant123",
      role: "MERCHANT",
    },
  });

  // 3. Check if store exists by merchantId OR by slug
  const existingStore = await prisma.store.findFirst({
    where: {
      OR: [
        { merchantId: merchantUser.id },
        { slug: "bonfils-tropical" }
      ]
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
    console.log("✅ Merchant Store Created!");
  } else {
    // If it exists, link it to our merchant if needed
    await prisma.store.update({
      where: { id: existingStore.id },
      data: { merchantId: merchantUser.id },
    });
    console.log("ℹ️ Merchant Store already exists and is updated!");
  }

  console.log("🎉 Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Create or Update Master Admin Account
  const admin = await prisma.user.upsert({
    where: { email: "admin@bonfils.rw" },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "BONFILS Master Admin",
      email: "admin@bonfils.rw",
      phone: "0788000000",
      password: "admin123",
      role: "ADMIN",
    },
  });

  console.log("✅ Master Admin Account Ready:", admin.email);

  // 2. Create or Update Merchant Account
  const merchantUser = await prisma.user.upsert({
    where: { email: "merchant@bonfils.rw" },
    update: {
      role: "MERCHANT",
    },
    create: {
      name: "Bonfils Downtown Store",
      email: "merchant@bonfils.rw",
      phone: "0788123456",
      password: "merchant123",
      role: "MERCHANT",
    },
  });

  // 3. Check if store exists by merchantId OR by slug
  const existingStore = await prisma.store.findFirst({
    where: {
      OR: [
        { merchantId: merchantUser.id },
        { slug: "bonfils-tropical" }
      ]
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
    console.log("✅ Merchant Store Created!");
  } else {
    // If it exists, link it to our merchant if needed
    await prisma.store.update({
      where: { id: existingStore.id },
      data: { merchantId: merchantUser.id },
    });
    console.log("ℹ️ Merchant Store already exists and is updated!");
  }

  console.log("🎉 Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
        merchantId: merchantUser.id,
      },
    });
    console.log("✅ Merchant Store Created!");
  } else {
    console.log("ℹ️ Merchant Store already exists.");
  }

  console.log("🎉 Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });