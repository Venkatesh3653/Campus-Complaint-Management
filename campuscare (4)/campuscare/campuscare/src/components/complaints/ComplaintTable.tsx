import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Badge, Empty } from '../ui'
import { PRIORITIES, STATUSES, Complaint } from '../../types'
import { fmtDate } from '../../utils/format'
const PAGE = 8, rank = { Urgent: 0, High: 1, Medium: 2, Low: 3 }
export default function ComplaintTable({ items, showStudent, cta }: { items: Complaint[]; showStudent?: boolean; cta?: React.ReactNode }) {
  const [q, setQ] = useState(''), [st, setSt] = useState(''), [pr, setPr] = useState(''), [sort, setSort] = useState('new'), [page, setPage] = useState(1)
  const rows = useMemo(() => {
    const l = items.filter(c => (!st || c.status === st) && (!pr || c.priority === pr) && (c.title + c.id + c.category + c.studentName).toLowerCase().includes(q.toLowerCase()))
    return l.sort((a, b) => sort === 'priority' ? rank[a.priority] - rank[b.priority] : sort === 'old' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt))
  }, [items, q, st, pr, sort])
  const pages = Math.max(1, Math.ceil(rows.length / PAGE)), cur = Math.min(page, pages), view = rows.slice((cur - 1) * PAGE, cur * PAGE)
  const reset = <T,>(f: (v: T) => void) => (v: T) => { f(v); setPage(1) }
  return <div className="card">
    <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
      <div className="relative min-w-[200px] flex-1"><Search size={15} className="absolute left-3 top-2.5 text-slate-400" /><input className="input pl-9" placeholder="Search by title, ID or category" aria-label="Search complaints" value={q} onChange={e => reset(setQ)(e.target.value)} /></div>
      <select className="input w-auto" aria-label="Status" value={st} onChange={e => reset(setSt)(e.target.value)}><option value="">All statuses</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
      <select className="input w-auto" aria-label="Priority" value={pr} onChange={e => reset(setPr)(e.target.value)}><option value="">All priorities</option>{PRIORITIES.map(s => <option key={s}>{s}</option>)}</select>
      <select className="input w-auto" aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)}><option value="new">Newest first</option><option value="old">Oldest first</option><option value="priority">Highest priority</option></select>
    </div>
    {view.length === 0 ? <Empty title="No complaints found" hint="Try clearing the filters or search." action={cta} /> : <div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <thead className="text-xs text-slate-500"><tr><th className="px-4 py-2.5 font-medium">Complaint</th>{showStudent && <th className="px-4 font-medium">Student</th>}<th className="px-4 font-medium">Priority</th><th className="px-4 font-medium">Status</th><th className="px-4 font-medium">Assigned to</th><th className="px-4 font-medium">Created</th></tr></thead>
      <tbody>{view.map(c => <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
        <td className="max-w-xs px-4 py-3"><Link to={`/app/complaints/${c.id}`} className="font-medium hover:text-indigo-600">{c.title}</Link><div className="text-xs text-slate-500">{c.id} · {c.category}</div></td>
        {showStudent && <td className="px-4">{c.studentName}</td>}<td className="px-4"><Badge v={c.priority} /></td><td className="px-4"><Badge v={c.status} /></td>
        <td className="px-4 text-slate-500">{c.assigneeName ?? 'Unassigned'}</td><td className="whitespace-nowrap px-4 text-slate-500">{fmtDate(c.createdAt)}</td></tr>)}</tbody></table></div>}
    <div className="flex items-center justify-between border-t border-slate-200 p-3 text-xs text-slate-500 dark:border-slate-800"><span>{rows.length} complaints</span>
      <span className="flex items-center gap-1"><button className="btn-ghost !p-1.5" aria-label="Previous page" disabled={cur === 1} onClick={() => setPage(cur - 1)}><ChevronLeft size={16} /></button>Page {cur} of {pages}<button className="btn-ghost !p-1.5" aria-label="Next page" disabled={cur === pages} onClick={() => setPage(cur + 1)}><ChevronRight size={16} /></button></span></div>
  </div>
}
