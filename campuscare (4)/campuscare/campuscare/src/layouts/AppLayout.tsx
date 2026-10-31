import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, FilePlus2, LayoutDashboard, ListChecks, Menu, Moon, Search, Sun, User as UserI, X, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLoad } from '../hooks/useLoad'
import { api, DEMO } from '../services'
import { Logo, Modal, Skeleton } from '../components/ui'
export default function AppLayout() {
  const { user, ready, dark, toggleTheme, logout } = useApp(); const nav = useNavigate(); const loc = useLocation()
  const [open, setOpen] = useState(false), [pal, setPal] = useState(false), [q, setQ] = useState(''), [sel, setSel] = useState(0)
  const { data: notes } = useLoad(() => api.notifications.list(), [loc.pathname])
  useEffect(() => { const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal(p => !p) } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [])
  useEffect(() => setOpen(false), [loc.pathname])
  if (!ready) return <div className="p-8"><Skeleton className="h-10 w-48" /></div>
  if (!user) return <Navigate to="/login" replace />
  const links = [{ to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/app/complaints', label: user.role === 'student' ? 'My complaints' : user.role === 'staff' ? 'Assigned to me' : 'All complaints', icon: ListChecks },
    ...(user.role === 'student' ? [{ to: '/app/complaints/new', label: 'New complaint', icon: FilePlus2 }] : []), { to: '/app/notifications', label: 'Notifications', icon: Bell }, { to: '/app/profile', label: 'Profile & settings', icon: UserI }]
  const unread = notes?.filter(n => !n.read).length ?? 0
  const cmds = [...links.map(l => ({ label: `Go to ${l.label}`, run: () => nav(l.to) })), { label: dark ? 'Switch to light mode' : 'Switch to dark mode', run: toggleTheme }, { label: 'Sign out', run: () => { logout(); nav('/') } }].filter(c => c.label.toLowerCase().includes(q.toLowerCase()))
  const run = (i: number) => { cmds[i]?.run(); setPal(false); setQ('') }
  const side = <><div className="flex h-14 items-center justify-between px-4"><Link to="/"><Logo /></Link><button className="btn-ghost !p-1.5 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X size={18} /></button></div>
    <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Main">{links.map(l => <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}><l.icon size={17} />{l.label}</NavLink>)}</nav>
    <div className="border-t border-slate-200 p-3 dark:border-slate-800"><div className="px-2 pb-2 text-sm"><div className="font-medium">{user.name}</div><div className="text-xs capitalize text-slate-500">{user.role}</div></div><button className="btn-ghost w-full !justify-start" onClick={() => { logout(); nav('/') }}><LogOut size={16} />Sign out</button></div></>
  return <div className="min-h-screen">
    <aside className="fixed inset-y-0 hidden w-60 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">{side}</aside>
    {open && <div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} /><aside className="relative flex h-full w-64 flex-col bg-white dark:bg-slate-900">{side}</aside></div>}
    <div className="lg:pl-60">
      {DEMO && <div className="bg-violet-600 px-4 py-1.5 text-center text-xs text-white">Demo mode: sample data and demo sign-in. Changes stay in this browser only and are not saved to a server.</div>}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <button className="btn-ghost !p-2 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={18} /></button>
        <button className="btn-outline ml-auto !justify-start text-slate-500 sm:w-64" onClick={() => setPal(true)}><Search size={15} /><span className="hidden flex-1 text-left sm:block">Search or jump to…</span><kbd className="hidden rounded border border-slate-300 px-1.5 text-xs dark:border-slate-600 sm:block">Ctrl K</kbd></button>
        <button className="btn-ghost !p-2" aria-label="Toggle dark mode" onClick={toggleTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        <Link to="/app/notifications" className="btn-ghost relative !p-2" aria-label={`Notifications, ${unread} unread`}><Bell size={18} />{unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />}</Link>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-6"><Outlet /></main></div>
    <Modal open={pal} onClose={() => { setPal(false); setQ('') }} title="Command palette"><input autoFocus className="w-full border-b border-slate-200 bg-transparent px-4 py-3 text-sm outline-none dark:border-slate-800" placeholder="Type a command…" aria-label="Command" value={q}
      onChange={e => { setQ(e.target.value); setSel(0) }} onKeyDown={e => { if (e.key === 'ArrowDown') setSel(s => Math.min(s + 1, cmds.length - 1)); if (e.key === 'ArrowUp') setSel(s => Math.max(s - 1, 0)); if (e.key === 'Enter') run(sel) }} />
      <ul className="max-h-72 overflow-auto p-2">{cmds.map((c, i) => <li key={c.label}><button className={`w-full rounded-lg px-3 py-2 text-left text-sm ${i === sel ? 'bg-indigo-50 dark:bg-indigo-500/15' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => run(i)}>{c.label}</button></li>)}{!cmds.length && <li className="px-3 py-2 text-sm text-slate-500">No matching commands</li>}</ul></Modal>
  </div>
}
