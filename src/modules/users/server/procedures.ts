import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { eq, getTableColumns, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { subscriptions, users, videos } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const usersRouter = createTRPCRouter({
	getOne: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { id: userId } = ctx.user

			const viewerSubscriptions = db
				.$with('viewer_subscriptions')
				.as(db.select().from(subscriptions).where(eq(subscriptions.viewerId, userId)))

			const [existingUser] = await db
				.with(viewerSubscriptions)
				.select({
					...getTableColumns(users),
					subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
					viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
					videoCount: db.$count(videos, eq(videos.userId, users.id)),
				})
				.from(users)
				.leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
				.where(eq(users.id, input.id))

			if (!existingUser) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			return existingUser
		}),
})
