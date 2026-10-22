import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const U = "https://images.unsplash.com";

const CARDS = [
  ["Wedding Travel", "Luxury Bus on Rent for Wedding", "Indiventra offers spacious buses for wedding guests, seating 41 to 56 with reclining seats, panoramic windows, and onboard music — smooth, comfortable travel for the whole baraat.", `${U}/photo-1578645510447-e20b4311e3ce?auto=format&fit=crop&w=1200&q=80`],
  ["Wedding Travel", "Luxury Car on Rent for Wedding", "Arrive in style with our chauffeur-driven sedans and premium cars — elegant interiors, AC comfort, and professional drivers for a stress-free wedding day.", `${U}/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80`],
  ["Corporate Travel", "Corporate Cab Service", "Reliable sedans and SUVs for client meetings, airport transfers, and daily commutes — punctual, professional, and comfortable for business travel.", `${U}/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80`],
  ["Corporate Travel", "Employee Shuttle & Offsite Travel", "Tempo travellers and buses for team offsites, company outings, and group commutes — spacious seating and ample luggage room for the whole team.", `${U}/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80`],
  ["Vacations/Local", "Family Vacation Tempo Traveller", "Spacious, comfortable tempo travellers built for family trips and group tours — ample luggage space and courteous, experienced drivers.", `${U}/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80`],
  ["Vacations/Local", "City Sightseeing Cab", "Explore the city at your own pace with a comfortable sedan or SUV and a driver who knows all the best local spots.", `${U}/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80`],
  ["Pilgrimage Tour", "Pilgrimage Bus Rental", "Comfortable, well-maintained buses for large pilgrimage groups — reclining seats and ample space for a smooth, restful journey.", `${U}/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80`],
  ["Pilgrimage Tour", "Pilgrimage Tempo Traveller", "Ideal for smaller pilgrimage groups and longer routes — comfortable seating, AC, and drivers experienced with pilgrimage routes and timings.", `${U}/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80`],
] as const;

async function main() {
  if ((await prisma.serviceCard.count()) > 0) {
    console.log("Service cards already exist, skipping.");
    return;
  }
  await prisma.serviceCard.createMany({
    data: CARDS.map(([occasion, title, description, image], i) => ({
      occasion, title, description, image, sortOrder: i,
    })),
  });
  console.log(`Imported ${CARDS.length} service cards.`);
}

main().finally(() => prisma.$disconnect());