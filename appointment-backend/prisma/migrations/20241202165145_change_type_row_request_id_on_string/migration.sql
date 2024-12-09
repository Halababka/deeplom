-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SmsVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requestId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SmsVerification" ("createdAt", "expiresAt", "id", "phoneNumber", "requestId", "verificationCode") SELECT "createdAt", "expiresAt", "id", "phoneNumber", "requestId", "verificationCode" FROM "SmsVerification";
DROP TABLE "SmsVerification";
ALTER TABLE "new_SmsVerification" RENAME TO "SmsVerification";
CREATE UNIQUE INDEX "SmsVerification_requestId_key" ON "SmsVerification"("requestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
