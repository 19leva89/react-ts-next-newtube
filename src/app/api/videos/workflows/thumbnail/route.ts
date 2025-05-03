import { and, eq } from 'drizzle-orm'
import { UTApi } from 'uploadthing/server'
import { serve } from '@upstash/workflow/nextjs'

import { db } from '@/db'
import { videos } from '@/db/schema'

interface InputType {
	userId: string
	videoId: string
	prompt: string
}

export const { POST } = serve(async (context) => {
	const utApi = new UTApi()

	const { userId, videoId, prompt } = context.requestPayload as InputType

	// Get video
	const video = await context.run('get-video', async () => {
		const [existingVideo] = await db
			.select()
			.from(videos)
			.where(and(eq(videos.id, videoId), eq(videos.userId, userId)))

		if (!existingVideo) {
			throw new Error('Video not found')
		}

		return existingVideo
	})

	// Generate thumbnail
	const response = await context.call<{ data: { url: string }[] }>('generate-thumbnail', {
		url: 'https://api.openai.com/v1/images/generations',
		method: 'POST',
		body: {
			prompt,
			model: 'dall-e-3',
			n: 1,
			size: '1792x1024',
			quality: 'standard',
			response_format: 'url',
			style: 'natural',
		},
		headers: {
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			'Content-Type': 'application/json',
		},
	})

	const { body } = response

	if (!body?.data || !Array.isArray(body.data) || body.data.length === 0) {
		console.error('Unexpected response from OpenAI:', body)
		throw new Error('No image data in OpenAI response')
	}

	const imageData = body.data[0]

	if (!imageData?.url) {
		console.error('Image data missing URL:', imageData)
		throw new Error('Image URL missing in response')
	}

	// Delete old thumbnail
	await context.run('cleanup-thumbnail', async () => {
		if (video.thumbnailKey) {
			await utApi.deleteFiles(video.thumbnailKey)
			await db
				.update(videos)
				.set({ thumbnailKey: null, thumbnailUrl: null })
				.where(and(eq(videos.id, videoId), eq(videos.userId, userId)))
		}
	})

	// Download new thumbnail
	const uploadedThumbnail = await context.run('upload-thumbnail', async () => {
		const { data, error } = await utApi.uploadFilesFromUrl(imageData.url)

		if (error) {
			console.error('UploadThing error:', error)
			throw new Error(`Failed to upload thumbnail: ${error.message}`)
		}

		return data
	})

	// Update video in DB
	await context.run('update-video', async () => {
		await db
			.update(videos)
			.set({
				thumbnailKey: uploadedThumbnail.key,
				thumbnailUrl: uploadedThumbnail.ufsUrl,
			})
			.where(and(eq(videos.id, videoId), eq(videos.userId, userId)))
	})
})
