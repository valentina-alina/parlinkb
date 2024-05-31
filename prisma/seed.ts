/* eslint-disable prettier/prettier */
import { PrismaClient, UserRole, UserStatus, Transport, AdStatus, FileType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Generate random role and status based on enums
const generateRandomRole = (): UserRole => {
    const roles = Object.values(UserRole);
    return faker.helpers.arrayElement(roles) as UserRole;
};

const generateRandomStatus = (): UserStatus => {
    const statuses = Object.values(UserStatus);
    return faker.helpers.arrayElement(statuses) as UserStatus;
};

const generateUsers = (count: number) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            id: faker.string.uuid(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            role: generateRandomRole(),
            status: generateRandomStatus(),
            password: faker.internet.password(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    return users;
};

const generateProfiles = (userId: string) => ({
    id: faker.string.uuid(),
    phone: faker.phone.number(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    address: faker.location.streetAddress(),
    profilePicture: faker.image.avatar().slice(0, 50),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId,
});

const generateCategories = (count: number) => {
    const categories = [];
    for (let i = 0; i < count; i++) {
        categories.push({
            id: faker.string.uuid(),
            name: faker.commerce.department(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    return categories;
};

const generateAds = (userId: string, categoryIds: string[], count: number) => {
    const ads = [];
    for (let i = 0; i < count; i++) {
        ads.push({
            id: faker.string.uuid(),
            title: faker.lorem.words(5).slice(0, 50),  // Ensure title does not exceed 50 characters
            description: faker.lorem.paragraph(),
            startTime: faker.date.future(),
            endTime: faker.date.future(),
            duration: faker.number.int({ min: 1, max: 8 }),
            address: faker.location.streetAddress(),
            postalCode: faker.location.zipCode(),
            city: faker.location.city(),
            country: faker.location.country(),
            attendees: faker.number.int({ min: 0, max: 100 }),
            transport: faker.helpers.arrayElement(['car', 'van']) as Transport,
            conform: faker.datatype.boolean(),
            status: faker.helpers.arrayElement(['cancel', 'report']) as AdStatus,
            adPicture: faker.image.url().slice(0, 50),  // Ensure adPicture does not exceed 50 characters
            createdAt: new Date(),
            updatedAt: new Date(),
            userId,
            categoryId: faker.helpers.arrayElement(categoryIds),  // Randomly assign a categoryId from pre-created categories
        });
    }
    return ads;
};

const generateFiles = (userId: string, count: number) => {
    const files = [];
    for (let i = 0; i < count; i++) {
        files.push({
            id: faker.string.uuid(),
            filePath: faker.system.filePath(),
            fileType: faker.helpers.arrayElement(['jpg', 'png']) as FileType,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId,
        });
    }
    return files;
};

const seed = async () => {
    const categories = generateCategories(5);  // Generate 5 categories
    const createdCategories = await Promise.all(categories.map(category => prisma.category.create({ data: category })));
    const categoryIds = createdCategories.map(category => category.id);

    const users = generateUsers(10);
    for (const user of users) {
        const createdUser = await prisma.user.create({ data: user });

        // Create Profile for each user
        const profile = generateProfiles(createdUser.id);
        await prisma.profile.create({ data: profile });

        // Create Ads for each user
        const ads = generateAds(createdUser.id, categoryIds, 3);  // Assume 3 ads per user
        for (const ad of ads) {
            await prisma.ad.create({ data: ad });
        }

        // Create Files for each user
        const files = generateFiles(createdUser.id, 2);  // Assume 2 files per user
        for (const file of files) {
            await prisma.file.create({ data: file });
        }
    }
    console.log('Données générées!');
};

seed()
.catch((error) => console.error(error))
.finally(async () => {
    await prisma.$disconnect();
});