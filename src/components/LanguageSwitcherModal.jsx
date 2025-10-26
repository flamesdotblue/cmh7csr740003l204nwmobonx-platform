import { useMemo, useState } from 'react'
import { Globe, Search } from 'lucide-react'

export default function LanguageSwitcherModal({ t, current, options, onClose, onApply }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(current)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return options
    return options.filter((l) =>
      [l.name, l.native, l.code].some((s) => s.toLowerCase().includes(q)),
    )
  }, [options, query])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Globe className="h-5 w-5" />
            <span className="font-semibold">{t.language}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {t.cancel}
          </button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder={t.searchLanguage}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="mt-3 grid max-h-72 grid-cols-2 gap-2 overflow-auto sm:grid-cols-3">
            {filtered.map((item) => {
              const active = selected === item.code
              return (
                <button
                  key={item.code}
                  onClick={() => setSelected(item.code)}
                  className={`min-h-[44px] rounded-md border p-2 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    active
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                  aria-pressed={active}
                >
                  {item.native} ({item.name})
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => onApply(selected)}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-700"
            >
              {t.apply}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
