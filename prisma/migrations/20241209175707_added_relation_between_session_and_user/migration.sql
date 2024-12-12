/*
  Warnings:

  - Added the required column `userId` to the `DiscountCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscountCode" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
