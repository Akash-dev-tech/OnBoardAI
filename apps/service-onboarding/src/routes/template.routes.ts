import { Router } from 'express';
import { templateController } from '../controllers/template.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, requireAdmin, templateController.createTemplate);
router.get('/', authenticate, templateController.getTemplates);
router.post('/:templateId/tasks', authenticate, requireAdmin, templateController.addTask);
router.delete('/tasks/:taskId', authenticate, requireAdmin, templateController.deleteTask);
router.post('/assign', authenticate, requireAdmin, templateController.assignTemplate);
router.get('/progress', authenticate, requireAdmin, templateController.getCompanyProgress);
router.get('/my-onboarding', authenticate, templateController.getEmployeeOnboarding);
router.patch('/:employeeOnboardingId/tasks/:taskId/complete', authenticate, templateController.completeTask);

export default router;
