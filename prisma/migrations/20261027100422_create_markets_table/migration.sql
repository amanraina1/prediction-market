-- CreateEnum
CREATE TYPE "Side" AS ENUM ('yes', 'no');

-- CreateEnum
CREATE TYPE "Resolution" AS ENUM ('resolved', 'pending');

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "initialWager" TEXT DEFAULT '0',
    "creator_id" TEXT NOT NULL,
    "bet" "Side" NOT NULL,
    "resolution" "Resolution" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Market" ADD CONSTRAINT "Market_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
