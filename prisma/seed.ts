import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLOUDINARY = "https://res.cloudinary.com/yhuaios0/image/upload";

const CARD_IMAGES: Record<string, string> = {
  delhi: `${CLOUDINARY}/v1791056116/Delhi_Landmarks_Circular_Emblem.png`,
  haridwar: `${CLOUDINARY}/v1791056117/Haridwar_Riverside_Ghat_Panorama.png`,
  amritsar: `${CLOUDINARY}/v1791056118/Golden_Gateway_Cityscape_Emblem.png`,
  chandigarh: `${CLOUDINARY}/v1791056118/Chandigarh_Open_Hand_Park_Badge.png`,
  dehradun: `${CLOUDINARY}/v1791056119/Clock_Tower_Amid_Himalayan_Gardens.png`,
  varanasi: `${CLOUDINARY}/v1791056119/Sunrise_on_the_Sacred_Ghats.png`,
};

// TODO: add real hero / spot photos per city. Until then the card image is used
// as the hero image and as every spot image.
const CITIES = [
  { name: "Delhi", slug: "delhi", spots: ["India Gate", "Qutub Minar", "Red Fort"] },
  { name: "Haridwar", slug: "haridwar", spots: ["Har Ki Pauri", "Mansa Devi Temple", "Chandi Devi Temple"] },
  { name: "Amritsar", slug: "amritsar", spots: ["Golden Temple", "Jallianwala Bagh", "Wagah Border"] },
  { name: "Chandigarh", slug: "chandigarh", spots: ["Rock Garden", "Sukhna Lake", "Rose Garden"] },
  { name: "Dehradun", slug: "dehradun", spots: ["Robber's Cave", "Sahastradhara", "Mindrolling Monastery"] },
  { name: "Varanasi", slug: "varanasi", spots: ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Sarnath"] },
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
    const image = CARD_IMAGES[city.slug];
    const data = {
      name: city.name,
      heroImage: image,
      cardImage: image,
      description: `Reliable, comfortable travel across ${city.name} and nearby routes.`,
    };
    const spots = city.spots.map((spotName) => ({ name: spotName, imageUrl: image }));

    await prisma.city.upsert({
      where: { slug: city.slug },
      // Re-running the seed refreshes existing cities and replaces their spots.
      update: { ...data, spots: { deleteMany: {}, create: spots } },
      create: { ...data, slug: city.slug, spots: { create: spots } },
    });
    console.log(`Seeded city: ${city.name}`);
  }

  // Remove cities that are no longer served (e.g. Mumbai, Pune, Bangalore, Hyderabad).
  // Their spots are deleted automatically (onDelete: Cascade).
  // Delete this block if you want to keep any other cities in the database.
  const removed = await prisma.city.deleteMany({
    where: { slug: { notIn: CITIES.map((c) => c.slug) } },
  });
  console.log(`Removed ${removed.count} old cities`);

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