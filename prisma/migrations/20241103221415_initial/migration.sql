-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEDECIN');

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "date_naissance" TIMESTAMP(3) NOT NULL,
    "adresse" TEXT NOT NULL,
    "admin_id" INTEGER,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rendezVous" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "medecin_id" INTEGER NOT NULL,
    "admin_id" INTEGER,

    CONSTRAINT "rendezVous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialites" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "admin_id" INTEGER,

    CONSTRAINT "specialites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" "Role" NOT NULL,
    "specialite_id" INTEGER,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_telephone_key" ON "patients"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "specialites_nom_key" ON "specialites"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendezVous" ADD CONSTRAINT "rendezVous_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendezVous" ADD CONSTRAINT "rendezVous_medecin_id_fkey" FOREIGN KEY ("medecin_id") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendezVous" ADD CONSTRAINT "rendezVous_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialites" ADD CONSTRAINT "specialites_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_specialite_id_fkey" FOREIGN KEY ("specialite_id") REFERENCES "specialites"("id") ON DELETE SET NULL ON UPDATE CASCADE;
