// src/seeders/seedDatabase.ts
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from '../modules/user/user.model';
import { ROLE_ENUM } from '../enums'; // Assuming you have an enums file for roles
import { connectDatabase } from '../lib/database';
import config from '../config/config.service';
import logger from '../lib/logger.service';
import { hashPassword } from '../utils/auth.utils';
import { isValidUsername } from '../utils/isUsername';

// Connect to the database
connectDatabase();

const createRandomUser = async () => {
  const password = await hashPassword('ZXC!asd123'); // Hash the password
  const roles = [ROLE_ENUM.HOME_BUYER, ROLE_ENUM.HOME_AGENT]; // Define possible roles
  let username;
  do {
    username = faker.internet.username(); // Generate a username
  } while (!isValidUsername(username));
  return {
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    username, // Corrected from username to userName
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(roles), // Randomly select a role from ROLE_ENUM
    isActive: true,
    isVerified: true,
    phoneNo: faker.phone.number(),
    password, // Use the hashed password
  };
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create random users
    const userPromises = Array.from({ length: config.SEED_RECORD_LIMIT }).map(
      createRandomUser,
    );
    const users = await Promise.all(userPromises); // Wait for all user promises to resolve

    // Insert users into the database
    await User.insertMany(users);
    logger.info('Seed data added successfully!');
    process.exit(1);
  } catch (error) {
    console.log('error>>', error);
    logger.error('Error seeding data:', error); // Use logger for error
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedUsers();
