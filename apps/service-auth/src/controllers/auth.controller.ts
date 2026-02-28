import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '@onboardai/utils';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { companyName, domain, email, password, fullName } = req.body;

    if (!companyName || !domain || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'All fields are required' }
      });
    }

    const result = await authService.register({ companyName, domain, email, password, fullName });

    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    logger.error('Register failed', { error: error.message });
    return res.status(400).json({
      success: false,
      error: { code: 'REGISTER_FAILED', message: error.message }
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' }
      });
    }

    const result = await authService.login({ email, password });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    logger.error('Login failed', { error: error.message });
    return res.status(401).json({
      success: false,
      error: { code: 'LOGIN_FAILED', message: error.message }
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await authService.getUserById(userId);

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    logger.error('GetMe failed', { error: error.message });
    return res.status(400).json({
      success: false,
      error: { code: 'GET_ME_FAILED', message: error.message }
    });
  }
};
