import prisma from '../../lib/prisma'
import AdminPageClient from './AdminPageClient'

export default async function AdminPage() {
  const words = await prisma.word.findMany({
    include: { chapter: true }, // Include chapter title
    orderBy: { foreignWord: 'asc' }, // Sort alphabetically
  })

  return (
    <>
      <AdminPageClient words={words} />
    </>
  )
}