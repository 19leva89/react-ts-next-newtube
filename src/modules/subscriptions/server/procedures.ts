import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { and, desc, eq, getTableColumns, lt, or } from 'drizzle-orm'

import { db } from '@/db'
import { subscriptions, users } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const subscriptionsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				userId: z.string().cuid2(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { user } = ctx
			const { userId } = input

			if (userId === user.id) {
				throw new TRPCError({ code: 'BAD_REQUEST' })
			}

			const [createSubscription] = await db
				.insert(subscriptions)
				.values({
					viewerId: user.id,
					creatorId: userId,
				})
				.returning()

			return createSubscription
		}),

	remove: protectedProcedure
		.input(
			z.object({
				userId: z.string().cuid2(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { user } = ctx
			const { userId } = input

			if (userId === user.id) {
				throw new TRPCError({ code: 'BAD_REQUEST' })
			}

			const [deleteSubscription] = await db
				.delete(subscriptions)
				.where(and(eq(subscriptions.viewerId, user.id), eq(subscriptions.creatorId, userId)))
				.returning()

			return deleteSubscription
		}),

	// getMany: protectedProcedure
	// 	.input(
	// 		z.object({
	// 			cursor: z
	// 				.object({
	// 					userId: z.string().cuid2(),
	// 					updatedAt: z.date(),
	// 				})
	// 				.nullish(),
	// 			limit: z.number().min(1).max(100),
	// 		}),
	// 	)
	// 	.query(async ({ ctx, input }) => {
	// 		const { id: userId } = ctx.user
	// 		const { cursor, limit } = input

	// 		const data = await db
	// 			.select({
	// 				...getTableColumns(subscriptions),
	// 				user: {
	// 					...getTableColumns(users),
	// 					subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
	// 				},
	// 			})
	// 			.from(subscriptions)
	// 			.innerJoin(users, eq(subscriptions.creatorId, users.id))
	// 			.where(
	// 				and(
	// 					eq(subscriptions.viewerId, userId),
	// 					cursor
	// 						? or(
	// 								lt(subscriptions.updatedAt, cursor.updatedAt),
	// 								and(
	// 									eq(subscriptions.updatedAt, cursor.updatedAt),
	// 									lt(subscriptions.creatorId, cursor.creatorId),
	// 								),
	// 							)
	// 						: undefined,
	// 				),
	// 			)
	// 			.orderBy(desc(subscriptions.updatedAt), desc(subscriptions.creatorId))
	// 			// Add 1 to the limit to check if there are more data
	// 			.limit(limit + 1)

	// 		const hasMore = data.length > limit

	// 		// Remove the last item if there is more data
	// 		const items = hasMore ? data.slice(0, -1) : data

	// 		// Set the next cursor to the last item if there is more data
	// 		const lastItem = items[items.length - 1]

	// 		const nextCursor = hasMore
	// 			? {
	// 					creatorId: lastItem.creatorId,
	// 					updatedAt: lastItem.updatedAt,
	// 				}
	// 			: null

	// 		return { items, nextCursor }
	// 	}),
})
