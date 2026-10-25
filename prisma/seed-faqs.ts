import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FAQS: [string, string][] = [
  ["What types of vehicles does Indiventra offer across India?", "Indiventra offers a diverse Pan-India fleet including premium cars, SUVs, Force Urbania, Tempo Travellers, Mini Buses, Luxury Buses, Volvo, and Sleeper Buses to suit all travel needs across the country."],
  ["Can I book a Tempo Traveller or Maharaja Tempo Traveller for group travel?", "Yes, we provide 9 to 26-seater Tempo Travellers and Maharaja Tempos Traveller. They feature premium pushback seating, AC vents, and ample luggage space, making them perfect for comfortable, memorable group travel across India."],
  ["What seating capacities are available for Mini Buses and Luxury Buses?", "Our luxury buses offer spacious seating capacities from 40 to 56 passengers. Available in 2x1 and 2x2 reclining configurations, they are ideal for large corporate groups, weddings, and events across India."],
  ["Do you offer Sleeper Buses for overnight journeys?", "Yes, Indiventra provides comfortable Sleeper Buses designed specifically for long-distance, overnight journeys across India. They offer spacious berths and a smooth ride, ensuring travelers arrive at their destination well-rested and refreshed."],
  ["Which destinations are covered for pilgrimage travel?", "Indiventra covers all major pilgrimage routes and spiritual destinations across India. Our verified, experienced drivers ensure a safe, peaceful, and reliable travel experience for all your sacred family excursions and religious tours."],
  ["Do you provide drivers with all vehicle rentals?", "Absolutely. Every Indiventra rental includes a verified, background-checked, and highly trained driver. They are experts in defensive driving, always punctual, and dedicated to ensuring a safe, smooth journey across any Indian route."],
  ["Are AC and luxury amenities available in all vehicles?", "Yes, our entire fleet features excellent air-conditioning. Premium vehicles like Force Urbania and Luxury Buses include individual AC vents, USB charging points, reclining seats, and advanced music systems for ultimate travel comfort."],
  ["Can I rent a vehicle for weddings, corporate events, or airport transfers?", "Yes, Indiventra specializes in rentals for weddings, corporate events, airport transfers, and family trips. Our transparent booking process ensures you get the perfect vehicle and punctual driver for any occasion anywhere in India."],
  ["How can I book a vehicle with Indiventra?", "Booking is a simple 3-step process: submit your enquiry via call, WhatsApp, or our website, select the ideal vehicle we suggest, and pay a small advance to instantly confirm your Pan-India ride."],
  ["What are the per km rates for vehicle rentals?", "We offer highly competitive, transparent per-kilometer rates starting from ₹18/km for Tempo Travellers up to ₹50/km for Luxury Buses. Indiventra guarantees zero hidden charges, so your final bill perfectly matches your initial quote."],
  ["Are Sleeper Buses suitable for overnight or pilgrimage travel?", "Yes, our Sleeper Buses are perfect for long overnight and pilgrimage trips across India. They provide spacious, comfortable berths, ensuring passengers rest properly while our expert drivers navigate the long-distance routes safely."],
  ["Do you offer buses with washrooms?", "Yes, select large luxury buses and sleeper coaches in our fleet are equipped with onboard washrooms. Please specify this requirement during your initial enquiry, and we will arrange the ideal vehicle for you."],
  ["Are there any hidden charges in your rental service?", "Indiventra strictly maintains a transparent pricing policy with absolutely zero hidden charges. The final bill matches your exact quote. You only pay standard tolls, parking, and state permits directly during the journey."],
  ["Why should I choose Indiventra for vehicle rentals across India?", "Indiventra guarantees transparent pricing, well-maintained vehicles, and zero last-minute cancellations. Our verified drivers and reliable Pan-India service ensure a safe, comfortable, and premium travel experience that makes us the best choice for you."],
];

async function main() {
  if ((await prisma.faqItem.count()) > 0) {
    console.log("FAQs already exist, skipping.");
    return;
  }
  await prisma.faqItem.createMany({
    data: FAQS.map(([question, answer], i) => ({ question, answer, sortOrder: i })),
  });
  console.log(`Imported ${FAQS.length} FAQs.`);
}

main().finally(() => prisma.$disconnect());