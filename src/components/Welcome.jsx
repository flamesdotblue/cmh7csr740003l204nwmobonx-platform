import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Search } from 'lucide-react'

export default function Welcome({ t, languageOptions, defaultLang, onStart }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(defaultLang)
  const listRef = useRef(null)

  const common = useMemo(
    () => ['en', 'es', 'fr', 'ar', 'hi', 'zh', 'pt', 'ru'].filter((c) => languageOptions.some((l) => l.code === c)),
    [languageOptions],
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return languageOptions
    return languageOptions.filter((l) =>
      [l.name, l.native, l.code].some((s) => s.toLowerCase().includes(q)),
    )
  }, [query, languageOptions])

  useEffect(() => {
    const region = document.getElementById('language-aria')
    if (region && selected) {
      region.textContent = `${selected} selected`
    }
  }, [selected])

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex flex-col items-center">
        <div
          role="img"
          aria-label="Calming decorative aura"
          className="mb-4 h-48 w-48 rounded-full bg-gradient-to-br from-blue-100 via-emerald-100 to-white shadow-inner"
        />
        <p className="text-center text-base text-slate-700">{t.welcome}</p>
      </div>

      <div className="mb-3">
        <label htmlFor="language-search" className="mb-1 block text-sm font-medium text-slate-800">
          {t.searchLanguage}
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="language-search"
            role="searchbox"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-600"
            placeholder={t.searchLanguage}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
              onClick={() => setQuery('')}
              aria-label="Clear"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2" aria-label="Common languages">
        {common.map((code) => {
          const item = languageOptions.find((l) => l.code === code)
          if (!item) return null
          const active = selected === item.code
          return (
            <button
              key={item.code}
              onClick={() => setSelected(item.code)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                active
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
              aria-pressed={active}
            >
              {active && <Check className="h-4 w-4" />}
              <span>
                {item.native} ({item.name})
              </span>
            </button>
          )
        })}
      </div>

      <div
        ref={listRef}
        role="listbox"
        aria-label="All languages"
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
      >
        {filtered.map((item) => {
          const active = selected === item.code
          return (
            <button
              key={item.code}
              role="option"
              aria-selected={active}
              onClick={() => setSelected(item.code)}
              className={`flex min-h-[44px] items-center justify-between rounded-md border p-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                active
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">
                {item.native} ({item.name})
              </span>
              {active && <Check className="ml-2 h-4 w-4 shrink-0 text-blue-700" />}
            </button>
          )
        })}
      </div>

      <div aria-live="polite" id="language-aria" className="sr-only" />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 mx-auto max-w-screen-md p-4">
        <div className="pointer-events-auto rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-2 text-xs text-slate-600">{t.emergency}</div>
          <button
            disabled={!selected}
            onClick={() => onStart(selected)}
            className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-700 ${
              selected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400'
            }`}
          >
            {t.start}
          </button>
        </div>
      </div>
    </div>
  )
}
