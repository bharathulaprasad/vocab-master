import { getWordsToPractice } from './actions'
import PracticeMenu from '../components/PracticeMenu'
import Link from 'next/link'

export default async function Home() {
  // Fetch all due words exactly once when the page loads
  const words = await getWordsToPractice();

  return (
    <main className="p-10 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Vocab Learner</h1>
        <Link href="/admin" className="text-blue-500 hover:underline font-bold">
          Admin Panel
        </Link>
      </div>
      
      {/* Hand the words over to the new Interactive Menu */}
      <PracticeMenu words={words} />
    </main>
  )
}