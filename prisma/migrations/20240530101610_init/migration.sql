-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(70) NOT NULL,
    `lastName` VARCHAR(70) NOT NULL,
    `email` VARCHAR(70) NOT NULL,
    `role` ENUM('admin', 'parent', 'intervenant') NOT NULL,
    `status` ENUM('activated', 'unactivated') NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `postalCode` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `profilePicture` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Profiles_userId_key`(`userId`),
    UNIQUE INDEX `Profiles_id_userId_key`(`id`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Children` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(255) NULL,
    `lastName` VARCHAR(50) NULL,
    `school` VARCHAR(50) NULL,
    `class` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `startTime` DATETIME NULL,
    `endTime` DATETIME NULL,
    `duration` INTEGER NULL,
    `address` VARCHAR(50) NOT NULL,
    `postalCode` VARCHAR(50) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `attendees` INTEGER NULL,
    `transport` ENUM('car', 'van') NULL,
    `conform` BOOLEAN NULL,
    `status` ENUM('cancel', 'report') NULL,
    `adPicture` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    INDEX `user_id`(`userId`),
    INDEX `category_id`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filePath` VARCHAR(500) NOT NULL,
    `fileType` ENUM('jpg', 'png') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    INDEX `user_id`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGroups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    INDEX `user_id`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(500) NOT NULL,
    `conform` BOOLEAN NULL,
    `relatedEntityId` INTEGER NULL,
    `relatedEntityType` ENUM('ad', 'user_group') NULL,
    `userId` INTEGER NOT NULL,

    INDEX `user_id`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserHasAd` (
    `userId` INTEGER NOT NULL,
    `adId` INTEGER NOT NULL,
    `userAttendees` INTEGER NULL,
    `status` ENUM('true', 'false') NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ad_id`(`adId`),
    PRIMARY KEY (`userId`, `adId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserHasChild` (
    `userId` INTEGER NOT NULL,
    `childId` INTEGER NOT NULL,

    INDEX `child_id`(`childId`),
    PRIMARY KEY (`userId`, `childId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGroupHasUser` (
    `userId` INTEGER NOT NULL,
    `userGroupId` INTEGER NOT NULL,
    `status` ENUM('invited', 'member') NULL,

    INDEX `user_group_id`(`userGroupId`),
    PRIMARY KEY (`userId`, `userGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdHasFile` (
    `adId` INTEGER NOT NULL,
    `fileId` INTEGER NOT NULL,

    INDEX `file_id`(`fileId`),
    PRIMARY KEY (`adId`, `fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserHasSubjects` (
    `userId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,

    INDEX `fk_Users_has_Subjects_Subjects1_idx`(`subjectId`),
    INDEX `fk_Users_has_Subjects_Users1_idx`(`userId`),
    PRIMARY KEY (`userId`, `subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGroupHasFile` (
    `fileId` INTEGER NOT NULL,
    `userGroupId` INTEGER NOT NULL,

    INDEX `fk_Files_has_User_groups_User_groups1_idx`(`userGroupId`),
    INDEX `fk_Files_has_User_groups_Files1_idx`(`fileId`),
    PRIMARY KEY (`fileId`, `userGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profiles` ADD CONSTRAINT `Profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ads` ADD CONSTRAINT `Ads_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ads` ADD CONSTRAINT `Ads_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroups` ADD CONSTRAINT `UserGroups_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasAd` ADD CONSTRAINT `UserHasAd_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasAd` ADD CONSTRAINT `UserHasAd_adId_fkey` FOREIGN KEY (`adId`) REFERENCES `Ads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasChild` ADD CONSTRAINT `UserHasChild_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasChild` ADD CONSTRAINT `UserHasChild_childId_fkey` FOREIGN KEY (`childId`) REFERENCES `Children`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupHasUser` ADD CONSTRAINT `UserGroupHasUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupHasUser` ADD CONSTRAINT `UserGroupHasUser_userGroupId_fkey` FOREIGN KEY (`userGroupId`) REFERENCES `UserGroups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdHasFile` ADD CONSTRAINT `AdHasFile_adId_fkey` FOREIGN KEY (`adId`) REFERENCES `Ads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdHasFile` ADD CONSTRAINT `AdHasFile_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `Files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasSubjects` ADD CONSTRAINT `UserHasSubjects_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserHasSubjects` ADD CONSTRAINT `UserHasSubjects_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupHasFile` ADD CONSTRAINT `UserGroupHasFile_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `Files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroupHasFile` ADD CONSTRAINT `UserGroupHasFile_userGroupId_fkey` FOREIGN KEY (`userGroupId`) REFERENCES `UserGroups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
