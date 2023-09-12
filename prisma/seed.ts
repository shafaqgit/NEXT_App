import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create users
    const user1 = await prisma.user.create({
      data: {
        username: 'user1', // Unique username
        email: 'user1@example.com', // Unique email
        name: 'User One',
        image: 'https://www.w3schools.com/w3images/avatar6.png',
      },
    });
    

    const user2 = await prisma.user.create({
      data: {
        username: 'user2', // Unique username
        email: 'user2@example.com', // Unique email
        name: 'User Two',
        image: 'https://www.w3schools.com/w3images/avatar2.png',
      },
    });
   

    // Create posts
    const post1 = await prisma.post.create({
      data: {
        title: 'Post 1',
        content: 'Content of Post 1',
        authorId: Number(user1.id),
      },
    });
   

    const post2 = await prisma.post.create({
      data: {
        title: 'Post 2',
        content: 'Content of Post 2',
        authorId: Number(user2.id),
      },
    });
 
    // Add more users and posts as needed

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
