/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { t } from '../trpc'
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '../prisma'

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultTagSelect = Prisma.validator<Prisma.TagSelect>()({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true
})

export const tagRouter = t.router({
  list: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish()
      })
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50
      const { cursor } = input

      const items = await prisma.tag.findMany({
        select: defaultTagSelect,

        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor
            }
          : undefined,
        orderBy: {
          createdAt: 'desc'
        }
      })
      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!
        nextCursor = nextItem.id
      }

      return {
        items: items.reverse(),
        nextCursor
      }
    }),
  byId: t.procedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input }) => {
      const { id } = input
      const post = await prisma.tag.findUnique({
        where: { id },
        select: defaultTagSelect
      })
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No tag with id '${id}'`
        })
      }
      return post
    }),
  add: t.procedure
    .input(
      z.object({
        name: z.string().min(1).max(32),
      })
    )
    .mutation(async ({ input }) => {
      const tag = await prisma.tag.create({
        data: input,
        select: defaultTagSelect
      })
      return tag
    })
})
