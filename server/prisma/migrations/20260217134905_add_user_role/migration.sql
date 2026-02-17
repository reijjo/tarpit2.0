-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GUEST', 'PAID', 'BOSS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'GUEST';
