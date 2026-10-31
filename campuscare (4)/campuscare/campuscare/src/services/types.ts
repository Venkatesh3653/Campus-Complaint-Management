import type { AppNotification, Complaint, Dash, NewComplaint, Role, Status, User } from '../types'
export interface Api {
  auth: { login(email: string, password: string): Promise<{ user: User; token: string }>; register(d: { name: string; email: string; password: string; role: Role }): Promise<{ user: User; token: string }>; me(): Promise<User | null>; logout(): void }
  complaints: { list(): Promise<Complaint[]>; get(id: string): Promise<Complaint>; create(d: NewComplaint): Promise<Complaint>; updateStatus(id: string, status: Status, note?: string): Promise<Complaint>; assign(id: string, assigneeId: string): Promise<Complaint>; staff(): Promise<User[]> }
  dashboards: { get(role: Role): Promise<Dash> }
  notifications: { list(): Promise<AppNotification[]>; markRead(id: string): Promise<void>; markAll(): Promise<void> }
}
