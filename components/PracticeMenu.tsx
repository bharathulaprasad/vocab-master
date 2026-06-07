'use client'
import { useState } from 'react'
import PracticeSession from './PracticeSession'

export default function PracticeMenu({ words }: { words: any[] }) {
  const [started, setStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [selectedChapter, setSelectedChapter] = useState('ALL');

  // If there are no words due at all, show a success message!
  if (words.length === 0) {
    return (
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-green-500 mb-2">You are all caught up! 🎉</h2>
        <p className="text-gray-600 dark:text-gray-300">Come back later for your next reviews.</p>
      </div>
    );
  }

  // Extract unique languages from the due words
  const availableLanguages = Array.from(new Set(words.map(w => w.chapter?.language || 'Unknown')));
  
  // Extract unique chapters based on the selected language
  const availableChapters = Array.from(new Set(
    words
      .filter(w => selectedLanguage === 'ALL' || w.chapter?.language === selectedLanguage)
      .map(w => w.chapter?.title || 'Unknown')
  ));

  // Count how many words will be in the session
  const sessionWords = words.filter(w => {
    const matchLang = selectedLanguage === 'ALL' || w.chapter?.language === selectedLanguage;
    const matchChap = selectedChapter === 'ALL' || w.chapter?.title === selectedChapter;
    return matchLang && matchChap;
  });

  const handleStart = () => {
    // Shuffle the array for "Random" practice before starting!
    for (let i = sessionWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sessionWords[i], sessionWords[j]] = [sessionWords[j], sessionWords[i]];
    }
    setStarted(true);
  };

  // If started, render your existing PracticeSession component!
  if (started) {
    return <PracticeSession words={sessionWords} />;
  }

  // Otherwise, render the Setup Menu
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center">Setup Practice</h2>

      <div className="flex flex-col gap-4 mb-8">
        {/* LANGUAGE SELECTOR */}
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Select Language</label>
          <select 
            className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-700"
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              setSelectedChapter('ALL'); // Reset chapter when language changes
            }}
          >
            <option value="ALL">All Languages</option>
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* CHAPTER SELECTOR */}
        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Select Chapter</label>
          <select 
            className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-700"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            <option value="ALL">Random (All Chapters)</option>
            {availableChapters.map(chap => (
              <option key={chap} value={chap}>{chap}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={handleStart}
        disabled={sessionWords.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-400 transition-colors"
      >
        Start Practice ({sessionWords.length} words due)
      </button>
    </div>
  );
}