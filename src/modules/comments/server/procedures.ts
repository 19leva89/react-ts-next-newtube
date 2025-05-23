import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { eq, and, getTableColumns, desc, or, lt, count, inArray, isNull, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { comments, commentsReactions, users } from '@/db/schema'
import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const commentsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				videoId: z.string().cuid2(),
				parentId: z.string().cuid2().nullish(),
				value: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user
			const { videoId, value, parentId } = input

			const [existingComment] = await db
				.select()
				.from(comments)
				.where(inArray(comments.id, parentId ? [parentId] : []))

			if (!existingComment && parentId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}

			if (existingComment?.parentId && parentId) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
				})
			}

			const [newComment] = await db
				.insert(comments)
				.values({
					userId,
					videoId,
					parentId,
					value,
				})
				.returning()

			return newComment
		}),

	getMany: baseProcedure
		.input(
			z.object({
				videoId: z.string().cuid2(),
				parentId: z.string().cuid2().nullish(),
				cursor: z
					.object({
						id: z.string().cuid2(),
						updatedAt: z.date(),
					})
					.nullish(),
				limit: z.number().min(1).max(100),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { clerkUserId } = ctx
			const { videoId, parentId, cursor, limit } = input

			let userId

			const [user] = await db
				.select()
				.from(users)
				.where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

			if (user) {
				userId = user.id
			}

			const viewerReactions = db.$with('viewer_reactions').as(
				db
					.select({
						commentId: commentsReactions.commentId,
						type: commentsReactions.type,
					})
					.from(commentsReactions)
					.where(inArray(commentsReactions.userId, userId ? [userId] : [])),
			)

			const replies = db.$with('replies').as(
				db
					.select({
						parentId: comments.parentId,
						count: count(comments.id).as('count'),
					})
					.from(comments)
					.where(isNotNull(comments.parentId))
					.groupBy(comments.parentId),
			)

			const [data, totalData] = await Promise.all([
				db
					.with(viewerReactions, replies)
					.select({
						...getTableColumns(comments),
						user: users,
						viewerReactions: viewerReactions.type,
						replyCount: replies.count,
						likeCount: db.$count(
							commentsReactions,
							and(eq(commentsReactions.type, 'like'), eq(commentsReactions.commentId, comments.id)),
						),
						dislikeCount: db.$count(
							commentsReactions,
							and(eq(commentsReactions.type, 'dislike'), eq(commentsReactions.commentId, comments.id)),
						),
					})
					.from(comments)
					.where(
						and(
							eq(comments.videoId, videoId),
							parentId ? eq(comments.parentId, parentId) : isNull(comments.parentId),
							cursor
								? or(
										lt(comments.updatedAt, cursor.updatedAt),
										and(eq(comments.updatedAt, cursor.updatedAt), lt(comments.id, cursor.id)),
									)
								: undefined,
						),
					)
					.innerJoin(users, eq(comments.userId, users.id))
					.leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
					.leftJoin(replies, eq(comments.id, replies.parentId))
					.orderBy(desc(comments.updatedAt), desc(comments.id))
					// Add 1 to the limit to check if there is more data
					.limit(limit + 1),
				db
					.select({
						total: count(),
					})
					.from(comments)
					.where(eq(comments.videoId, videoId)),
			])

			const hasMore = data.length > limit

			// Remove the last item if there is more data
			const items = hasMore ? data.slice(0, -1) : data

			// Set the next cursor to the last item if there is more data
			const lastItem = items[items.length - 1]
			const nextCursor = hasMore ? { id: lastItem.id, updatedAt: lastItem.updatedAt } : null

			return { items, nextCursor, totalCount: totalData[0].total }
		}),

	remove: protectedProcedure
		.input(
			z.object({
				id: z.string().cuid2(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = input
			const { id: userId } = ctx.user

			const [deletedComment] = await db
				.delete(comments)
				.where(and(eq(comments.id, id), eq(comments.userId, userId)))
				.returning()

			if (!deletedComment) {
				throw new TRPCError({
					code: 'NOT_FOUND',
				})
			}

			return deletedComment
		}),
})
