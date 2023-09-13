/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const firstPostId = '5c03994c-fc16-47e0-bd02-d218a370a078'
  await prisma.post.upsert({
    where: {
      id: firstPostId
    },
    create: {
      id: firstPostId,
      title: 'First Post',
      text: 'This is an example post generated from `prisma/seed.ts`',
      tags: ['Social']
    },
    update: {}
  })
  const tagId = '5e5c9a23-8b68-419d-b24e-0a24acad9827'
  await prisma.tag.upsert({
    where: {
      id: tagId
    },
    create: {
      id: tagId,
      name: 'Linkedin',
    },
    update: {}
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
