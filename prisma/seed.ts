/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker/locale/fr';
import { PrismaClient, UserStatus, Transport, AdStatus, FileType, UserAdStatus, UserRole } from '@prisma/client';

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

const generateUniqueNames = (count: number, generator: () => string) => {
    const names = new Set<string>();
    while (names.size < count) {
        names.add(generator());
    }
    return Array.from(names);
};

const categoryNames = ['Covoiturage', 'Soutien', 'Garderie', 'Sortie'];

const subCategoriesMap = {
    'Covoiturage': ['Musées et centres d\'expositions', 'Zoos et aquariums', 'Parcs et jardins', 'Camps de vacances'],
    'Soutien': ['Mathématiques', 'Enseignement moral et civique', 'Histoire-géographie', 'Technologie'],
    'Garderie': ['La garde à domicile partagée', 'La crèche familiale', 'L\'assistance maternelle', 'La garde à domicile'],
    'Sortie': ['Piscine', 'Promenade', 'Ressources', 'Parc']
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

const generateCategories = async () => {
    const categoryMap = new Map<string, string>();

    for (const name of categoryNames) {
        const existingCategory = await prisma.category.findUnique({
            where: { name },
        });
        if (!existingCategory) {
            const createdCategory = await prisma.category.create({
                data: {
                    id: faker.string.uuid(),
                    name,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            categoryMap.set(name, createdCategory.id);
        } else {
            categoryMap.set(name, existingCategory.id);
        }
    }

    return categoryNames.map(name => categoryMap.get(name)!);
};

const generateSubCategories = async (categoryMap: Map<string, string>) => {
    const subCategories = [];
    for (const [categoryName, subCategoryNames] of Object.entries(subCategoriesMap)) {
        const categoryId = categoryMap.get(categoryName)!;
        for (const subCategoryName of subCategoryNames) {
            subCategories.push({
                id: faker.string.uuid(),
                name: subCategoryName,
                createdAt: new Date(),
                updatedAt: new Date(),
                categoryId,
            });
        }
    }
    return subCategories;
};

const generateAds = async (userId: string, categoryIds: string[], subCategoryIds: string[], count: number) => {
    const ads = [];
    for (let i = 0; i < count; i++) {
        const adId = faker.string.uuid();
        const startTime = faker.date.future();
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        try {
            const createdAd = await prisma.ad.create({
                data: {
                    id: adId,
                    title: faker.lorem.words(5).slice(0, 50),
                    description: faker.lorem.paragraph(),
                    startTime: startTime,
                    endTime: endTime,
                    duration: 1,
                    address: faker.location.streetAddress(),
                    postalCode: faker.location.zipCode(),
                    city: faker.location.city(),
                    country: 'France',
                    attendees: faker.number.int({ min: 0, max: 100 }),
                    transport: faker.helpers.arrayElement(['car', 'van']) as Transport,
                    conform: faker.datatype.boolean(),
                    status: faker.helpers.arrayElement(['cancel', 'report']) as AdStatus,
                    adPicture: faker.image.url().slice(0, 50),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userId,
                    categoryId: faker.helpers.arrayElement(categoryIds),
                    subCategoryId: faker.helpers.arrayElement(subCategoryIds),
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
    const uniqueNames = generateUniqueNames(count, () => faker.lorem.words(2));
    const subjects = uniqueNames.map(name => ({
        id: faker.string.uuid(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
    }));
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
    try {
        console.log('En cours de génération...');
        const categoryIds = await generateCategories();

        const categoryMap = new Map<string, string>();
        for (let i = 0; i < categoryNames.length; i++) {
            categoryMap.set(categoryNames[i], categoryIds[i]);
        }

        // Generate specific subcategories for each category
        const subCategories = await generateSubCategories(categoryMap);
        await Promise.all(subCategories.map(subCategory => prisma.subCategory.create({ data: subCategory })));

        // Generate subjects, children, users, profiles, and associations
        const subjects = generateSubjects(5);
        const createdSubjects = await Promise.all(subjects.map(subject => prisma.subject.create({ data: subject })));

        const children = generateChildren(5);
        const createdChildren = await Promise.all(children.map(child => prisma.child.create({ data: child })));

        const users = generateUsers(10);
        for (const user of users) {
            const createdUser = await prisma.user.create({ data: user });

            const profile = generateProfiles(createdUser.id);
            await prisma.profile.create({ data: profile });

            const ads = await generateAds(createdUser.id, categoryIds, subCategories.map(sub => sub.id), 3);
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

            for (const relation of userHasChildren) {
                await prisma.userHasChildren.upsert({
                    where: { userId_childId: { userId: relation.userId, childId: relation.childId } },
                    update: {},
                    create: relation,
                });
            }
        }
        console.log('Données générées!');
    } catch (error) {
        console.error('Erreur lors de la génération des données:', error);
    }
};

seed()
.catch((error) => console.error(error))
.finally(async () => {
    await prisma.$disconnect();
});