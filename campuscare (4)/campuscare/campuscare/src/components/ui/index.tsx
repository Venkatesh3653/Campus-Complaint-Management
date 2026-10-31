import { ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
const tone: Record<string, string> = {
  Open: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', Assigned: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  'In Progress': 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', Resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', Closed: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  Low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', Medium: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300', High: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300', Urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
}
export const Badge = ({ v }: { v: string }) => <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tone[v]}`}>{v}</span>
export const Skeleton = ({ className = '' }: { className?: string }) => <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
export const Empty = ({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) => (
  <div className="flex flex-col items-center px-6 py-14 text-center"><Inbox className="mb-3 text-slate-400" size={32} /><p className="font-medium">{title}</p>{hint && <p className="mt-1 max-w-sm text-sm text-slate-500">{hint}</p>}{action && <div className="mt-4">{action}</div>}</div>)
export const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => (
  <label className="block text-sm"><span className="mb-1 block font-medium">{label}</span>{children}{error && <span className="mt-1 block text-xs text-rose-500" role="alert">{error}</span>}</label>)
export function Modal({ open, onClose, title, children }: { open: boolean; onClose(): void; title?: string; children: ReactNode }) {
  useEffect(() => { if (!open) return; const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [open, onClose])
  return <AnimatePresence>{open && <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
    <motion.div className="absolute inset-0 bg-slate-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
    <motion.div role="dialog" aria-modal="true" aria-label={title} className="card relative w-full max-w-md shadow-2xl" initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}>{children}</motion.div></div>}</AnimatePresence>
}
export const Confirm = ({ open, title, text, label, onYes, onClose }: { open: boolean; title: string; text: string; label: string; onYes(): void; onClose(): void }) => (
  <Modal open={open} onClose={onClose} title={title}><div className="p-5"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p>
    <div className="mt-5 flex justify-end gap-2"><button className="btn-outline" onClick={onClose}>Cancel</button><button className="btn-primary" autoFocus onClick={() => { onYes(); onClose() }}>{label}</button></div></div></Modal>)
export const Logo = () => <span className="font-display flex items-center gap-2 text-lg font-bold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" /></svg></span>CampusCare</span>
