/*
  Warnings:

  - The `initialWager` column on the `Market` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balance` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `bet_amount` on the `Bet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transaction_amount` on the `WalletEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "bet_amount",
ADD COLUMN     "bet_amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Market" DROP COLUMN "initialWager",
ADD COLUMN     "initialWager" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balance",
ADD COLUMN     "balance" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "WalletEvent" DROP COLUMN "transaction_amount",
ADD COLUMN     "transaction_amount" INTEGER NOT NULL;
