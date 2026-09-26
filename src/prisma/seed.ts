import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Create Master Admin Account
  const admin = await prisma.user.upsert({
    where: { email: "admin@bonfilscamera.rw" },
    update: {},
    create: {
      name: "Iranzi Bonfils (Admin)",
      email: "admin@bonfilscamera.rw",
      phone: "078 800 0000",
      password: "adminpassword123",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin User Created:", admin.email);

  // 2. Create Merchant User & Store
  const merchantUser = await prisma.user.upsert({
    where: { email: "merchant@bonfilscamera.rw" },
    update: {},
    create: {
      name: "Iranzi Bonfils",
      email: "merchant@bonfilscamera.rw",
      phone: "078 800 0001",
      password: "merchantpassword123",
      role: "MERCHANT",
      store: {
        create: {
          storeName: "BONFILS CAMERA - Tropical Branch",
          slug: "bonfils-tropical",
          location: "Kigali Downtown Tropical Plaza, Floor 1",
          phone: "078 800 0001",
          description:
            "Official reseller of high-quality security cameras, CCTV systems, DVRs, and smart surveillance accessories in Kigali.",
        },
      },
    },
    include: { store: true },
  });

  console.log("✅ Merchant & Store Created:", merchantUser.store?.storeName);

  // 3. Populate Central Supplier Inventory (Products)
  const product1 = await prisma.product.upsert({
    where: { sku: "SKU-HIK-4MP" },
    update: {},
    create: {
      sku: "SKU-HIK-4MP",
      name: "Hikvision 4MP Outdoor PTZ Camera",
      category: "CCTV Cameras",
      brand: "Hikvision",
      description:
        "High-definition 4MP outdoor PTZ security camera with 30m IR night vision.",
      wholesalePrice: 65000,
      suggestedRetail: 85000,
      stockQuantity: 42,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { sku: "SKU-DAH-DVR8" },
    update: {},
    create: {
      sku: "SKU-DAH-DVR8",
      name: "Dahua 8-Channel DVR System",
      category: "Recorders",
      brand: "Dahua",
      description: "8-Channel surveillance DVR system supporting 1080p recording.",
      wholesalePrice: 110000,
      suggestedRetail: 140000,
      stockQuantity: 15,
    },
  });

  console.log("✅ Central Products Seeded into Warehouse!");

  // 4. Link Products to Merchant Store with Custom Retail Prices
  if (merchantUser.store) {
    await prisma.merchantProduct.upsert({
      where: {
        storeId_productId: {
          storeId: merchantUser.store.id,
          productId: product1.id,
        },
      },
      update: {},
      create: {
        storeId: merchantUser.store.id,
        productId: product1.id,
        retailPrice: 80000,
      },
    });

    console.log("✅ Merchant Products linked with custom retail prices!");
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