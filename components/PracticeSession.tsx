'use client'
import { useState } from 'react'
import { updateWordProgress } from '../app/actions'

export default function PracticeSession({ words }: { words: any[] }) {
  const [queue, setQueue] = useState(words);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'wrong' | 'correct' | null>(null);

  if (queue.length === 0) return <h2 className="text-2xl font-bold">You're all done for today! 🎉</h2>;

  const currentWord = queue[0];

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === currentWord.germanMeaning.trim().toLowerCase()) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  };

  const handleNext = async (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'WRONG') => {
    // Save to database in the background
    await updateWordProgress(currentWord.id, difficulty);

    if (difficulty === 'WRONG') {
      // Loop it: Move to the back of the queue
      setQueue(prev => [...prev.slice(1), currentWord]);
    } else {
      // Correct: Remove from queue entirely
      setQueue(prev => prev.slice(1));
    }
    
    setFeedback(null);
    setInput('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-amber-200 dark:border-slate-700">
      <p className="text-slate-500 dark:text-slate-400 mb-4">{queue.length} words left</p>
      <h2 className="text-4xl font-bold text-center mb-6">{currentWord.foreignWord}</h2>

      <form onSubmit={checkAnswer} className="flex flex-col gap-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={feedback !== null}
          autoFocus
          className="border border-amber-300 dark:border-slate-600 p-2 rounded text-center text-xl bg-amber-50/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-teal-500 dark:focus:ring-sky-500 outline-none"
          placeholder="Type German meaning..."
        />
        {feedback === null && <button className="bg-teal-600 hover:bg-teal-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white p-2 rounded font-semibold">Check</button>}
      </form>

      {feedback === 'wrong' && (
        <div className="mt-4 text-center">
          <p className="text-red-500 font-bold text-xl">Wrong!</p>
          <p className="mb-4">Correct: <b>{currentWord.germanMeaning}</b></p>
          <button onClick={() => handleNext('WRONG')} className="bg-amber-200 hover:bg-amber-300 dark:bg-slate-700 dark:hover:bg-slate-600 p-2 w-full rounded font-semibold">
            Continue (Will repeat later)
          </button>
        </div>
      )}

      {feedback === 'correct' && (
        <div className="mt-4 text-center flex flex-col gap-2">
          <p className="text-green-600 font-bold text-xl">Correct!</p>
          <p>How hard was it?</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => handleNext('EASY')} className="bg-green-500 text-white px-4 py-2 rounded">Easy</button>
            <button onClick={() => handleNext('MEDIUM')} className="bg-yellow-500 text-white px-4 py-2 rounded">Medium</button>
            <button onClick={() => handleNext('HARD')} className="bg-red-500 text-white px-4 py-2 rounded">Hard</button>
          </div>
        </div>
      )}
    </div>
  )
}