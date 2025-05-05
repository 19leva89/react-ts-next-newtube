import { z } from 'zod'
import { eq, and } from 'drizzle-orm'

import { db } from '@/db'
import { commentsReactions } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const commentReactionsRouter = createTRPCRouter({
	like: protectedProcedure
		.input(
			z.object({
				commentId: z.string().cuid2(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { commentId } = input
			const { id: userId } = ctx.user

			const [existingCommentReactionLike] = await db
				.select()
				.from(commentsReactions)
				.where(
					and(
						eq(commentsReactions.userId, userId),
						eq(commentsReactions.commentId, commentId),
						eq(commentsReactions.type, 'like'),
					),
				)

			if (existingCommentReactionLike) {
				const [deletedViewerReaction] = await db
					.delete(commentsReactions)
					.where(
						and(
							eq(commentsReactions.userId, userId),
							eq(commentsReactions.commentId, commentId),
							eq(commentsReactions.type, 'like'),
						),
					)
					.returning()

				return deletedViewerReaction
			}

			const [newCommentReaction] = await db
				.insert(commentsReactions)
				.values({
					userId,
					commentId,
					type: 'like',
				})
				.onConflictDoUpdate({
					target: [commentsReactions.userId, commentsReactions.commentId],
					set: {
						type: 'like',
					},
				})
				.returning()

			return newCommentReaction
		}),

	dislike: protectedProcedure
		.input(
			z.object({
				commentId: z.string().cuid2(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { commentId } = input
			const { id: userId } = ctx.user

			const [existingCommentReactionDislike] = await db
				.select()
				.from(commentsReactions)
				.where(
					and(
						eq(commentsReactions.userId, userId),
						eq(commentsReactions.commentId, commentId),
						eq(commentsReactions.type, 'dislike'),
					),
				)

			if (existingCommentReactionDislike) {
				const [deletedViewerReaction] = await db
					.delete(commentsReactions)
					.where(
						and(
							eq(commentsReactions.userId, userId),
							eq(commentsReactions.commentId, commentId),
							eq(commentsReactions.type, 'dislike'),
						),
					)
					.returning()

				return deletedViewerReaction
			}

			const [newCommentReaction] = await db
				.insert(commentsReactions)
				.values({
					userId,
					commentId,
					type: 'dislike',
				})
				.onConflictDoUpdate({
					target: [commentsReactions.userId, commentsReactions.commentId],
					set: {
						type: 'dislike',
					},
				})
				.returning()

			return newCommentReaction
		}),
})
