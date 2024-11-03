import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Mock the PrismaClient instance
const prisma = new PrismaClient();

describe('Prisma Client CRUD Operations for Utilisateurs Model', () => {
  const userId = 1; // This should correspond to a valid ID in your test database
  const userData = {
    id: userId,
    nom: 'John Doe',
    email: 'john.doe@example.com',
    password: 'securepassword',
    role: 'MEDECIN', // Adjust roles based on your implementation
    specialiteId: 1, // Ensure this specialty exists in your test database
  };

  afterAll(async () => {
    // Disconnect the Prisma client after all tests are complete
    await prisma.$disconnect();
  });

  // Test for Create User
  it('should create a user', async () => {
    spyOn(prisma.utilisateurs, 'create').and.returnValue(Promise.resolve(userData));

    const result = await prisma.utilisateurs.create({ data: userData });
    expect(prisma.utilisateurs.create).toHaveBeenCalledWith({ data: userData });
    expect(result).toEqual(userData);
  });

  // Test for Read User by ID
  it('should retrieve a user by id', async () => {
    spyOn(prisma.utilisateurs, 'findUnique').and.returnValue(Promise.resolve(userData));

    const result = await prisma.utilisateurs.findUnique({ where: { id: userId } });
    expect(prisma.utilisateurs.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toEqual(userData);
  });

  // Test for Update User
  it('should update a user by id', async () => {
    const updatedData = { ...userData, email: 'new.email@example.com' };
    spyOn(prisma.utilisateurs, 'update').and.returnValue(Promise.resolve(updatedData));

    const result = await prisma.utilisateurs.update({
      where: { id: userId },
      data: { email: 'new.email@example.com' },
    });
    expect(prisma.utilisateurs.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { email: 'new.email@example.com' },
    });
    expect(result).toEqual(updatedData);
  });

  // Test for Delete User
  it('should delete a user by id', async () => {
    spyOn(prisma.utilisateurs, 'delete').and.returnValue(Promise.resolve({}));

    await prisma.utilisateurs.delete({ where: { id: userId } });
    expect(prisma.utilisateurs.delete).toHaveBeenCalledWith({ where: { id: userId } });
  });
});
