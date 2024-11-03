/*
  Warnings:

  - A unique constraint covering the columns `[telephone]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `specialites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "patients_telephone_key" ON "patients"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "specialites_nom_key" ON "specialites"("nom");
