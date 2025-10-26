import { Globe, HelpCircle, Menu, ShieldCheck } from 'lucide-react'

export default function Header({ title, langLabel, helpLabel, onOpenLanguage, onStartOver }) {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70"
    >
      <div className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500"
          >
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="sr-only">Brand</span>
        </div>
        <div className="text-base font-semibold text-slate-900" aria-live="polite">
          {title}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLanguage}
            className="inline-flex h-10 min-w-[44px] items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
            aria-label={langLabel}
          >
            <Globe className="h-5 w-5" />
          </button>
          <button
            onClick={() => openHelp()}
            className="inline-flex h-10 min-w-[44px] items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
            aria-label={helpLabel}
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <div className="relative">
            <Menu className="h-5 w-5 text-slate-600" aria-hidden />
            <span className="sr-only">Menu</span>
          </div>
        </div>
      </div>
      <HelpSheet />
      {onStartOver ? (
        <div className="mx-auto max-w-screen-md px-4 pb-2">
          <button
            onClick={onStartOver}
            className="mb-2 mt-1 text-left text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900"
          >
            Start over
          </button>
        </div>
      ) : null}
    </header>
  )
}

function openHelp() {
  const el = document.getElementById('help-sheet')
  if (el) el.showModal()
}

function HelpSheet() {
  return (
    <dialog
      id="help-sheet"
      className="w-full max-w-lg rounded-xl border border-slate-200 p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div className="flex items-center gap-2 text-slate-900">
          <HelpCircle className="h-5 w-5" />
          <span className="font-semibold">Help & Info</span>
        </div>
        <form method="dialog">
          <button className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
            Close
          </button>
        </form>
      </div>
      <div className="max-h-[60vh] space-y-4 overflow-auto p-4 text-sm text-slate-700">
        <Section title="About">
          This assistant helps you understand symptoms and navigate care options. It is not a medical diagnosis.
        </Section>
        <Section title="Privacy & Data Use">
          Your messages may be processed to provide responses and improve service. Avoid sharing unnecessary personal information.
        </Section>
        <Section title="Sources">
          Information is compiled from reputable health sources and expert-reviewed guidance where available.
        </Section>
        <Section title="Emergency">
          If you think you are experiencing an emergency, call local emergency services immediately.
        </Section>
      </div>
    </dialog>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-1 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="leading-relaxed">{children}</p>
    </section>
  )
}
