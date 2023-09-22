import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { faker } from '@faker-js/faker'
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  console.log({ event });

  const numInserts = 10; 
  const ticketTypes = ["Standard", "VIP", "Premium", "Student", "Family"];

  for (let i = 0; i < numInserts; i++) {
    const name = faker.helpers.arrayElement(ticketTypes);
    const price = faker.datatype.number({ min: 50, max: 200 });
    const isRemote = faker.datatype.boolean();
    const includesHotel = faker.datatype.boolean();

    await prisma.ticketType.create({
      data: {
        name,
        price,
        isRemote,
        includesHotel,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
