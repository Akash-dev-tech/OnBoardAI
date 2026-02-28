-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('starter', 'growth', 'enterprise');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'manager', 'hr', 'employee');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('invited', 'active', 'completed', 'churned');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'starter',
    "onboardingConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'employee',
    "fullName" TEXT NOT NULL,
    "department" TEXT,
    "avatarUrl" TEXT,
    "joinDate" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'invited',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_domain_key" ON "companies"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
