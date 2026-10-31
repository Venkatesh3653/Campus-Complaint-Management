// Real Spring Boot API client. Endpoint paths are proposed contracts — edit them here.
import type { User } from "../types"
import type { Api } from './types'
export const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
export const endpoints = {
  login: '/auth/login', register: '/auth/register', me: '/auth/me', complaints: '/complaints',
  complaint: (id: string) => `/complaints/${id}`, status: (id: string) => `/complaints/${id}/status`, assignment: (id: string) => `/complaints/${id}/assignment`,
  staff: '/users?role=staff', dashboard: (r: string) => `/dashboard/${r}`, notifications: '/notifications', read: (id: string) => `/notifications/${id}/read`,
}
// Token kept in sessionStorage for the demo build. Prefer httpOnly cookies when the backend supports them.
const tok = { get: () => sessionStorage.getItem('cc-token'), set: (t: string) => sessionStorage.setItem('cc-token', t), clear: () => sessionStorage.removeItem('cc-token') }
async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = tok.get()
  const res = await fetch(BASE + path, { ...init, headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) } })
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Request failed (${res.status})`)
  return res.status === 204 ? (undefined as T) : res.json()
}
const send = (m: string, body?: unknown): RequestInit => ({ method: m, body: body === undefined ? undefined : JSON.stringify(body) })
export const httpApi: Api = {
  auth: {
    login: async (email, password) => { const r = await req<any>(endpoints.login, send('POST', { email, password })); tok.set(r.token); return r },
    register: async d => { const r = await req<any>(endpoints.register, send('POST', d)); tok.set(r.token); return r },
    me: () => (tok.get() ? req<User>(endpoints.me).catch(() => null) : Promise.resolve(null)), logout: () => tok.clear(),
  },
  complaints: {
    list: () => req(endpoints.complaints), get: id => req(endpoints.complaint(id)), create: d => req(endpoints.complaints, send('POST', d)),
    updateStatus: (id, status, note) => req(endpoints.status(id), send('PATCH', { status, note })), assign: (id, assigneeId) => req(endpoints.assignment(id), send('PATCH', { assigneeId })), staff: () => req(endpoints.staff),
  },
  dashboards: { get: r => req(endpoints.dashboard(r)) },
  notifications: { list: () => req(endpoints.notifications), markRead: id => req(endpoints.read(id), send('PATCH')), markAll: () => req(endpoints.notifications + '/read-all', send('PATCH')) },
}
