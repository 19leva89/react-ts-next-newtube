import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { UTApi } from 'uploadthing/server'
import { and, eq, getTableColumns, inArray, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { mux } from '@/lib/mux'
import { workflow } from '@/lib/workflow'
import { users, videos, videosUpdateSchema, videoViews } from '@/db/schema'
import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init'

export const videosRouter = createTRPCRouter({
	getOne: baseProcedure.input(z.object({ id: z.string().cuid2() })).query(async ({ ctx, input }) => {
		// const viewerReactions = db.$with('viewer_reactions').as(
		// 	db
		// 		.select({
		// 			videoId: videoReactions.videoId,
		// 			type: videoReactions.type,
		// 		})
		// 		.from(videoReactions)
		// 		.where(inArray(videoReactions.userId, userId ? [userId] : [])),
		// )

		// const viewerSubscriptions = db.$with('viewer_subscriptions').as(
		// 	db
		// 		.select()
		// 		.from(subscriptions)
		// 		.where(inArray(subscriptions.viewerId, userId ? [userId] : [])),
		// )

		const [video] = await db
			// .with(viewerReactions, viewerSubscriptions)
			.select({
				...getTableColumns(videos),
				user: {
					...getTableColumns(users),
					// subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, user.id)),
					// viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
				},
				viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
				// likeCount: db.$count(
				// 	videoReactions,
				// 	and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'like')),
				// ),
				// dislikeCount: db.$count(
				// 	videoReactions,
				// 	and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'dislike')),
				// ),
				// viewerReaction: viewerReactions.type,
			})
			.from(videos)
			.innerJoin(users, eq(videos.userId, users.id))
			// .leftJoin(viewerReactions, eq(videos.id, viewerReactions.videoId))
			// .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, user.id))
			.where(eq(videos.id, input.id))
		// .groupBy(videos.id, user.id, viewerReactions.type)

		if (!video) {
			throw new TRPCError({ code: 'NOT_FOUND' })
		}

		return video
	}),

	// getMany: baseProcedure
	// 	.input(
	// 		z.object({
	// 			userId: z.string().nullish(),
	// 			categoryId: z.string().cuid2().nullish(),
	// 			cursor: z
	// 				.object({
	// 					id: z.string().cuid2(),
	// 					updatedAt: z.date(),
	// 				})
	// 				.nullish(),
	// 			limit: z.number().min(1).max(100),
	// 		}),
	// 	)
	// 	.query(async ({ input }) => {
	// 		const { cursor, limit, userId, categoryId } = input

	// 		const data = await db
	// 			.select({
	// 				...getTableColumns(videos),
	// 				user: user,
	// 				viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
	// 				likeCount: db.$count(
	// 					videoReactions,
	// 					and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'like')),
	// 				),
	// 				dislikeCount: db.$count(
	// 					videoReactions,
	// 					and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'dislike')),
	// 				),
	// 			})
	// 			.from(videos)
	// 			.innerJoin(user, eq(videos.userId, user.id))
	// 			.where(
	// 				and(
	// 					eq(videos.visibility, 'public'),
	// 					categoryId ? eq(videos.categoryId, categoryId) : undefined,
	// 					userId ? eq(videos.userId, userId) : undefined,
	// 					cursor
	// 						? or(
	// 								lt(videos.updatedAt, cursor.updatedAt),
	// 								and(eq(videos.updatedAt, cursor.updatedAt), lt(videos.id, cursor.id)),
	// 							)
	// 						: undefined,
	// 				),
	// 			)
	// 			.orderBy(desc(videos.updatedAt), desc(videos.id))
	// 			// Add 1 to the limit to check if there are more data
	// 			.limit(limit + 1)

	// 		const hasMore = data.length > limit
	// 		// Remove the last item if there is more data
	// 		const items = hasMore ? data.slice(0, -1) : data
	// 		// Set the next cursor to the last item if there is more data
	// 		const lastItem = items[items.length - 1]
	// 		const nextCursor = hasMore
	// 			? {
	// 					id: lastItem.id,
	// 					updatedAt: lastItem.updatedAt,
	// 				}
	// 			: null

	// 		return { items, nextCursor }
	// 	}),

	// getManyTrending: baseProcedure
	// 	.input(
	// 		z.object({
	// 			cursor: z
	// 				.object({
	// 					id: z.string().cuid2(),
	// 					viewCount: z.number(),
	// 				})
	// 				.nullish(),
	// 			limit: z.number().min(1).max(100),
	// 		}),
	// 	)
	// 	.query(async ({ input }) => {
	// 		const { cursor, limit } = input

	// 		const viewCountSubquery = db.$count(videoViews, eq(videoViews.videoId, videos.id))

	// 		const data = await db
	// 			.select({
	// 				...getTableColumns(videos),
	// 				user: user,
	// 				viewCount: viewCountSubquery,
	// 				likeCount: db.$count(
	// 					videoReactions,
	// 					and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'like')),
	// 				),
	// 				dislikeCount: db.$count(
	// 					videoReactions,
	// 					and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'dislike')),
	// 				),
	// 			})
	// 			.from(videos)
	// 			.innerJoin(user, eq(videos.userId, user.id))
	// 			.where(
	// 				and(
	// 					eq(videos.visibility, 'public'),
	// 					cursor
	// 						? or(
	// 								lt(viewCountSubquery, cursor.viewCount),
	// 								and(eq(viewCountSubquery, cursor.viewCount), lt(videos.id, cursor.id)),
	// 							)
	// 						: undefined,
	// 				),
	// 			)
	// 			.orderBy(desc(viewCountSubquery), desc(videos.id))
	// 			// Add 1 to the limit to check if there are more data
	// 			.limit(limit + 1)

	// 		const hasMore = data.length > limit
	// 		// Remove the last item if there is more data
	// 		const items = hasMore ? data.slice(0, -1) : data
	// 		// Set the next cursor to the last item if there is more data
	// 		const lastItem = items[items.length - 1]
	// 		const nextCursor = hasMore
	// 			? {
	// 					id: lastItem.id,
	// 					viewCount: lastItem.viewCount,
	// 				}
	// 			: null

	// 		return { items, nextCursor }
	// 	}),

	// getManySubscribed: protectedProcedure
	// 	.input(
	// 		z.object({
	// 			cursor: z
	// 				.object({
	// 					id: z.string().cuid2(),
	// 					updatedAt: z.date(),
	// 				})
	// 				.nullish(),
	// 			limit: z.number().min(1).max(100),
	// 		}),
	// 	)
	// 	.query(async ({ input, ctx }) => {
	// 		const { id: userId } = ctx.user
	// 		const { cursor, limit } = input

	// 		const viewerSubscriptions = db.$with('viewer_subscriptions').as(
	// 			db
	// 				.select({
	// 					userId: subscriptions.creatorId,
	// 				})
	// 				.from(subscriptions)
	// 				.where(eq(subscriptions.viewerId, userId)),
	// 		)

	// 		const data = await db
	// 			.with(viewerSubscriptions)
	// 			.select({
	// 				...getTableColumns(videos),
	// 				user: user,
	// 				viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
	// 				likeCount: db.$count(
	// 					videoReactions,
	// 					and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'like')),
	// 				),
	// 				dislikeCount: db.$count(
	// 					videoReactions,
	// 					and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'dislike')),
	// 				),
	// 			})
	// 			.from(videos)
	// 			.innerJoin(user, eq(videos.userId, user.id))
	// 			.innerJoin(viewerSubscriptions, eq(user.id, viewerSubscriptions.userId))
	// 			.where(
	// 				and(
	// 					eq(videos.visibility, 'public'),
	// 					cursor
	// 						? or(
	// 								lt(videos.updatedAt, cursor.updatedAt),
	// 								and(eq(videos.updatedAt, cursor.updatedAt), lt(videos.id, cursor.id)),
	// 							)
	// 						: undefined,
	// 				),
	// 			)
	// 			.orderBy(desc(videos.updatedAt), desc(videos.id))
	// 			// Add 1 to the limit to check if there are more data
	// 			.limit(limit + 1)

	// 		const hasMore = data.length > limit
	// 		// Remove the last item if there is more data
	// 		const items = hasMore ? data.slice(0, -1) : data
	// 		// Set the next cursor to the last item if there is more data
	// 		const lastItem = items[items.length - 1]
	// 		const nextCursor = hasMore
	// 			? {
	// 					id: lastItem.id,
	// 					updatedAt: lastItem.updatedAt,
	// 				}
	// 			: null

	// 		return { items, nextCursor }
	// 	}),

	generateTitle: protectedProcedure
		.input(z.object({ id: z.string().cuid2() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user

			const { workflowRunId } = await workflow.trigger({
				url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
				body: { userId, videoId: input.id },
				retries: 3,
			})

			return { workflowRunId }
		}),

	generateDescription: protectedProcedure
		.input(z.object({ id: z.string().cuid2() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user

			const { workflowRunId } = await workflow.trigger({
				url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
				body: { userId, videoId: input.id },
				retries: 3,
			})

			return { workflowRunId }
		}),

	revalidate: protectedProcedure
		.input(z.object({ id: z.string().cuid2() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user

			const [existingVideo] = await db
				.select()
				.from(videos)
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))

			if (!existingVideo) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			if (!existingVideo.muxUploadId) {
				throw new TRPCError({ code: 'BAD_REQUEST' })
			}

			const directUpload = await mux.video.uploads.retrieve(existingVideo.muxUploadId)

			if (!directUpload || !directUpload.asset_id) {
				throw new TRPCError({ code: 'BAD_REQUEST' })
			}

			const asset = await mux.video.assets.retrieve(directUpload.asset_id)

			if (!asset) {
				throw new TRPCError({ code: 'BAD_REQUEST' })
			}

			const [updatedVideo] = await db
				.update(videos)
				.set({
					muxStatus: asset.status,
					muxPlaybackId: asset.playback_ids?.[0].id,
					muxAssetId: asset.id,
					duration: asset.duration ? Math.round(asset.duration * 1000) : 0,
				})
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
				.returning()

			return updatedVideo
		}),

	generateThumbnail: protectedProcedure
		.input(z.object({ id: z.string().cuid2(), prompt: z.string().min(10) }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user

			const { workflowRunId } = await workflow.trigger({
				url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
				body: { userId, videoId: input.id, prompt: input.prompt },
				retries: 3,
			})

			return { workflowRunId }
		}),

	restoreThumbnail: protectedProcedure
		.input(z.object({ id: z.string().cuid2() }))
		.mutation(async ({ ctx, input }) => {
			const { id } = input
			const { id: userId } = ctx.user

			const [existingVideo] = await db
				.select()
				.from(videos)
				.where(and(eq(videos.id, id), eq(videos.userId, userId)))

			if (!existingVideo) {
				throw new TRPCError({ code: 'NOT_FOUND' })
			}

			if (existingVideo.thumbnailKey) {
				const utApi = new UTApi()

				await utApi.deleteFiles(existingVideo.thumbnailKey)

				await db
					.update(videos)
					.set({ thumbnailKey: null, thumbnailUrl: null })
					.where(and(eq(videos.id, id), eq(videos.userId, userId)))
			}

			if (!existingVideo.muxPlaybackId) {
				throw new TRPCError({ code: 'BAD_REQUEST' })
			}

			const thumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`

			const [updatedVideo] = await db
				.update(videos)
				.set({ thumbnailUrl })
				.where(and(eq(videos.id, id), eq(videos.userId, userId)))
				.returning()

			return updatedVideo
		}),

	create: protectedProcedure.mutation(async ({ ctx }) => {
		const { id: userId } = ctx.user

		const upload = await mux.video.uploads.create({
			new_asset_settings: {
				passthrough: userId,
				playback_policy: ['public'],
				input: [
					{
						generated_subtitles: [
							{
								language_code: 'en',
								name: 'English',
							},
						],
					},
				],
			},
			cors_origin: '*', // TODO: In production set to your domain
		})

		const [video] = await db
			.insert(videos)
			.values({
				title: 'Untitled',
				userId,
				muxStatus: 'waiting',
				muxUploadId: upload.id,
			})
			.returning()

		return { video, ufsUrl: upload.url }
	}),

	update: protectedProcedure.input(videosUpdateSchema).mutation(async ({ ctx, input }) => {
		const { id: userId } = ctx.user

		if (!input.id) {
			throw new TRPCError({ code: 'BAD_REQUEST' })
		}

		const [updatedVideo] = await db
			.update(videos)
			.set({
				title: input.title,
				description: input.description,
				categoryId: input.categoryId,
				visibility: input.visibility,
			})
			.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
			.returning()

		if (!updatedVideo) {
			throw new TRPCError({ code: 'NOT_FOUND' })
		}

		return updatedVideo
	}),

	remove: protectedProcedure.input(z.object({ id: z.string().cuid2() })).mutation(async ({ ctx, input }) => {
		const { id } = input
		const { id: userId } = ctx.user

		const [existingVideo] = await db
			.select()
			.from(videos)
			.where(and(eq(videos.id, id), eq(videos.userId, userId)))

		if (!existingVideo) {
			throw new TRPCError({ code: 'NOT_FOUND' })
		}

		// Delete thumbnail from UploadThing
		if (existingVideo.thumbnailKey) {
			try {
				const utApi = new UTApi()
				await utApi.deleteFiles(existingVideo.thumbnailKey)

				await db
					.update(videos)
					.set({ thumbnailKey: null, thumbnailUrl: null })
					.where(and(eq(videos.id, id), eq(videos.userId, userId)))
			} catch (err) {
				console.error('Error deleting thumbnail from UploadThing:', err)
				// Continue to delete video, if thumbnail deletion fails
			}
		}

		// Delete video from MUX
		if (existingVideo.muxAssetId) {
			try {
				await mux.video.assets.delete(existingVideo.muxAssetId)
			} catch (err) {
				console.error('Error deleting MUX video:', err)
				// Continue to delete video, if MUX deletion fails
			}
		}

		// Delete video from DB
		const [removedVideo] = await db
			.delete(videos)
			.where(and(eq(videos.id, id), eq(videos.userId, userId)))
			.returning()

		if (!removedVideo) {
			throw new TRPCError({ code: 'NOT_FOUND' })
		}

		return removedVideo
	}),
})
