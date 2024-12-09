-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateAndTime" DATETIME NOT NULL,
    "clientPhone" TEXT,
    "clientEmail" TEXT,
    "formName" TEXT,
    "clientFullName" TEXT,
    "clientSurname" TEXT,
    "clientName" TEXT,
    "clientPatronymic" TEXT,
    "planStart" DATETIME,
    "planEnd" DATETIME,
    "comment" TEXT,
    "doctorId" INTEGER,
    "doctorName" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "httpReferer" TEXT
);

-- CreateTable
CREATE TABLE "IDENT_Branches" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "IDENT_Doctors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specialty" TEXT
);

-- CreateTable
CREATE TABLE "IDENT_Intervals" (
    "branchId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "startDateTime" DATETIME NOT NULL,
    "lengthInMinutes" INTEGER NOT NULL,
    "isBusy" BOOLEAN NOT NULL,

    PRIMARY KEY ("branchId", "doctorId", "startDateTime"),
    CONSTRAINT "IDENT_Intervals_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "IDENT_Branches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IDENT_Intervals_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "IDENT_Doctors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
