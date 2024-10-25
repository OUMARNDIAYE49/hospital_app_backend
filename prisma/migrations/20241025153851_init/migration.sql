-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'MEDECIN');

-- CreateTable
CREATE TABLE "specialites" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,

    CONSTRAINT "specialites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "specialiteId" INTEGER,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rendezVous" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "rendezVous_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialites_nom_key" ON "specialites"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_telephone_key" ON "patients"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- AddForeignKey
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_specialiteId_fkey" FOREIGN KEY ("specialiteId") REFERENCES "specialites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendezVous" ADD CONSTRAINT "rendezVous_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendezVous" ADD CONSTRAINT "rendezVous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
