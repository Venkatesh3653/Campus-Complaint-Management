export type Role = 'student' | 'staff' | 'admin'
export const STATUSES = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'] as const
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const
export const CATEGORIES = ['Hostel', 'Academics', 'IT & Wi-Fi', 'Canteen', 'Infrastructure', 'Transport', 'Library', 'Safety'] as const
export const LOCATIONS = ['Block A Hostel', 'Block B Hostel', 'Main Library', 'Central Canteen', 'Computer Lab 2', 'Lecture Hall Complex', 'Sports Ground', 'Main Gate']
export type Status = typeof STATUSES[number]
export type Priority = typeof PRIORITIES[number]
export interface User { id: string; name: string; email: string; role: Role; department?: string }
export interface HistoryEntry { status: Status; at: string; by: string; note?: string }
export interface Complaint {
  id: string; title: string; description: string; category: string; priority: Priority; location: string; status: Status
  studentId: string; studentName: string; assigneeId?: string; assigneeName?: string
  createdAt: string; updatedAt: string; resolutionNote?: string; history: HistoryEntry[]
}
export interface NewComplaint { title: string; description: string; category: string; priority: Priority; location: string }
export interface AppNotification { id: string; userId: string; title: string; body: string; read: boolean; at: string; complaintId?: string }
export interface Dash { total: number; open: number; inProgress: number; resolved: number; byStatus: { name: string; value: number }[]; byCategory: { name: string; value: number }[]; trend: { day: string; count: number }[] }
