import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Bike,
  Camera,
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  FileCheck,
  Home,
  MessageCircle,
  Package,
  ShieldCheck,
  Star,
  Store,
} from 'lucide-react'

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
}

const faqs = [
  {
    q: 'Do I need to file a Self Assessment?',
    a: 'If your side hustle made over £1,000, HMRC usually wants a return. We check before you pay.',
  },
  {
    q: 'What is the Trading Allowance?',
    a: 'It can cover the first £1,000 of side income. We will tell you if that is you.',
  },
  {
    q: 'How much does it cost?',
    a: 'Fixed fees only. Starter is £49. Side Hustle is £99. Sorted is £149.',
  },
  {
    q: 'When is the HMRC deadline?',
    a: 'Online Self Assessment is due by 31 January. File early and you can stop thinking about it.',
  },
  {
    q: 'Do you cover OnlyFans, Uber, or Etsy?',
    a: 'Yes. If HMRC treats it as self-employment, we can file it. Apps included.',
  },
  {
    q: 'What about Making Tax Digital?',
    a: 'HMRC is rolling it out for more self-employed people. We keep your filing in step.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

function scrollToStart() {
  document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })
}

function Proof({ className = '' }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/70 ${className}`}>
      <span className="inline-flex items-center gap-1 font-medium text-ink">
        <Star className="size-4 fill-highlight text-highlight" aria-hidden="true" />
        Trustpilot 4.9
      </span>
      <span>2,300+ filed</span>
    </p>
  )
}

function CtaButton({ children, className = '' }) {
  return (
    <button
      type="button"
      onClick={scrollToStart}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-highlight px-6 py-3.5 text-base font-semibold text-ink shadow-sm ${className}`}
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </button>
  )
}

const hustlePills = [
  { id: 'vinted', label: 'Vinted/eBay/Depop' },
  { id: 'etsy', label: 'Etsy/Shopify' },
  { id: 'uber', label: 'Uber/Deliveroo/Uber Eats' },
  { id: 'creator', label: 'TikTok/YouTube/OnlyFans' },
  { id: 'airbnb', label: 'Airbnb' },
  { id: 'other', label: 'Other freelance' },
]

const incomeOptions = [
  { id: 'under', label: 'Under £1,000' },
  { id: 'mid', label: '£1,000 - £12,570' },
  { id: 'over', label: 'Over £12,570' },
  { id: 'unsure', label: 'Not sure' },
]

const payeOptions = [
  { id: 'yes', label: 'Yes, employed full/part time' },
  { id: 'no', label: 'No, self-employed / side hustle only' },
]

function quizResult({ income, paye }) {
  if (income === 'under') {
    return {
      tone: 'green',
      icon: CircleCheck,
      title: "You're probably fine! 🎉",
      copy: "Under HMRC's £1,000 trading allowance, you usually don't need to file. BUT if you want to claim expenses or you got a letter from HMRC, you still might want to.",
      cta: 'Double-check for free - chat with us',
    }
  }

  if (income === 'mid' && paye === 'yes') {
    return {
      tone: 'amber',
      icon: CircleAlert,
      title: 'Yes, you likely need to file 😬',
      copy: "Because you're over the £1k trading allowance, HMRC wants a Self Assessment, even though you're PAYE. It's just to declare the side income. We can sort it for £199.",
      note: 'Most people like you choose our £199 Starter',
      cta: 'Get sorted for £199',
    }
  }

  if (income === 'mid' && paye === 'no') {
    return {
      tone: 'amber',
      icon: CircleAlert,
      title: 'Yes, you need to file',
      copy: "You're over £1k but under Personal Allowance. You need to file, but you likely won't owe much tax after expenses. We maximise those.",
      cta: 'See how much you could save',
    }
  }

  return {
    tone: 'red',
    icon: CircleAlert,
    title: "Yes - let's get this filed properly",
    copy: "Over £12,570 you're definitely over both allowances. HMRC already gets data from platforms like eBay/Etsy/Uber since 2024, so best to file. Good news: you can claim loads - mileage, phone, laptop, stock.",
    cta: 'Get my fixed quote - £249',
  }
}

const quizSlide = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
  transition: { duration: 0.25, ease: 'easeOut' },
}

