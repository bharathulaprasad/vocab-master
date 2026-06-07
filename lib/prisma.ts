// Use the official generated client package
import { PrismaClient } from '../prisma/generated/prisma'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const prismaClientSingleton = () => {
  // Pass the local database file directly into the adapter
  const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
  
  // Wrap the adapter in the Prisma Client
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma