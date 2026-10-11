import { useEffect, useState } from 'react'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/hello', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })

    return () => controller.abort()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold tracking-tight">Node.js, step by step</h1>
        <p className="mt-2 text-slate-400">
          React and Tailwind in the browser, Node.js on the server.
        </p>

        <div className="mt-6 rounded-lg bg-slate-950 p-4 font-mono text-sm">
          {data && (
            <p className="text-emerald-400">
              {data.message} ({data.node})
            </p>
          )}
          {error && (
            <p className="text-amber-400">
              Couldn&apos;t reach the API ({error}). Is the server running? Start both with{' '}
              <code>npm run dev</code>.
            </p>
          )}
          {!data && !error && <p className="text-slate-500">Asking the server…</p>}
        </div>
      </div>
    </main>
  )
}
