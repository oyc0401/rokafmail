/*
  Warnings:

  - A unique constraint covering the columns `[uid,provider]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Auth_uid_provider_key" ON "Auth"("uid", "provider");
