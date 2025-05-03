import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import { UploadThingError, UTApi } from 'uploadthing/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { db } from '@/db'
import { users, videos } from '@/db/schema'

const f = createUploadthing()

export const ourFileRouter = {
	// bannerUploader: f({
	// 	image: {
	// 		maxFileSize: '4MB',
	// 		maxFileCount: 1,
	// 	},
	// })
	// 	.middleware(async () => {
	// 		const session = await auth.api.getSession({
	// 			headers: await headers(),
	// 		})

	// 		const userId = session?.user?.id

	// 		if (!userId) throw new UploadThingError('Unauthorized')

	// 		const [existingUser] = await db.select().from(user).where(eq(user.id, userId))

	// 		if (!existingUser) throw new UploadThingError('Unauthorized')

	// 		if (existingUser.bannerKey) {
	// 			const utApi = new UTApi()

	// 			await utApi.deleteFiles(existingUser.bannerKey)

	// 			await db.update(user).set({ bannerKey: null, bannerUrl: null }).where(eq(user.id, existingUser.id))
	// 		}

	// 		return { user: existingUser }
	// 	})
	// 	.onUploadComplete(async ({ metadata, file }) => {
	// 		await db
	// 			.update(user)
	// 			.set({
	// 				bannerUrl: file.ufsUrl,
	// 				bannerKey: file.key,
	// 			})
	// 			.where(eq(user.id, metadata.user.id))

	// 		return { uploadedBy: metadata.user.id }
	// 	}),

	thumbnailUploader: f({
		image: {
			maxFileSize: '4MB',
			maxFileCount: 1,
		},
	})
		.input(z.object({ videoId: z.string().cuid2() }))
		.middleware(async ({ input }) => {
			const { userId: clerkUserId } = await auth()

			if (!clerkUserId) throw new UploadThingError('Unauthorized')

			const [user] = await db.select().from(users).where(eq(users.clerkId, clerkUserId))

			if (!user) throw new UploadThingError('Unauthorized')

			const [existingVideo] = await db
				.select({ thumbnailKey: videos.thumbnailKey })
				.from(videos)
				.where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)))

			if (!existingVideo) throw new UploadThingError('Video not found')

			if (existingVideo.thumbnailKey) {
				const utApi = new UTApi()

				await utApi.deleteFiles(existingVideo.thumbnailKey)

				await db
					.update(videos)
					.set({ thumbnailKey: null })
					.where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)))
			}

			return { user, ...input }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			await db
				.update(videos)
				.set({
					thumbnailKey: file.key,
					thumbnailUrl: file.ufsUrl,
				})
				.where(and(eq(videos.id, metadata.videoId), eq(videos.userId, metadata.user.id)))

			return { uploadedBy: metadata.user.id }
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
