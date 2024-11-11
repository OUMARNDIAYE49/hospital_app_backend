/*
  Warnings:

  - You are about to drop the column `date` on the `rendezVous` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rendezVous" DROP COLUMN "date",
ADD COLUMN     "date_debut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
