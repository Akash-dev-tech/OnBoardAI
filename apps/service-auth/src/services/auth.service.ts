import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { logger } from '@onboardai/utils';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL
    }
  }
});

interface RegisterInput {
  companyName: string;
  domain: string;
  email: string;
  password: string;
  fullName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {

  async register(input: RegisterInput) {
    const { companyName, domain, email, password, fullName } = input;

    const existingCompany = await prisma.company.findUnique({ where: { domain } });
    if (existingCompany) throw new Error('Company with this domain already exists');

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 12);

    const company = await prisma.company.create({
      data: {
        name: companyName,
        domain,
        plan: 'starter',
        users: {
          create: {
            email,
            password: hashedPassword,
            fullName,
            role: 'admin',
            status: 'active'
          }
        }
      },
      include: { users: true }
    });

    const user = company.users[0];
    const token = this.generateToken(user.id, user.role, user.companyId);

    logger.info('New company registered', { companyId: company.id, email });

    return {
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, companyId: company.id },
      company: { id: company.id, name: company.name, domain: company.domain, plan: company.plan }
    };
  }

  async login(input: LoginInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });

    if (!user) throw new Error('Invalid email or password');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    const token = this.generateToken(user.id, user.role, user.companyId);

    logger.info('User logged in', { userId: user.id, email });

    return {
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, companyId: user.companyId },
      company: { id: user.company.id, name: user.company.name, domain: user.company.domain, plan: user.company.plan }
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true }
    });

    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      status: user.status,
      companyId: user.companyId,
      company: { id: user.company.id, name: user.company.name, plan: user.company.plan }
    };
  }

  private generateToken(userId: string, role: string, companyId: string): string {
    const secret = process.env.JWT_SECRET as string || 'fallback_secret';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
    return jwt.sign({ id: userId, role, companyId }, secret, { expiresIn });
  }
}
