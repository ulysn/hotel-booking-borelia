import 'dotenv/config';
import prisma from '../src/lib/prisma';

const hotels = [
  {
    name: 'Lotus Retreat Ubud',
    location: 'Ubud, Bali',
    description:
      'Nestled amid lush rice terraces and ancient forests, Lotus Retreat Ubud offers an authentic Balinese sanctuary. Experience the perfect blend of traditional Balinese architecture and modern luxury, with world-class spa treatments, organic farm-to-table dining, and breathtaking jungle views from every villa.',
    starRating: 5.0,
    rooms: [
      { type: 'Garden View Room',    pricePerNight: 180,  capacity: 2, isAvailable: true  },
      { type: 'Rice Field Suite',    pricePerNight: 320,  capacity: 2, isAvailable: true  },
      { type: 'Jungle Pool Villa',   pricePerNight: 550,  capacity: 4, isAvailable: true  },
      { type: 'Presidential Villa',  pricePerNight: 980,  capacity: 6, isAvailable: false },
    ],
  },
  {
    name: 'Seminyak Ocean Pearl',
    location: 'Seminyak, Bali',
    description:
      'A sophisticated beachfront retreat in the heart of Seminyak. Seminyak Ocean Pearl combines sleek contemporary design with Balinese artistry. Enjoy direct beach access, a stunning infinity pool, award-winning restaurants, and vibrant nightlife just steps from your door.',
    starRating: 4.5,
    rooms: [
      { type: 'Ocean Breeze Room',   pricePerNight: 145,  capacity: 2, isAvailable: true  },
      { type: 'Deluxe Ocean View',   pricePerNight: 240,  capacity: 2, isAvailable: true  },
      { type: 'Beachfront Suite',    pricePerNight: 420,  capacity: 4, isAvailable: true  },
      { type: 'Sky Penthouse',       pricePerNight: 750,  capacity: 4, isAvailable: false },
    ],
  },
  {
    name: 'Nusa Dua Grand Resort',
    location: 'Nusa Dua, Bali',
    description:
      "The ultimate luxury experience on Bali's most exclusive peninsula. Set within 10 hectares of manicured tropical gardens, Nusa Dua Grand Resort features five restaurants, three pools, a championship tennis court, and a private beach. Perfect for families and couples seeking perfection.",
    starRating: 5.0,
    rooms: [
      { type: 'Deluxe Garden Room',  pricePerNight: 220,  capacity: 2, isAvailable: true  },
      { type: 'Pool Access Room',    pricePerNight: 310,  capacity: 2, isAvailable: true  },
      { type: 'Ocean View Suite',    pricePerNight: 490,  capacity: 4, isAvailable: true  },
      { type: 'Grand Presidential',  pricePerNight: 1200, capacity: 6, isAvailable: true  },
    ],
  },
  {
    name: 'Kuta Sunrise Hotel',
    location: 'Kuta, Bali',
    description:
      "Ideally located just 300 meters from Kuta's famous beach, Kuta Sunrise Hotel offers exceptional value without compromising comfort. Perfect for surfers and beach lovers, with a rooftop pool, surf school access, and an energetic beachside atmosphere that captures Bali's spirit.",
    starRating: 3.5,
    rooms: [
      { type: 'Standard Room',       pricePerNight: 75,   capacity: 2, isAvailable: true  },
      { type: 'Deluxe Room',         pricePerNight: 110,  capacity: 2, isAvailable: true  },
      { type: 'Family Suite',        pricePerNight: 165,  capacity: 5, isAvailable: true  },
    ],
  },
  {
    name: 'Canggu Villa & Spa',
    location: 'Canggu, Bali',
    description:
      "A bohemian-chic retreat for the modern traveler. Canggu Villa & Spa sits in Bali's hippest neighborhood, surrounded by paddy fields, world-class surf spots, and acclaimed restaurants. Each villa features a private pool, outdoor bathtub, and personalized butler service.",
    starRating: 4.0,
    rooms: [
      { type: 'Garden Room',         pricePerNight: 130,  capacity: 2, isAvailable: true  },
      { type: 'Pool Access Room',    pricePerNight: 195,  capacity: 2, isAvailable: true  },
      { type: 'Private Pool Villa',  pricePerNight: 380,  capacity: 4, isAvailable: true  },
    ],
  },
  {
    name: 'Jimbaran Bay Villas',
    location: 'Jimbaran, Bali',
    description:
      'Perched on a hillside overlooking the famous Jimbaran Bay, this exclusive collection of villas offers unobstructed sunset views over the Indian Ocean. Each villa is an architectural masterpiece blending Javanese design with contemporary elegance, featuring infinity pools and private outdoor dining.',
    starRating: 4.5,
    rooms: [
      { type: 'Bay View Studio',     pricePerNight: 160,  capacity: 2, isAvailable: true  },
      { type: 'Sunset Pool Villa',   pricePerNight: 340,  capacity: 2, isAvailable: true  },
      { type: 'Cliffside Suite',     pricePerNight: 520,  capacity: 4, isAvailable: false },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();

  for (const { rooms, ...hotelData } of hotels) {
    const hotel = await prisma.hotel.create({
      data: { ...hotelData, rooms: { create: rooms } },
    });
    console.log(`  ✅ ${hotel.name} (${rooms.length} rooms)`);
  }

  const totalRooms = hotels.reduce((s, h) => s + h.rooms.length, 0);
  console.log(`\n🎉 Done — ${hotels.length} hotels, ${totalRooms} rooms inserted.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
