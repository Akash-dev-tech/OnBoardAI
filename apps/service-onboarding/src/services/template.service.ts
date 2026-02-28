import prisma from '../lib/prisma';

export const templateService = {
  async createTemplate(companyId: string, data: { name: string; description?: string }) {
    return prisma.onboardingTemplate.create({
      data: { companyId, ...data },
      include: { tasks: true }
    });
  },

  async getTemplates(companyId: string) {
    return prisma.onboardingTemplate.findMany({
      where: { companyId, isActive: true },
      include: { tasks: { orderBy: { order: 'asc' } } }
    });
  },

  async getTemplateById(id: string, companyId: string) {
    return prisma.onboardingTemplate.findFirst({
      where: { id, companyId },
      include: { tasks: { orderBy: { order: 'asc' } } }
    });
  },

  async addTask(templateId: string, data: {
    title: string;
    description?: string;
    videoUrl?: string;
    linkUrl?: string;
    dueAfterDays?: number;
    order?: number;
    isRequired?: boolean;
  }) {
    return prisma.task.create({
      data: { templateId, ...data }
    });
  },

  async deleteTask(taskId: string) {
    return prisma.task.delete({ where: { id: taskId } });
  },

  async assignTemplate(data: {
    employeeId: string;
    templateId: string;
    companyId: string;
    dueDate?: Date;
  }) {
    const onboarding = await prisma.employeeOnboarding.create({
      data,
      include: { template: { include: { tasks: true } } }
    });

    const taskProgressData = onboarding.template.tasks.map((task: any) => ({
      employeeOnboardingId: onboarding.id,
      taskId: task.id,
      status: 'pending' as const
    }));

    await prisma.taskProgress.createMany({ data: taskProgressData });
    return onboarding;
  },

  async getEmployeeOnboarding(employeeId: string) {
    return prisma.employeeOnboarding.findMany({
      where: { employeeId },
      include: {
        template: true,
        taskProgress: { include: { task: true } }
      }
    });
  },

  async completeTask(employeeOnboardingId: string, taskId: string, notes?: string) {
    return prisma.taskProgress.update({
      where: { employeeOnboardingId_taskId: { employeeOnboardingId, taskId } },
      data: { status: 'completed', completedAt: new Date(), notes }
    });
  },

  async getCompanyProgress(companyId: string) {
    return prisma.employeeOnboarding.findMany({
      where: { companyId },
      include: {
        template: true,
        taskProgress: { include: { task: true } }
      }
    });
  }
};
