/* eslint-disable prettier/prettier */
import { PrismaClient, UserRole, UserStatus, Transport, AdStatus, FileType, UserAdStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const generateRandomRole = (): UserRole => {
    const roles = Object.values(UserRole);
    return faker.helpers.arrayElement(roles) as UserRole;
};

const generateRandomStatus = (): UserStatus => {
    const statuses = Object.values(UserStatus);
    return faker.helpers.arrayElement(statuses) as UserStatus;
};

const generateUserAdStatus = (): UserAdStatus => {
    const statuses = Object.values(UserAdStatus);
    return faker.helpers.arrayElement(statuses) as UserAdStatus;
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

const generateAds = async (userId: string, categoryIds: string[], count: number) => {
    const ads = [];
    for (let i = 0; i < count; i++) {
        const adId = faker.string.uuid();
        try {
            const createdAd = await prisma.ad.create({
                data: {
                    id: adId,
                    title: faker.lorem.words(5).slice(0, 50),
                    description: faker.lorem.paragraph(),
                    startTime: faker.date.future(),
                    endTime: faker.date.future(),
                    duration: faker.number.int({ min: 1, max: 8 }),
                    address: faker.location.streetAddress(),
                    postalCode: faker.location.zipCode(),
                    city: faker.location.city(),
                    country: faker.location.country().slice(0, 20),
                    attendees: faker.number.int({ min: 0, max: 100 }),
                    transport: faker.helpers.arrayElement(['car', 'van']) as Transport,
                    conform: faker.datatype.boolean(),
                    status: faker.helpers.arrayElement(['cancel', 'report']) as AdStatus,
                    adPicture: faker.image.url().slice(0, 50),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userId,
                    categoryId: faker.helpers.arrayElement(categoryIds),
                },
            });
            ads.push(createdAd);
        } catch (error) {
            console.error('Error creating ad:', error);
        }
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

const generateMessages = (userId: string, count: number) => {
    const messages = [];
    for (let i = 0; i < count; i++) {
        messages.push({
            id: faker.string.uuid(),
            text: faker.lorem.words(5).slice(0, 50),
            conform: faker.datatype.boolean(),
            createdAt: new Date(),
            updatedAt: new Date(),
            userId,
        });
    }
    return messages;
};

const generateSubjects = (count: number) => {
    const subjects = [];
    for (let i = 0; i < count; i++) {
        subjects.push({
            id: faker.string.uuid(),
            name: faker.lorem.words(2),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    return subjects;
};

const generateChildren = (count: number) => {
    const children = [];
    for (let i = 0; i < count; i++) {
        children.push({
            id: faker.string.uuid(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            school: faker.commerce.department(),
            class: faker.helpers.arrayElement(['A', 'B', 'C']),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    return children;
};

const generateUserHasSubjects = (userId: string, subjectIds: string[]) => {
    const userHasSubjects = [];
    for (const subjectId of subjectIds) {
        userHasSubjects.push({
            userId,
            subjectId,
        });
    }
    return userHasSubjects;
};

const generateUserHasChildren = (userId, childIds) => {
    const result = [];
    childIds.forEach(childId => {
        const pair = { userId: userId, childId: childId };
        result.push(pair);
    });
    return result;
};

const generateUserHasAds = (userId: string, adIds: string[]) => {
    const userHasAds = [];
    for (const adId of adIds) {
        userHasAds.push({
            userId,
            adId,
            userAttendees: faker.number.int({ min: 0, max: 6 }),
            status: generateUserAdStatus(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    return userHasAds;
};

const generateAdHasFiles = (adId: string, fileIds: string[]) => {
    const adHasFiles = [];
    for (const fileId of fileIds) {
        adHasFiles.push({
            adId,
            fileId,
        });
    }
    return adHasFiles;
};

const seed = async () => {
    const categories = generateCategories(5);
    const createdCategories = await Promise.all(categories.map(category => prisma.category.create({ data: category })));
    const categoryIds = createdCategories.map(category => category.id);

    const subjects = generateSubjects(5);
    const createdSubjects = await Promise.all(subjects.map(subject => prisma.subject.create({ data: subject })));

    const children = generateChildren(5);
    const createdChildren = await Promise.all(children.map(child => prisma.child.create({ data: child })));

    const users = generateUsers(10);
    for (const user of users) {
        const createdUser = await prisma.user.create({ data: user });

        const profile = generateProfiles(createdUser.id);
        await prisma.profile.create({ data: profile });

        const ads = await generateAds(createdUser.id, categoryIds, 3);
        const adIds = ads.map(ad => ad.id);

        for (const ad of ads) {
            const files = generateFiles(createdUser.id, 2);
            const createdFiles = await Promise.all(files.map(file => prisma.file.create({ data: file })));

            const adHasFiles = generateAdHasFiles(ad.id, createdFiles.map(file => file.id));
            await Promise.all(adHasFiles.map(adHasFile => prisma.adHasFile.create({ data: adHasFile })));
        }

        const messages = generateMessages(createdUser.id, 3);
        for (const message of messages) {
            await prisma.message.create({ data: message });
        }

        const userChildren = createdChildren.map(child => ({
            userId: createdUser.id,
            childId: child.id,
        }));
        await prisma.userHasChildren.createMany({ data: userChildren });

        const userHasSubjects = generateUserHasSubjects(createdUser.id, createdSubjects.map(subject => subject.id));
        await prisma.userHasSubjects.createMany({ data: userHasSubjects });

        const userHasAds = generateUserHasAds(createdUser.id, adIds);
        await prisma.userHasAds.createMany({ data: userHasAds });

        const userHasChildren = generateUserHasChildren(createdUser.id, createdChildren.map(child => child.id));
        
        try {
            for (const relation of userHasChildren) {
            await prisma.userHasChildren.upsert({
                where: { userId_childId: { userId: relation.userId, childId: relation.childId } },
                update: {},
                create: relation,
            });
            }
        } catch (error) {
            console.error('Erreur à la création:', error);
        }
    }
    console.log('Données générées!');
};

seed()
.catch((error) => console.error(error))
.finally(async () => {
    await prisma.$disconnect();
});