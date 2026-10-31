import { Link } from 'react-router-dom'
import { BarChart3, Bell, Check, Moon, Sun, UserCheck } from 'lucide-react'
import { Logo, Badge } from '../components/ui'
import { useApp } from '../context/AppContext'
export default function Landing() {
  const { dark, toggleTheme } = useApp()
  const steps = [['Open', 'Aria reports a leaking cooler', '2 days ago'], ['Assigned', 'Routed to Facilities (Rohan Iyer)', '2 days ago'], ['In Progress', 'Plumber scheduled for Friday', 'Yesterday']] as const
  return <div>
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4"><Logo />
      <nav className="flex items-center gap-1 text-sm" aria-label="Site"><a className="btn-ghost hidden sm:inline-flex" href="#features">Features</a><a className="btn-ghost hidden sm:inline-flex" href="#how">How it works</a>
        <button className="btn-ghost !p-2" aria-label="Toggle dark mode" onClick={toggleTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><Link to="/login" className="btn-outline">Sign in</Link><Link to="/register" className="btn-primary">Get started</Link></nav></header>
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
      <div><h1 className="text-4xl font-bold leading-tight sm:text-5xl">Report it once. Watch it get fixed.</h1>
        <p className="mt-5 max-w-lg text-lg text-slate-600 dark:text-slate-400">CampusCare gives students one place to raise campus complaints, and gives staff and administrators a clear queue to resolve them.</p>
        <div className="mt-8 flex gap-3"><Link to="/login" className="btn-primary !px-5 !py-2.5">Try the demo</Link><a href="#how" className="btn-outline !px-5 !py-2.5">See how it works</a></div></div>
      <div className="card p-5 shadow-xl shadow-indigo-500/5"><div className="flex items-start justify-between"><div><div className="text-xs text-slate-500">CC-1002</div><div className="font-semibold">Water cooler leaking near library entrance</div></div><Badge v="In Progress" /></div>
        <ol className="mt-5 space-y-4 border-l border-slate-200 pl-5 dark:border-slate-700">{steps.map(([s, t, w]) => <li key={s} className="relative"><span className="absolute -left-[27px] top-1 grid h-3 w-3 place-items-center rounded-full bg-indigo-600" /><div className="text-sm font-medium">{s}</div><div className="text-sm text-slate-500">{t} · {w}</div></li>)}</ol>
        <p className="mt-4 text-xs text-slate-400">Sample ticket from the demo data.</p></div></section>
    <section id="features" className="mx-auto max-w-6xl px-5 py-12"><h2 className="text-2xl font-bold">Built for all three sides of a complaint</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{[[Bell, 'Students see every update', 'Search your history, follow status changes and read resolution notes.'], [UserCheck, 'Staff work a focused queue', 'Filter by priority, update status and record what was done.'], [BarChart3, 'Admins see the whole campus', 'Assign work, sort and paginate records, and spot problem areas on charts.']].map(([I, t, d]: any) =>
        <div key={t} className="card p-5"><I size={20} className="text-indigo-600" /><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-1 text-sm text-slate-500">{d}</p></div>)}</div></section>
    <section id="how" className="mx-auto max-w-6xl px-5 py-12"><h2 className="text-2xl font-bold">How a complaint moves</h2>
      <ol className="mt-6 grid gap-3 sm:grid-cols-4">{['Student submits with location and priority', 'Admin assigns it to staff', 'Staff updates progress', 'Student reads the resolution'].map((t, i) => <li key={t} className="card flex gap-3 p-4 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-emerald-500" /><span><b>Step {i + 1}.</b> {t}</span></li>)}</ol></section>
    <footer className="mx-auto max-w-6xl px-5 py-10 text-sm text-slate-500">CampusCare hackathon prototype. Demo mode uses fictional data stored only in your browser.</footer></div>
}
