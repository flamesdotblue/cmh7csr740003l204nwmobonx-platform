import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Chat from './components/Chat'
import LanguageSwitcherModal from './components/LanguageSwitcherModal'

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português', dir: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', native: '中文', dir: 'ltr' },
]

const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur'])

const STRINGS = {
  en: {
    title: 'Health Chat',
    welcome: 'Welcome. Choose your language to begin.',
    searchLanguage: 'Search your language',
    start: 'Start',
    emergency: 'If this is an emergency, call local emergency services.',
    placeholder: 'Describe your symptoms…',
    send: 'Send',
    assistantName: 'AI Health Assistant',
    disclaimer: 'I can help you understand symptoms, but this is not a medical diagnosis.',
    help: 'Help & Info',
    language: 'Language',
    startOver: 'Start over',
    confirmStartOver: 'This will clear your conversation. Continue?',
    cancel: 'Cancel',
    apply: 'Apply',
  },
  es: {
    title: 'Chat de Salud',
    welcome: 'Bienvenido. Elige tu idioma para comenzar.',
    searchLanguage: 'Busca tu idioma',
    start: 'Comenzar',
    emergency: 'Si es una emergencia, llama a los servicios de emergencia.',
    placeholder: 'Describe tus síntomas…',
    send: 'Enviar',
    assistantName: 'Asistente de Salud IA',
    disclaimer: 'Puedo ayudar a entender síntomas, pero no es un diagnóstico médico.',
    help: 'Ayuda e Información',
    language: 'Idioma',
    startOver: 'Reiniciar',
    confirmStartOver: 'Esto borrará tu conversación. ¿Continuar?',
    cancel: 'Cancelar',
    apply: 'Aplicar',
  },
  fr: {
    title: 'Chat Santé',
    welcome: 'Bienvenue. Choisissez votre langue pour commencer.',
    searchLanguage: 'Recherchez votre langue',
    start: 'Commencer',
    emergency: 'En cas d’urgence, appelez les services d’urgence.',
    placeholder: 'Décrivez vos symptômes…',
    send: 'Envoyer',
    assistantName: 'Assistant Santé IA',
    disclaimer: "Je peux vous aider à comprendre les symptômes, mais ce n’est pas un diagnostic.",
    help: 'Aide et infos',
    language: 'Langue',
    startOver: 'Recommencer',
    confirmStartOver: 'Cela effacera votre conversation. Continuer ?',
    cancel: 'Annuler',
    apply: 'Appliquer',
  },
  ar: {
    title: 'دردشة صحية',
    welcome: 'مرحبًا. اختر لغتك للبدء.',
    searchLanguage: 'ابحث عن لغتك',
    start: 'ابدأ',
    emergency: 'في حالة الطوارئ، اتصل بخدمات الطوارئ المحلية.',
    placeholder: 'صِف أعراضك…',
    send: 'إرسال',
    assistantName: 'مساعد صحي بالذكاء الاصطناعي',
    disclaimer: 'أساعدك على فهم الأعراض، لكن هذا ليس تشخيصًا طبيًا.',
    help: 'مساعدة ومعلومات',
    language: 'اللغة',
    startOver: 'ابدأ من جديد',
    confirmStartOver: 'سيتم مسح المحادثة. هل تريد المتابعة؟',
    cancel: 'إلغاء',
    apply: 'تطبيق',
  },
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')
  const [showLangModal, setShowLangModal] = useState(false)
  const [started, setStarted] = useState(() => localStorage.getItem('started') === 'true')
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('messages')
    return saved ? JSON.parse(saved) : []
  })

  const t = useMemo(() => STRINGS[lang] || STRINGS.en, [lang])
  const dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr'
  const mounted = useRef(false)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  useEffect(() => {
    if (mounted.current) {
      localStorage.setItem('messages', JSON.stringify(messages))
    } else {
      mounted.current = true
    }
  }, [messages])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem('started', String(started))
  }, [started])

  const handleStart = (selectedLang) => {
    if (selectedLang && selectedLang !== lang) setLang(selectedLang)
    setStarted(true)
    // Seed first assistant message
    setMessages((prev) =>
      prev.length === 0
        ? [
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: `${(STRINGS[selectedLang || lang] || t).disclaimer}`,
              ts: Date.now(),
            },
          ]
        : prev,
    )
  }

  const handleSend = async (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      ts: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg, { id: 'typing', role: 'typing', content: '', ts: Date.now() }])

    // Simulate assistant response
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== 'typing'))
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            `${t.assistantName}: ` +
            'Thank you for sharing. I can help you review common causes and suggest next steps. Would you like to add more details such as duration, severity, or medications?',
          ts: Date.now(),
        },
      ])
    }, 900)
  }

  const handleStartOver = () => {
    if (confirm(t.confirmStartOver)) {
      setMessages([])
      setStarted(false)
    }
  }

  const currentLangOption = LANGUAGE_OPTIONS.find((l) => l.code === lang) || LANGUAGE_OPTIONS[0]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1220]">
      <Header
        title={t.title}
        langLabel={t.language}
        helpLabel={t.help}
        onOpenLanguage={() => setShowLangModal(true)}
        onStartOver={started ? handleStartOver : undefined}
      />

      <main role="main" className="mx-auto max-w-screen-md px-4 pb-24 pt-4 sm:pt-6">
        {!started ? (
          <Welcome
            t={t}
            languageOptions={LANGUAGE_OPTIONS}
            defaultLang={currentLangOption.code}
            onStart={handleStart}
          />
        ) : (
          <Chat t={t} dir={dir} lang={lang} messages={messages} onSend={handleSend} />
        )}
      </main>

      {showLangModal && (
        <LanguageSwitcherModal
          t={t}
          current={lang}
          options={LANGUAGE_OPTIONS}
          onClose={() => setShowLangModal(false)}
          onApply={(code) => {
            setLang(code)
            setShowLangModal(false)
          }}
        />
      )}
    </div>
  )
}
