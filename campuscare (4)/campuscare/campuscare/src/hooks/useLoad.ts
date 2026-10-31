import { useEffect, useState } from 'react'
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T>(); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [n, setN] = useState(0)
  useEffect(() => { let ok = true; setLoading(true); fn().then(d => ok && (setData(d), setError(''))).catch(e => ok && setError(e.message)).finally(() => ok && setLoading(false)); return () => { ok = false } }, [...deps, n]) // eslint-disable-line
  return { data, loading, error, reload: () => setN(x => x + 1) }
}
