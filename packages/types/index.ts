// ─── USER TYPES ────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'hr' | 'employee';
export type UserStatus = 'invited' | 'active' | 'completed' | 'churned';

export interface User {
  id: string;
  companyId: string;
  email: string;
  role: UserRole;
  fullName: string;
  department?: string;
  status: UserStatus;
  createdAt: Date;
}

// ─── COMPANY TYPES ─────────────────────────────────────────
export type CompanyPlan = 'starter' | 'growth' | 'enterprise';

export interface Company {
  id: string;
  name: string;
  domain: string;
  plan: CompanyPlan;
  createdAt: Date;
}

// ─── JOURNEY TYPES ─────────────────────────────────────────
export type JourneyStatus = 'pending' | 'active' | 'paused' | 'completed';
export type TaskType = 'document' | 'quiz' | 'meeting' | 'shadowing' | 'project' | 'checklist';

export interface Journey {
  id: string;
  companyId: string;
  employeeId: string;
  templateId: string;
  status: JourneyStatus;
  progressPct: number;
  startDate: Date;
  targetEndDate?: Date;
}

// ─── API RESPONSE TYPE ──────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// ─── EVENT BUS TYPES ────────────────────────────────────────
export type EventType =
  | 'user.invited'
  | 'user.activated'
  | 'journey.started'
  | 'journey.completed'
  | 'task.completed'
  | 'score.recomputed'
  | 'peer.suggested';

export interface DomainEvent<T = unknown> {
  eventId: string;
  eventType: EventType;
  timestamp: string;
  companyId: string;
  payload: T;
}
