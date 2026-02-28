import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { templateService } from '../services/template.service';

export const templateController = {
  async createTemplate(req: AuthRequest, res: Response) {
    try {
      const { name, description } = req.body;
      const companyId = req.user?.companyId!;
      if (!name) return res.status(400).json({ success: false, error: 'Name is required' });
      const template = await templateService.createTemplate(companyId, { name, description });
      res.status(201).json({ success: true, data: template });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getTemplates(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId!;
      const templates = await templateService.getTemplates(companyId);
      res.json({ success: true, data: templates });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async addTask(req: AuthRequest, res: Response) {
    try {
      const { templateId } = req.params;
      const task = await templateService.addTask(templateId, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params;
      await templateService.deleteTask(taskId);
      res.json({ success: true, message: 'Task deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async assignTemplate(req: AuthRequest, res: Response) {
    try {
      const { employeeId, templateId, dueDate } = req.body;
      const companyId = req.user?.companyId!;
      if (!employeeId || !templateId) {
        return res.status(400).json({ success: false, error: 'employeeId and templateId are required' });
      }
      const onboarding = await templateService.assignTemplate({
        employeeId,
        templateId,
        companyId,
        dueDate: dueDate ? new Date(dueDate) : undefined
      });
      res.status(201).json({ success: true, data: onboarding });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getEmployeeOnboarding(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.id!;
      const onboarding = await templateService.getEmployeeOnboarding(employeeId);
      res.json({ success: true, data: onboarding });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async completeTask(req: AuthRequest, res: Response) {
    try {
      const { employeeOnboardingId, taskId } = req.params;
      const { notes } = req.body;
      const progress = await templateService.completeTask(employeeOnboardingId, taskId, notes);
      res.json({ success: true, data: progress });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getCompanyProgress(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId!;
      const progress = await templateService.getCompanyProgress(companyId);
      res.json({ success: true, data: progress });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
