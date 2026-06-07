'use client'
import { useState } from 'react'
import { deleteWord, updateWord } from '../app/actions'

export default function AdminWordList({ words }: { words: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForeign, setEditForeign] = useState('');
  const [editGerman, setEditGerman] = useState('');

  const startEdit = (word: any) => {
    setEditingId(word.id);
    setEditForeign(word.foreignWord);
    setEditGerman(word.germanMeaning);
  };

  const handleSave = async (id: string) => {
    await updateWord(id, editForeign, editGerman);
    setEditingId(null); // Close edit mode
  };

  return (
    <div className="mt-8 flex flex-col gap-3">
      <h2 className="text-xl font-bold border-b pb-2">Manage Vocabulary</h2>
      
      {words.length === 0 && <p className="text-gray-500">No words added yet.</p>}

      {words.map((word) => (
        <div key={word.id} className="bg-white/80 dark:bg-slate-800/50 p-4 rounded-lg shadow-md flex justify-between items-center border border-amber-200 dark:border-slate-700">
          {/* EDIT MODE */}
          {editingId === word.id ? (
            <div className="flex gap-2 flex-grow mr-4">
              <input 
                value={editForeign} 
                onChange={(e) => setEditForeign(e.target.value)} 
                className="border p-2 rounded w-full bg-amber-50/50 dark:bg-slate-700/50 border-amber-300 dark:border-slate-600"
              />
              <input 
                value={editGerman} 
                onChange={(e) => setEditGerman(e.target.value)} 
                className="border p-2 rounded w-full bg-amber-50/50 dark:bg-slate-700/50 border-amber-300 dark:border-slate-600"
              />
            </div>
          ) : (
            /* VIEW MODE */
            <div>
              <p className="font-bold text-lg">{word.foreignWord}</p>
              <p className="text-slate-600 dark:text-slate-400">
                {word.germanMeaning} 
                <span className="text-xs text-teal-600 dark:text-sky-400 ml-2 font-medium">
                  {/* 👇 HERE IS THE FIX: Added word.chapter?.language */}
                  ({word.chapter?.language} - {word.chapter?.title})
                </span>
              </p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-2">
            {editingId === word.id ? (
              <button onClick={() => handleSave(word.id)} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
            ) : (
              <button onClick={() => startEdit(word)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            )}
            
            <button 
              onClick={() => deleteWord(word.id)} 
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}