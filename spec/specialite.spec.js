import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

describe('Prisma Client CRUD Operations for Specialites Model', () => {
  const specialiteData = {
    nom: 'Cardiology',
  };

  let specialiteId;

  beforeAll(async () => {
    const createdSpecialite = await prisma.specialites.create({ data: specialiteData });
    specialiteId = createdSpecialite.id;
    console.log('Created specialite ID:', specialiteId);

    // Vérifiez si la spécialité a été créée correctement
    const checkSpecialite = await prisma.specialites.findUnique({ where: { id: specialiteId } });
    expect(checkSpecialite).not.toBeNull(); // Assurez-vous qu'il n'est pas null
    expect(checkSpecialite.nom).toEqual(specialiteData.nom); // Vérifiez le nom
  });

  afterAll(async () => {
    await prisma.specialites.deleteMany({ where: { nom: specialiteData.nom } });
    await prisma.$disconnect();
  });

  it('should create a specialite', async () => {
    const result = await prisma.specialites.findUnique({ where: { id: specialiteId } });
    expect(result).not.toBeNull(); // Vérifiez que le résultat n'est pas null
    expect(result.nom).toEqual(specialiteData.nom);
  });

  it('should get all specialites', async () => {
    const result = await prisma.specialites.findMany();
    expect(result).toBeInstanceOf(Array);
  });

  it('should update a specialite', async () => {
    const updatedData = { nom: 'Pediatrics Updated' };

    const specialiteToUpdate = await prisma.specialites.findUnique({ where: { id: specialiteId } });
    expect(specialiteToUpdate).not.toBeNull(); // Assurez-vous qu'il existe

    const result = await prisma.specialites.update({
      where: { id: specialiteId },
      data: updatedData,
    });
    expect(result.nom).toEqual(updatedData.nom);
  });

  it('should delete a specialite', async () => {
    const specialiteBeforeDelete = await prisma.specialites.findUnique({ where: { id: specialiteId } });
    expect(specialiteBeforeDelete).not.toBeNull();

    await prisma.specialites.delete({ where: { id: specialiteId } });
    const deletedSpecialite = await prisma.specialites.findUnique({ where: { id: specialiteId } });
    expect(deletedSpecialite).toBeNull();
  });
});