function DoINeedToFileQuiz() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    income: '',
    hustles: [],
    paye: '',
  })

  const result = step === 4 ? quizResult(answers) : null
  const progress = step === 4 ? 100 : ((step - 1) / 3) * 100

  function resetQuiz() {
    setStep(1)
    setAnswers({ income: '', hustles: [], paye: '' })
  }

  function toggleHustle(id) {
    setAnswers((current) => ({
      ...current,
      hustles: current.hustles.includes(id)
        ? current.hustles.filter((item) => item !== id)
        : [...current.hustles, id],
    }))
  }

  const ResultIcon = result?.icon
  const toneClass =
    result?.tone === 'green'
      ? 'bg-brand/10 text-brand'
      : result?.tone === 'red'
        ? 'bg-red-50 text-red-600'
        : 'bg-highlight/30 text-ink'

  return (
    <section id="do-i-need-to-file" className="px-5 pb-16 md:px-8 md:pb-20">
      <motion.div {...fade} className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Do I need to file? Two minutes. Straight answer.
        </h2>
        <p className="mt-3 text-ink/80">No account. No scare tactics. Just your numbers.</p>
      </motion.div>

      <motion.div
        {...fade}
        className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-xl"
      >
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-ink/70">
            {step === 4 ? 'Your result' : `Question ${step} of 3`}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-card">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="q1" {...quizSlide}>
              <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                What did you make from your side hustle in the last tax year (6 April 2024 - 5 April
                2025)?
              </h3>
              <div className="mt-6 grid gap-3">
                {incomeOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setAnswers((current) => ({ ...current, income: option.id }))
                      setStep(2)
                    }}
                    className="rounded-full border border-ink/10 bg-card px-6 py-3.5 text-left font-semibold"
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div key="q2" {...quizSlide}>
              <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                Where does your side income come from? (pick all that apply)
              </h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {hustlePills.map((option) => {
                  const selected = answers.hustles.includes(option.id)
                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleHustle(option.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold ${
                        selected
                          ? 'border-brand bg-brand/10 text-ink'
                          : 'border-ink/10 bg-card text-ink'
                      }`}
                    >
                      {selected ? <Check className="size-4 text-brand" aria-hidden="true" /> : null}
                      {option.label}
                    </motion.button>
                  )
                })}
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                disabled={answers.hustles.length === 0}
                onClick={() => setStep(3)}
                className="mt-6 w-full rounded-full bg-highlight px-6 py-3.5 font-semibold text-ink shadow-sm disabled:opacity-40"
              >
                Continue
              </motion.button>
            </motion.div>
          ) : null}

          {step === 3 ? (
            <motion.div key="q3" {...quizSlide}>
              <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                Did you have another job (PAYE) as well?
              </h3>
              <div className="mt-6 grid gap-3">
                {payeOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setAnswers((current) => ({ ...current, paye: option.id }))
                      setStep(4)
                    }}
                    className="rounded-full border border-ink/10 bg-card px-6 py-3.5 text-left font-semibold"
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : null}

          {result ? (
            <motion.div key="result" {...quizSlide}>
              <div className={`inline-flex rounded-full p-3 ${toneClass}`}>
                <ResultIcon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">{result.title}</h3>
              <p className="mt-4 text-ink/80">{result.copy}</p>
              {result.note ? (
                <p className="mt-3 text-sm font-semibold text-ink">{result.note}</p>
              ) : null}
              <motion.a
                href="#get-started"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToStart()
                }}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-highlight px-6 py-3.5 text-center font-semibold text-ink shadow-sm sm:w-auto"
              >
                {result.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </motion.a>
              <p className="mt-5 text-sm text-ink/70">We filed 2,300+ like this. No HMRC jargon.</p>
              <button
                type="button"
                onClick={resetQuiz}
                className="mt-3 text-sm font-semibold text-brand underline underline-offset-4"
              >
                Retake quiz
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-ink/60">
        This is guidance based on HMRC 24/25 rules, not formal advice. Takes 30 seconds.
      </p>
    </section>
  )
}

function App() {
  const [toast, setToast] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    hustle: 'Etsy / eBay / Vinted',
    notes: '',
  })

  function handleSubmit(event) {
    event.preventDefault()
    console.log('Get Started enquiry', form)
    setToast("Nice one, we'll be in touch in 2 hours")
    setTimeout(() => setToast(''), 5000)
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-base leading-relaxed text-ink antialiased md:text-lg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <a href="#top" className="text-lg font-extrabold tracking-tight">
          Side Hustle Tax Co.
        </a>
        <div className="hidden sm:block">
          <CtaButton>Get Started</CtaButton>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-6 md:grid-cols-2 md:items-center md:px-8 md:pb-20">
          <motion.div {...fade}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand">
              UK Self Assessment, sorted
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl md:leading-tight">
              We will sort your tax return so you can keep selling.
            </h1>
            <p className="mt-5 max-w-xl text-ink/80">
              Not sure if you need to file with HMRC?
            </p>
            <p className="mt-2 max-w-xl text-ink/80">
              We will tell you straight, then do the boring bit.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4">
              <CtaButton>Get Started</CtaButton>
              <Proof />
            </div>
          </motion.div>
          <motion.div {...fade}>
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop"
              alt="Parcels packed on a table, ready to post from a small UK shop"
              width="600"
              height="400"
              className="h-auto w-full rounded-2xl object-cover shadow-sm"
            />
          </motion.div>
        </section>

        <DoINeedToFileQuiz />

        <div className="sticky top-0 z-40 border-y border-ink/5 bg-cream/95">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2.5 md:px-8">
            <p className="hidden font-semibold sm:block">Ready when you are. Fixed fees. No jargon.</p>
            <Proof className="min-w-0 sm:hidden" />
            <CtaButton className="shrink-0">Get Started</CtaButton>
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <motion.div {...fade}>
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
              January should not feel like a second job.
            </h2>
            <p className="mt-4 max-w-2xl text-ink/80">
              Most side hustlers delay because HMRC language is grim. Then the deadline hits.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Clock,
                title: 'You keep putting it off',
                copy: 'The letter sits in your inbox. You tell yourself you will do it Sunday.',
              },
              {
                icon: FileCheck,
                title: 'You are not sure you must file',
                copy: 'Trading Allowance, £1,000, Self Assessment. All mixed up. That is the main fear.',
              },
              {
                icon: MessageCircle,
                title: 'Accountants talk past you',
                copy: 'You want a clear fee and a yes or no. Not a lecture about ledgers.',
              },
            ].map((item) => (
              <motion.article
                key={item.title}
                {...fade}
                className="rounded-2xl bg-card p-6 shadow-sm md:p-8"
              >
                <item.icon className="size-6 text-brand" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-ink/75">{item.copy}</p>
              </motion.article>
            ))}
          </div>
          <div className="mt-10">
            <CtaButton>Get Started</CtaButton>
            <Proof className="mt-3" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-20">
          <motion.div {...fade}>
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
              Built for side hustles HMRC still expects you to report.
            </h2>
            <p className="mt-4 max-w-2xl text-ink/80">
              We are not a traditional accountancy firm.
            </p>
            <p className="mt-2 max-w-2xl text-ink/80">
              We help 20 to 35 year olds who sell, drive, host, or create.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Store, title: 'Etsy, eBay, Vinted', copy: 'Shop income, fees, and postage. We keep the return simple.' },
              { icon: Bike, title: 'Uber and Deliveroo', copy: 'Gig miles and tips belong on a Self Assessment. We will file them.' },
              { icon: Camera, title: 'OnlyFans and TikTok', copy: 'Creator cash is still self-employment. HMRC does not skip platforms.' },
              { icon: Home, title: 'Airbnb hosts', copy: 'Short lets need a clear return. We handle the numbers you already have.' },
              { icon: Package, title: 'Anything you sell', copy: 'If it is a UK side hustle over the Trading Allowance, talk to us.' },
              { icon: ShieldCheck, title: 'Calm, not corporate', copy: 'Plain English. Fixed fees. A human who actually answers.' },
            ].map((item) => (
              <motion.article
                key={item.title}
                {...fade}
                className="rounded-2xl bg-card p-6 shadow-sm md:p-8"
              >
                <item.icon className="size-6 text-brand" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-ink/75">{item.copy}</p>
              </motion.article>
            ))}
          </div>
          <div className="mt-10">
            <CtaButton>Get Started</CtaButton>
            <Proof className="mt-3" />
          </div>
        </section>

        <section className="bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-20">
            <motion.div {...fade}>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Do I need to file? Here is the honest answer.
              </h2>
              <p className="mt-5 text-ink/80">
                If your side hustle made more than £1,000, you likely need a Self Assessment.
              </p>
              <p className="mt-4 text-ink/80">
                Below that, the Trading Allowance may cover you.
              </p>
              <p className="mt-4 text-ink/80">
                We will confirm before you spend a penny.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'You sell stuff online and it is more than a clear-out.',
                  'You drive, deliver, or host paying guests.',
                  'You get paid as a creator, even if it lives in an app.',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <Check className="mt-1 size-5 shrink-0 text-brand" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CtaButton>Get Started</CtaButton>
                <Proof className="mt-3" />
              </div>
            </motion.div>
            <motion.div {...fade}>
              <img
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop"
                alt="Someone working on a laptop at a kitchen table"
                width="600"
                height="400"
                loading="lazy"
                className="h-auto w-full rounded-2xl object-cover shadow-sm"
              />
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <motion.div {...fade}>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Three steps. Then HMRC is off your mind.
            </h2>
          </motion.div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { step: '1', title: 'Tell us what you earn', copy: 'Shop, gig, creator, or lets. A short form is enough to start.' },
              { step: '2', title: 'We check if you must file', copy: 'If the Trading Allowance covers you, we say so. No fake urgency.' },
              { step: '3', title: 'We file. You get on with it', copy: 'Fixed fee. We submit your Self Assessment and send confirmation.' },
            ].map((item) => (
              <motion.li
                key={item.step}
                {...fade}
                className="rounded-2xl bg-card p-6 shadow-sm md:p-8"
              >
                <p className="text-sm font-semibold text-brand">Step {item.step}</p>
                <h3 className="mt-3 text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-ink/75">{item.copy}</p>
              </motion.li>
            ))}
          </ol>
          <div className="mt-10">
            <CtaButton>Get Started</CtaButton>
            <Proof className="mt-3" />
          </div>
        </section>

        <section id="get-started" className="scroll-mt-40 bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-20">
            <motion.div {...fade}>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Clear prices. No hourly meter.
              </h2>
              <p className="mt-4 text-ink/80">
                Pick a fixed fee. That is the whole bill for the return we agree.
              </p>
              <div className="mt-8 grid gap-4">
                {[
                  {
                    name: 'Starter',
                    price: '£49',
                    detail: 'We tell you if you need to file. Credit this if you go ahead.',
                    featured: false,
                  },
                  {
                    name: 'Side Hustle',
                    price: '£99',
                    detail: 'One hustle. Straightforward Self Assessment with HMRC.',
                    featured: true,
                  },
                  {
                    name: 'Sorted',
                    price: '£149',
                    detail: 'Most mixed hustles. Shops, gigs, creators, or a few streams.',
                    featured: false,
                  },
                ].map((plan) => (
                  <article
                    key={plan.name}
                    className={`rounded-2xl p-6 shadow-sm md:p-8 ${plan.featured ? 'bg-highlight/40' : 'bg-cream'}`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                      <p className="text-2xl font-extrabold text-brand">{plan.price}</p>
                    </div>
                    {plan.featured ? (
                      <p className="mt-1 text-sm font-semibold">Most people pick this.</p>
                    ) : null}
                    <p className="mt-2 text-ink/75">{plan.detail}</p>
                  </article>
                ))}
              </div>
              <Proof className="mt-6" />
            </motion.div>

            <motion.div {...fade} className="rounded-2xl bg-cream p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                Get Started. We will reply in two hours.
              </h2>
              <p className="mt-3 text-ink/80">No login. Just tell us how you earn.</p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Name</span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-brand"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Your hustle</span>
                  <select
                    name="hustle"
                    value={form.hustle}
                    onChange={(e) => setForm({ ...form, hustle: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-brand"
                  >
                    <option>Etsy / eBay / Vinted</option>
                    <option>Uber / Deliveroo</option>
                    <option>OnlyFans / TikTok</option>
                    <option>Airbnb</option>
                    <option>A mix / something else</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Anything we should know</span>
                  <textarea
                    name="notes"
                    rows="4"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-brand"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-highlight px-6 py-3.5 font-semibold text-ink shadow-sm"
                >
                  Get Started
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
                <Proof />
              </form>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <motion.div {...fade}>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              People like you, already filed.
            </h2>
            <Proof className="mt-4" />
          </motion.div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                quote: 'I sell on Vinted and panicked about HMRC. They said I did need to file, then just did it.',
                name: 'Maya, Manchester',
              },
              {
                quote: 'Deliveroo evenings plus a day job. Fixed fee. No weird extras. Done before January.',
                name: 'Josh, Leeds',
              },
              {
                quote: 'Creator income is messy. They spoke like a mate and still got the return in.',
                name: 'Priya, London',
              },
            ].map((item) => (
              <motion.blockquote
                key={item.name}
                {...fade}
                className="rounded-2xl bg-card p-6 shadow-sm md:p-8"
              >
                <p className="text-ink/80">{item.quote}</p>
                <footer className="mt-4 text-sm font-semibold">{item.name}</footer>
              </motion.blockquote>
            ))}
          </div>
          <div className="mt-10">
            <CtaButton>Get Started</CtaButton>
            <Proof className="mt-3" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-20">
          <motion.div {...fade}>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Questions people ask before they file.
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-4">
            {faqs.map((item) => (
              <motion.article
                key={item.q}
                {...fade}
                className="rounded-2xl bg-card p-6 shadow-sm md:p-8"
              >
                <h3 className="text-xl font-bold tracking-tight">{item.q}</h3>
                <p className="mt-2 text-ink/75">{item.a}</p>
              </motion.article>
            ))}
          </div>
          <div className="mt-10">
            <CtaButton>Get Started</CtaButton>
            <Proof className="mt-3" />
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-bold">Side Hustle Tax Co.</p>
          <p className="text-sm text-ink/70">
            UK Self Assessment help for side hustles. Not a traditional accountancy firm.
          </p>
          <CtaButton>Get Started</CtaButton>
        </div>
      </footer>

      {toast ? (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 w-[min(90%,24rem)] -translate-x-1/2 rounded-2xl bg-ink px-6 py-4 text-center text-sm font-medium text-cream shadow-sm"
        >
          {toast}
        </div>
      ) : null}
    </div>
  )
}

export default App
