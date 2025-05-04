import { z } from 'zod'
import { eq, and } from 'drizzle-orm'

import { db } from '@/db'
import { videoViews } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const videoViewsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				videoId: z.string().cuid2(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user
			const { videoId } = input

			const [existingVideoView] = await db
				.select()
				.from(videoViews)
				.where(and(eq(videoViews.videoId, videoId), eq(videoViews.userId, userId)))

			if (existingVideoView) {
				return existingVideoView
			}

			const [newVideoView] = await db
				.insert(videoViews)
				.values({
					userId,
					videoId,
				})
				.returning()

			return newVideoView
		}),
})
