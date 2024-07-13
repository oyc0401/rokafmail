-- CreateTable
CREATE TABLE "Auth" (
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "password" TEXT,
    "uid" TEXT,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
