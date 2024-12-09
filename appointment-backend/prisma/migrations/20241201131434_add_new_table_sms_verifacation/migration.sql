-- CreateTable
CREATE TABLE "SmsVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requestId" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
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
    "httpReferer" TEXT,
    CONSTRAINT "Request_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "IDENT_Doctors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Request" ("clientEmail", "clientFullName", "clientName", "clientPatronymic", "clientPhone", "clientSurname", "comment", "dateAndTime", "doctorId", "doctorName", "formName", "httpReferer", "id", "planEnd", "planStart", "utmCampaign", "utmContent", "utmMedium", "utmSource", "utmTerm") SELECT "clientEmail", "clientFullName", "clientName", "clientPatronymic", "clientPhone", "clientSurname", "comment", "dateAndTime", "doctorId", "doctorName", "formName", "httpReferer", "id", "planEnd", "planStart", "utmCampaign", "utmContent", "utmMedium", "utmSource", "utmTerm" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SmsVerification_requestId_key" ON "SmsVerification"("requestId");
