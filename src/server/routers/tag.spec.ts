/**
 * Integration test for the `post` router
 */
import { createContextInner } from '../context'
import { AppRouter, appRouter } from './_app'
import { inferProcedureInput } from '@trpc/server'
import { describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'

describe('tag', () => {
  it('should add and get tag', async () => {
    const ctx = await createContextInner({})
    const caller = appRouter.createCaller(ctx)

    const post = await caller.tag.add({
      name: faker.random.words(1)
    })
    const byId = await caller.tag.byId({ id: post.id })
    console.log(byId)

    expect(byId.name).toMatchInlineSnapshot('"Movies"')
  })
})
