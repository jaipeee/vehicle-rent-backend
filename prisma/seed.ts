import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder data — replace with your real cities/vehicles once confirmed.
const CITIES = [
  { name: "Delhi", slug: "delhi", spots: ["India Gate", "Qutub Minar", "Red Fort"] },
  { name: "Mumbai", slug: "mumbai", spots: ["Gateway of India", "Marine Drive", "Juhu Beach"] },
  { name: "Pune", slug: "pune", spots: ["Shaniwar Wada", "Sinhagad Fort", "Aga Khan Palace"] },
  { name: "Bangalore", slug: "bangalore", spots: ["Lalbagh", "Bangalore Palace", "Cubbon Park"] },
  { name: "Hyderabad", slug: "hyderabad", spots: ["Charminar", "Golconda Fort", "Hussain Sagar"] },
];

const VEHICLES = [
  { name: "Sedan", category: "Sedan", seatCapacity: 4, priceFrom: 2500 },
  { name: "Maruti Suzuki Ertiga", category: "SUV", seatCapacity: 7, priceFrom: 3200 },
  { name: "SUV", category: "SUV", seatCapacity: 6, priceFrom: 4000 },
  { name: "Toyota Innova Hycross", category: "Luxury Car", seatCapacity: 7, priceFrom: 5000 },
  { name: "Toyota Innova Crysta", category: "Luxury Car", seatCapacity: 7, priceFrom: 4500 },
  { name: "Toyota Vellfire", category: "Luxury Van", seatCapacity: 6, priceFrom: 12000 },
  { name: "Force Urbania", category: "Urbania", seatCapacity: 17, priceFrom: 7000 },
  { name: "Tempo Traveller 12-Seater", category: "Tempo Traveller", seatCapacity: 12, priceFrom: null },
  { name: "Tempo Traveller 17-Seater", category: "Tempo Traveller", seatCapacity: 17, priceFrom: null },
  { name: "Mini Bus", category: "Mini Bus", seatCapacity: 26, priceFrom: null },
  { name: "Luxury Bus", category: "Luxury Bus", seatCapacity: 40, priceFrom: null },
];

async function main() {
  for (const city of CITIES) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: {
        name: city.name,
        slug: city.slug,
        heroImage: "/placeholder/city-hero.jpg",
        description: `Reliable, comfortable travel across ${city.name} and nearby routes.`,
        spots: {
          create: city.spots.map((spotName) => ({
            name: spotName,
            imageUrl: "/placeholder/spot.jpg",
          })),
        },
      },
    });
  }

  // Vehicles have no natural unique key to upsert on, so clear and
  // re-insert each time — safe since nothing else references Vehicle rows.
  await prisma.vehicle.deleteMany({});

  for (const vehicle of VEHICLES) {
    await prisma.vehicle.create({
      data: {
        name: vehicle.name,
        category: vehicle.category,
        seatCapacity: vehicle.seatCapacity,
        imageUrl: "/placeholder/vehicle.jpg",
        description: `Comfortable ${vehicle.category.toLowerCase()} ideal for group travel.`,
        priceFrom: vehicle.priceFrom,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());