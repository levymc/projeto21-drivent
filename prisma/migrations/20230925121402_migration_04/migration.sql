/*
  Warnings:

  - Changed the type of `status` on the `ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('RESERVED', 'PAID');

-- DropIndex
DROP INDEX "ticket_ticketTypeId_key";

-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "status",
ADD COLUMN     "status" "TicketStatus" NOT NULL;
