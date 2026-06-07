'use client'

import { useActionState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { addWord } from '../actions'
import AdminWordList from '../../components/AdminWordList'

export default function AdminPageClient({ words }: { words: any[] }) {
  const [state, formAction] = useActionState(addWord, { message: '' })
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message === 'success' && formRef.current) {
      formRef.current.reset()
    } else if (state.message === 'duplicate') {
      alert('This word already exists in this chapter. No duplicate was created.');
    }
  }, [state])

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/" className="text-teal-600 dark:text-sky-400 hover:underline font-bold">
          ← Back to Practice
        </Link>
      </div>

      {/* ADD NEW WORD FORM */}
      <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-amber-200 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-4">Add New Word</h2>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <input
            name="language"
            placeholder="Language (e.g., French, Latin)"
            className="border border-amber-300 dark:border-slate-600 p-2 rounded bg-amber-50/50 dark:bg-slate-700/50"
            required
          />
          <input
            name="chapterTitle"
            placeholder="Chapter (e.g., French 1, Latin 1)"
            className="border border-amber-300 dark:border-slate-600 p-2 rounded bg-amber-50/50 dark:bg-slate-700/50"
            required
          />
          <input
            name="foreignWord"
            placeholder="Foreign Word (e.g., Bonjour)"
            className="border border-amber-300 dark:border-slate-600 p-2 rounded bg-amber-50/50 dark:bg-slate-700/50"
            required
          />
          <input
            name="germanMeaning"
            placeholder="German Meaning (e.g., Hallo)"
            className="border border-amber-300 dark:border-slate-600 p-2 rounded bg-amber-50/50 dark:bg-slate-700/50"
            required
          />
          <button type="submit" className="bg-teal-600 text-white p-3 rounded font-bold hover:bg-teal-700 dark:bg-sky-600 dark:hover:bg-sky-700">
            Save Word
          </button>
        </form>
      </div>

      {/* MANAGE WORDS LIST */}
      <AdminWordList words={words} />
    </main>
  )
}