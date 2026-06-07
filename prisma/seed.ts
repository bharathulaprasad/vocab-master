import prisma from '../lib/prisma';

// Define word data with German translations
const frenchWords = {
  'Soleil': 'Sonne',
  'Livre': 'Buch',
  'Chien': 'Hund',
  'Fleur': 'Blume',
  'Maison': 'Haus',
  'Voiture': 'Auto',
  'Arbre': 'Baum',
  'Plume': 'Feder',
  'Fenêtre': 'Fenster',
  'Étoile': 'Stern',
};

const latinWords = {
  'Ignis': 'Feuer',
  'Tempus': 'Zeit',
  'Aqua': 'Wasser',
  'Terra': 'Erde',
  'Pax': 'Frieden',
  'Lux': 'Licht',
  'Vita': 'Leben',
  'Lupus': 'Wolf',
  'Caelum': 'Himmel',
  'Ars': 'Kunst',
};

async function main() {
  console.log('⏳ Starting database seed...');

  // 1. Upsert Chapters (create if not exist)
  const frenchChapter = await prisma.chapter.upsert({
    where: { title_language: { title: 'French - Chapter 1', language: 'French' } },
    update: {},
    create: { title: 'French - Chapter 1', language: 'French' },
  });
  console.log(`✅ Created chapter: ${frenchChapter.title}`);

  const latinChapter = await prisma.chapter.upsert({
    where: { title_language: { title: 'Latin - Chapter 1', language: 'Latin' } },
    update: {},
    create: { title: 'Latin - Chapter 1', language: 'Latin' },
  });
  console.log(`✅ Ensured chapter exists: ${latinChapter.title}`);

  // 2. Upsert Words and associate them with Chapters
  const seedWords = async (words: Record<string, string>, chapterId: string) => {
    for (const [foreignWord, germanMeaning] of Object.entries(words)) {
      const existingWord = await prisma.word.findFirst({
        where: { foreignWord, chapterId },
      });

      if (existingWord) {
        await prisma.word.update({
          where: { id: existingWord.id },
          data: { germanMeaning },
        });
      } else {
        await prisma.word.create({
          data: { foreignWord, germanMeaning, chapterId },
        });
      }
    }
  };

  await seedWords(frenchWords, frenchChapter.id);
  console.log(`✅ Seeded/updated ${Object.keys(frenchWords).length} French words.`);

  await seedWords(latinWords, latinChapter.id);
  console.log(`✅ Seeded/updated ${Object.keys(latinWords).length} Latin words.`);

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });