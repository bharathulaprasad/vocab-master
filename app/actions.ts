'use server'
//import { PrismaClient } from '@prisma/client'

import { revalidatePath } from 'next/cache'

//const prisma = new PrismaClient()
import prisma from '../lib/prisma'

// 1. Action to add a new word (Admin)
export async function addWord(prevState: { message: string }, formData: FormData) {
  const language = formData.get('language') as string;  
  const foreignWord = formData.get('foreignWord') as string;
  const germanMeaning = formData.get('germanMeaning') as string;
  const chapterTitle = formData.get('chapterTitle') as string;

  // Find or create the chapter
  let chapter = await prisma.chapter.findFirst({ where: { title: chapterTitle, language } });
  if (!chapter) {
    chapter = await prisma.chapter.create({ data: { title: chapterTitle, language } });
  }

  // 2. CHECK FOR DUPLICATES: Does this word already exist in this chapter?
  const existingWord = await prisma.word.findFirst({
    where: {
      foreignWord: foreignWord,
      chapterId: chapter.id
    }
  });

  // If the word already exists, stop right here and don't save a duplicate!
  if (existingWord) {
    console.log(`Duplicate prevented: ${foreignWord} already exists in ${chapterTitle}`);
    return { message: 'duplicate' }; // Exit the function early
  }
  
  // Create the word
  await prisma.word.create({
    data: { foreignWord, germanMeaning, chapterId: chapter.id }
  });

  revalidatePath('/admin'); // Refresh the admin page to show the new word

  return { message: 'success' };
}

// 2. Action to fetch words due for practice today
export async function getWordsToPractice() {
  return await prisma.word.findMany({
    where: { nextReview: { lte: new Date() } },
    include: { chapter: true }
  });
}

// 3. Action to update word progress
export async function updateWordProgress(wordId: string, difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'WRONG') {
  const now = new Date();
  let nextReview = new Date();
  let incrementWrong = 0;

  if (difficulty === 'EASY') nextReview.setMinutes(now.getMinutes() + 3); // +3 mins
  else if (difficulty === 'MEDIUM') nextReview.setMinutes(now.getMinutes() + 2); // +2 mins
  else if (difficulty === 'HARD') nextReview.setMinutes(now.getMinutes() + 1); // +1 min
  else if (difficulty === 'WRONG') {
    nextReview = now; // Repeat immediately
    incrementWrong = 1;
  }

  await prisma.word.update({
    where: { id: wordId },
    data: { 
      nextReview, 
      difficulty,
      timesWrong: { increment: incrementWrong }
    }
  });
}

// Delete a word
export async function deleteWord(id: string) {
  await prisma.word.delete({
    where: { id }
  });
  revalidatePath('/admin');
}

// Update a word
export async function updateWord(id: string, foreignWord: string, germanMeaning: string) {
  await prisma.word.update({
    where: { id },
    data: { foreignWord, germanMeaning }
  });
  revalidatePath('/admin');
}