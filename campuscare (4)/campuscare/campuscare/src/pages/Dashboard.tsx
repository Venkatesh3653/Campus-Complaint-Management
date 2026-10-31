import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Clock, FilePlus2, Layers } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLoad } from '../hooks/useLoad'
import { api } from '../services'
import { Badge, Empty, Skeleton } from '../components/ui'
import { CategoryBars, ChartCard, Legend, StatusDonut, TrendArea } from '../components/charts/Charts'
import { timeAgo } from '../utils/format'
export default function Dashboard() {
  const { user } = useApp(); const u = user!
  const { data: d, loading } = useLoad(() => api.dashboards.get(u.role), [u.id])
  const { data: list } = useLoad(() => api.complaints.list(), [u.id])
  const stats = d && [[Layers, 'Total', d.total, 'text-indigo-600'], [AlertCircle, u.role === 'admin' ? 'Awaiting action' : 'Open', d.open, 'text-sky-600'], [Clock, 'In progress', d.inProgress, 'text-amber-600'], [CheckCircle2, 'Resolved', d.resolved, 'text-emerald-600']] as const
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Welcome back, {u.name.split(' ')[0]}</h1><p className="text-sm text-slate-500">{u.role === 'student' ? 'Here is where your complaints stand.' : u.role === 'staff' ? 'Your assigned work at a glance.' : 'Campus-wide complaint overview.'}</p></div>
      {u.role === 'student' && <Link to="/app/complaints/new" className="btn-primary"><FilePlus2 size={16} />New complaint</Link>}</div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{loading || !stats ? [0, 1, 2, 3].map(i => <Skeleton key={i} className="h-24" />) : stats.map(([I, l, v, c]) => <div key={l} className="card p-4"><I size={18} className={c} /><div className="font-display mt-2 text-3xl font-bold">{v}</div><div className="text-xs text-slate-500">{l}</div></div>)}</div>
    {d && <div className={`grid gap-4 ${u.role === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
      <ChartCard title="Status breakdown"><StatusDonut d={d} /></ChartCard>
      {u.role === 'admin' && <ChartCard title="Complaints by category"><CategoryBars d={d} /></ChartCard>}
      <ChartCard title="New complaints, last 7 days"><TrendArea d={d} /></ChartCard></div>}
    {d && <Legend names={d.byStatus.map(s => s.name)} />}
    <div className="card"><div className="flex items-center justify-between p-4"><h2 className="font-semibold">Recent complaints</h2><Link className="text-sm text-indigo-600 hover:underline" to="/app/complaints">View all</Link></div>
      {!list ? <div className="space-y-2 p-4"><Skeleton className="h-10" /><Skeleton className="h-10" /></div> : list.length === 0 ? <Empty title="Nothing here yet" hint={u.role === 'student' ? 'Submit your first complaint to start tracking it.' : 'No complaints are assigned to you right now.'} /> :
        <ul>{list.slice(0, 5).map(c => <li key={c.id} className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800"><Link to={`/app/complaints/${c.id}`} className="min-w-0"><div className="truncate text-sm font-medium hover:text-indigo-600">{c.title}</div><div className="text-xs text-slate-500">{c.id} · {timeAgo(c.createdAt)}</div></Link><Badge v={c.status} /></li>)}</ul>}</div></div>
}
