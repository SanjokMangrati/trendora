/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - Added the required column `totalItemsPurchased` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPurchaseAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalAmount",
ADD COLUMN     "totalItemsPurchased" INTEGER NOT NULL,
ADD COLUMN     "totalPurchaseAmount" DOUBLE PRECISION NOT NULL;
