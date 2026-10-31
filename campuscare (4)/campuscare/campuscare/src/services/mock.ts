// DEMO MODE: data lives only in this browser's localStorage. Nothing is saved to a server.
import type { Api } from './types'
import { DEMO_USERS, seedComplaints, seedNotifications } from '../data/mock'
import { AppNotification, Complaint, Dash, STATUSES, User } from '../types'
const K = 'campuscare-demo-v1', S = 'campuscare-demo-session'
interface DB { complaints: Complaint[]; notifications: AppNotification[] }
const load = (): DB => { try { const r = localStorage.getItem(K); if (r) return JSON.parse(r) } catch { /* ignore */ } const d = { complaints: seedComplaints(), notifications: seedNotifications() }; localStorage.setItem(K, JSON.stringify(d)); return d }
const save = (d: DB) => localStorage.setItem(K, JSON.stringify(d))
const wait = <T,>(v: T, ms = 350) => new Promise<T>(r => setTimeout(() => r(v), ms))
const me = () => DEMO_USERS.find(u => u.id === localStorage.getItem(S))
const notify = (db: DB, userId: string, title: string, body: string, complaintId?: string) => db.notifications.unshift({ id: 'n' + Date.now() + Math.random(), userId, title, body, read: false, at: new Date().toISOString(), complaintId })
export const resetDemo = () => { localStorage.removeItem(K) }
export const mockApi: Api = {
  auth: {
    login: async email => { const u = DEMO_USERS.find(x => x.email === email.trim().toLowerCase()); if (!u) throw new Error('Demo accounts only. Pick one below, e.g. aria@demo.campuscare.'); localStorage.setItem(S, u.id); return wait({ user: u, token: 'demo' }) },
    register: async d => { const u: User = { id: 'u' + Date.now(), name: d.name, email: d.email, role: d.role }; DEMO_USERS.push(u); localStorage.setItem(S, u.id); return wait({ user: u, token: 'demo' }) },
    me: () => wait(me() ?? null, 150), logout: () => localStorage.removeItem(S),
  },
  complaints: {
    list: async () => { const u = me(), all = load().complaints; const l = !u ? [] : u.role === 'student' ? all.filter(c => c.studentId === u.id) : u.role === 'staff' ? all.filter(c => c.assigneeId === u.id) : all; return wait([...l].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) },
    get: async id => { const c = load().complaints.find(x => x.id === id); if (!c) throw new Error('Complaint not found'); return wait(c) },
    create: async d => { const db = load(), u = me()!, now = new Date().toISOString(); const c: Complaint = { ...d, id: `CC-${1001 + db.complaints.length}`, status: 'Open', studentId: u.id, studentName: u.name, createdAt: now, updatedAt: now, history: [{ status: 'Open', at: now, by: u.name }] }; db.complaints.unshift(c); notify(db, 'a1', 'New complaint', `${c.id}: ${c.title}`, c.id); save(db); return wait(c) },
    updateStatus: async (id, status, note) => { const db = load(), c = db.complaints.find(x => x.id === id)!, u = me()!, now = new Date().toISOString(); c.status = status; c.updatedAt = now; if (note) c.resolutionNote = note; c.history.push({ status, at: now, by: u.name, note }); notify(db, c.studentId, `Complaint ${status.toLowerCase()}`, `${c.id} is now ${status}.`, c.id); save(db); return wait(c) },
    assign: async (id, aid) => { const db = load(), c = db.complaints.find(x => x.id === id)!, s = DEMO_USERS.find(x => x.id === aid)!, now = new Date().toISOString(); c.assigneeId = aid; c.assigneeName = s.name; if (c.status === 'Open') { c.status = 'Assigned'; c.history.push({ status: 'Assigned', at: now, by: me()!.name, note: `Assigned to ${s.name}` }) } c.updatedAt = now; notify(db, aid, 'New assignment', `${c.id} (${c.priority}) was assigned to you.`, c.id); save(db); return wait(c) },
    staff: () => wait(DEMO_USERS.filter(u => u.role === 'staff')),
  },
  dashboards: { get: async () => { const l = await mockApi.complaints.list(); const cnt = (k: (c: Complaint) => string, keys: readonly string[]) => keys.map(n => ({ name: n, value: l.filter(c => k(c) === n).length })); const cats = [...new Set(l.map(c => c.category))]
    const trend = Array.from({ length: 7 }, (_, i) => { const d = new Date(Date.now() - (6 - i) * 864e5); return { day: d.toLocaleDateString('en-IN', { weekday: 'short' }), count: l.filter(c => new Date(c.createdAt).toDateString() === d.toDateString()).length } })
    const r: Dash = { total: l.length, open: l.filter(c => c.status === 'Open' || c.status === 'Assigned').length, inProgress: l.filter(c => c.status === 'In Progress').length, resolved: l.filter(c => c.status === 'Resolved' || c.status === 'Closed').length, byStatus: cnt(c => c.status, STATUSES), byCategory: cnt(c => c.category, cats), trend }; return r } },
  notifications: {
    list: async () => { const u = me(); return wait(load().notifications.filter(n => n.userId === u?.id), 200) },
    markRead: async id => { const db = load(); const n = db.notifications.find(x => x.id === id); if (n) n.read = true; save(db) },
    markAll: async () => { const db = load(), u = me(); db.notifications.forEach(n => { if (n.userId === u?.id) n.read = true }); save(db) },
  },
}
