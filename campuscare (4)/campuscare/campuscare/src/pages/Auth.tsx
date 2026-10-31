import { FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Field, Logo } from '../components/ui'
import { useApp } from '../context/AppContext'
import { api, DEMO } from '../services'
import { DEMO_USERS } from '../data/mock'
import type { Role } from '../types'
const emailOk = (s: string) => /^\S+@\S+\.\S+$/.test(s) || s.endsWith('@demo.campuscare')
const Shell = ({ title, children }: { title: string; children: React.ReactNode }) => <div className="grid min-h-screen place-items-center p-4"><div className="w-full max-w-sm"><Link to="/" className="mb-6 inline-block"><Logo /></Link><h1 className="mb-5 text-2xl font-bold">{title}</h1>{children}</div></div>
export function Login() {
  const { user, setUser, toast } = useApp(); const nav = useNavigate()
  const [email, setEmail] = useState(''), [pw, setPw] = useState(''), [err, setErr] = useState<Record<string, string>>({}), [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/app" replace />
  const go = async (e: string, p: string) => { setBusy(true); try { const r = await api.auth.login(e, p); setUser(r.user); nav('/app') } catch (x: any) { toast(x.message, 'err') } finally { setBusy(false) } }
  const submit = (ev: FormEvent) => { ev.preventDefault(); const er: Record<string, string> = {}; if (!emailOk(email)) er.email = 'Enter a valid email address.'; if (pw.length < 6) er.pw = 'Password must be at least 6 characters.'; setErr(er); if (!Object.keys(er).length) go(email, pw) }
  return <Shell title="Sign in"><form onSubmit={submit} className="space-y-4" noValidate>
    <Field label="Email" error={err.email}><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></Field>
    <Field label="Password" error={err.pw}><input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)} autoComplete="current-password" /></Field>
    <button className="btn-primary w-full" disabled={busy}>Sign in</button></form>
    {DEMO && <div className="card mt-6 p-4"><p className="text-sm font-medium">Demo sign-in</p><p className="mb-3 text-xs text-slate-500">No real authentication. Choose a fictional account.</p>
      <div className="grid gap-2">{[DEMO_USERS[0], DEMO_USERS[2], DEMO_USERS[4]].map(u => <button key={u.id} className="btn-outline !justify-between" onClick={() => go(u.email, 'demo-pass')}><span>{u.name}</span><span className="text-xs capitalize text-slate-500">{u.role}</span></button>)}</div></div>}
    <p className="mt-5 text-sm text-slate-500">New here? <Link className="text-indigo-600 hover:underline" to="/register">Create an account</Link></p></Shell>
}
export function Register() {
  const { user, setUser, toast } = useApp(); const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'student' as Role }), [err, setErr] = useState<Record<string, string>>({})
  if (user) return <Navigate to="/app" replace />
  const submit = async (ev: FormEvent) => { ev.preventDefault(); const er: Record<string, string> = {}
    if (f.name.trim().length < 2) er.name = 'Enter your full name.'; if (!emailOk(f.email)) er.email = 'Enter a valid email address.'; if (f.password.length < 8) er.password = 'Use at least 8 characters.'; setErr(er); if (Object.keys(er).length) return
    try { const r = await api.auth.register(f); setUser(r.user); toast('Account created'); nav('/app') } catch (x: any) { toast(x.message, 'err') } }
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value })
  return <Shell title="Create your account"><form onSubmit={submit} className="space-y-4" noValidate>
    <Field label="Full name" error={err.name}><input className="input" value={f.name} onChange={set('name')} /></Field><Field label="Email" error={err.email}><input className="input" type="email" value={f.email} onChange={set('email')} /></Field>
    <Field label="Password" error={err.password}><input className="input" type="password" value={f.password} onChange={set('password')} /></Field>
    {DEMO && <Field label="Demo role"><select className="input" value={f.role} onChange={set('role')}><option value="student">Student</option><option value="staff">Staff</option><option value="admin">Administrator</option></select></Field>}
    <button className="btn-primary w-full">Create account</button></form><p className="mt-5 text-sm text-slate-500">Have an account? <Link className="text-indigo-600 hover:underline" to="/login">Sign in</Link></p></Shell>
}
