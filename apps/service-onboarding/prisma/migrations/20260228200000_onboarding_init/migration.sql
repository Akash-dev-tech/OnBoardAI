CREATE TYPE "OnboardingStatus" AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'skipped');

CREATE TABLE "onboarding_templates" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "onboarding_templates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "linkUrl" TEXT,
    "dueAfterDays" INTEGER NOT NULL DEFAULT 7,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "employee_onboardings" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "status" "OnboardingStatus" NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "employee_onboardings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "task_progress" (
    "id" TEXT NOT NULL,
    "employeeOnboardingId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "task_progress_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "onboarding_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_onboardings" ADD CONSTRAINT "employee_onboardings_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "onboarding_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_employeeOnboardingId_fkey" FOREIGN KEY ("employeeOnboardingId") REFERENCES "employee_onboardings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "task_progress_employeeOnboardingId_taskId_key" ON "task_progress"("employeeOnboardingId", "taskId");
