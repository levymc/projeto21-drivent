import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

async function createEvent() {
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
}

async function createUsers() {
  const numUsers = 10;

  for (let i = 0; i < numUsers; i++) {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }
}

async function createEnrollments() {
  const numEnrollments = 10;

  for (let i = 0; i < numEnrollments; i++) {
    const name = faker.name.findName();
    const cpf = faker.random.number({ min: 10000000000, max: 99999999999 }).toString();
    const birthday = faker.date.past();
    const phone = faker.phone.phoneNumber();
    const userId = faker.random.number({ min: 1, max: 100 });

    await prisma.enrollment.create({
      data: {
        name,
        cpf,
        birthday,
        phone,
        userId,
      },
    });
  }
}

async function createTicketTypes() {
  const numTicketTypes = 5;

  const ticketTypes = ["Standard", "VIP", "Premium", "Student", "Family"];

  for (let i = 0; i < numTicketTypes; i++) {
    const name = ticketTypes[i];
    const price = faker.random.number({ min: 50, max: 200 });
    const isRemote = faker.random.boolean();
    const includesHotel = faker.random.boolean();

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

async function main() {
  await createEvent();
  await createUsers();
  await createEnrollments();
  await createTicketTypes();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
