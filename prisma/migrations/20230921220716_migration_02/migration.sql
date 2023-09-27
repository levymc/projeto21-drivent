/*
  Warnings:

  - A unique constraint covering the columns `[ticketTypeId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TicketType" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "TicketStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketTypeId_key" ON "Ticket"("ticketTypeId");
