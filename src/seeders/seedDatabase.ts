// src/seeders/seedDatabase.ts
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from '../modules/user/user.model';
import { ROLE_ENUM } from '../enums'; // Assuming you have an enums file for roles
import { connectDatabase } from '../lib/database';
import config from '../config/config.service';
import logger from '../lib/logger.service';
import { hashPassword } from '../utils/auth.utils';

// Username validation regex
const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

// Function to validate the username
export const isValidUsername = (username: string) =>
  usernameRegex.test(username);

// Connect to the database
connectDatabase();

const createRandomUser = async () => {
  const password = await hashPassword('ZXC!asd123'); // Hash the password
  const roles = [ROLE_ENUM.HOME_BUYER, ROLE_ENUM.HOME_AGENT]; // Define possible roles

  let username;
  do {
    username = faker.internet.username(); // Generate a username
  } while (!isValidUsername(username)); // Keep generating until a valid username is found

  // Generate random address and location
  const address = faker.location.streetAddress({ useFullAddress: true }); // Generate a random street address
  const location = {
    type: 'Point',
    coordinates: [
      parseFloat(faker.location.longitude()), // Generate random longitude
      parseFloat(faker.location.latitude()), // Generate random latitude
    ],
  };

  return {
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    username, // Use the valid username
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(roles), // Randomly select a role from the defined roles
    isActive: true,
    isVerified: false,
    phoneNo: faker.phone.number(),
    password, // Use the hashed password
    location, // Add location
    address, // Add address
  };
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create random users

    const userPromises = faker.helpers.multiple(createRandomUser, {
      count: config.SEED_RECORD_LIMIT,
    });

    const users = await Promise.all(userPromises); // Wait for all user promises to resolve

    // Insert users into the database
    await User.insertMany(users);
    logger.info('User Data Seed data added successfully!');
    process.exit(1);
  } catch (error) {
    logger.error(`Error seeding data: ${error}`); // Use logger for error
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedUsers();
