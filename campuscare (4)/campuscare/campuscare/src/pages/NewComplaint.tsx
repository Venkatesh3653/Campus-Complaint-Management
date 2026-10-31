import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services'
import { useApp } from '../context/AppContext'
import { Field } from '../components/ui'
import { CATEGORIES, LOCATIONS, PRIORITIES, NewComplaint as NC } from '../types'
export default function NewComplaintPage() {
  const { toast } = useApp(); const nav = useNavigate(); const [busy, setBusy] = useState(false)
  const [f, setF] = useState<NC>({ title: '', description: '', category: '', priority: 'Medium', location: '' }), [err, setErr] = useState<Record<string, string>>({})
  const set = (k: keyof NC) => (e: any) => setF({ ...f, [k]: e.target.value })
  const submit = async (ev: FormEvent) => { ev.preventDefault(); const er: Record<string, string> = {}
    if (f.title.trim().length < 5) er.title = 'Give a title of at least 5 characters.'; if (f.description.trim().length < 20) er.description = 'Describe the problem in at least 20 characters.'
    if (!f.category) er.category = 'Choose a category.'; if (!f.location) er.location = 'Choose a location.'; setErr(er); if (Object.keys(er).length) return
    setBusy(true); try { const c = await api.complaints.create(f); toast(`Complaint ${c.id} submitted`); nav(`/app/complaints/${c.id}`) } catch (x: any) { toast(x.message, 'err') } finally { setBusy(false) } }
  return <form onSubmit={submit} noValidate className="card mx-auto max-w-2xl space-y-4 p-6"><h1 className="text-2xl font-bold">New complaint</h1>
    <Field label="Title" error={err.title}><input className="input" value={f.title} onChange={set('title')} placeholder="e.g. Wi-Fi drops every evening" /></Field>
    <Field label="Description" error={err.description}><textarea className="input min-h-28" value={f.description} onChange={set('description')} placeholder="What is happening, and since when?" /></Field>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Category" error={err.category}><select className="input" value={f.category} onChange={set('category')}><option value="">Select…</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
      <Field label="Campus location" error={err.location}><select className="input" value={f.location} onChange={set('location')}><option value="">Select…</option>{LOCATIONS.map(c => <option key={c}>{c}</option>)}</select></Field></div>
    <fieldset><legend className="mb-1 text-sm font-medium">Priority</legend><div className="flex flex-wrap gap-2">{PRIORITIES.map(p => <label key={p} className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm has-[:focus-visible]:outline ${f.priority === p ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'border-slate-300 dark:border-slate-700'}`}><input type="radio" className="sr-only" name="p" checked={f.priority === p} onChange={() => setF({ ...f, priority: p })} />{p}</label>)}</div></fieldset>
    <div className="flex justify-end gap-2"><button type="button" className="btn-outline" onClick={() => nav(-1)}>Cancel</button><button className="btn-primary" disabled={busy}>{busy ? 'Submitting…' : 'Submit complaint'}</button></div></form>
}
