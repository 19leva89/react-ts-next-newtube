import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import {
	VideoAssetCreatedWebhookEvent,
	VideoAssetDeletedWebhookEvent,
	VideoAssetErroredWebhookEvent,
	VideoAssetReadyWebhookEvent,
	VideoAssetTrackReadyWebhookEvent,
} from '@mux/mux-node/resources/webhooks'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { mux } from '@/lib/mux'
import { videos } from '@/db/schema'
import { UTApi } from 'uploadthing/server'

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!

type WebhookEvent =
	| VideoAssetCreatedWebhookEvent
	| VideoAssetDeletedWebhookEvent
	| VideoAssetErroredWebhookEvent
	| VideoAssetReadyWebhookEvent
	| VideoAssetTrackReadyWebhookEvent

export const POST = async (req: NextRequest) => {
	if (!SIGNING_SECRET) {
		throw new Error('MUX_WEBHOOK_SECRET is not set')
	}

	const headersPayload = await headers()
	const muxSignature = headersPayload.get('mux-signature')

	if (!muxSignature) {
		return new NextResponse('No signature found', { status: 401 })
	}

	const payload = await req.json()
	const body = JSON.stringify(payload)

	mux.webhooks.verifySignature(
		body,
		{
			'mux-signature': muxSignature,
		},
		SIGNING_SECRET,
	)

	switch (payload.type as WebhookEvent['type']) {
		case 'video.asset.created': {
			const data = payload.data as VideoAssetCreatedWebhookEvent['data']

			if (!data.upload_id) {
				return new NextResponse('No upload ID found', { status: 400 })
			}

			await db
				.update(videos)
				.set({
					muxAssetId: data.id,
					muxStatus: data.status,
				})
				.where(eq(videos.muxUploadId, data.upload_id))

			break
		}

		case 'video.asset.ready': {
			const data = payload.data as VideoAssetReadyWebhookEvent['data']
			const playbackId = data.playback_ids?.[0].id

			if (!data.upload_id) {
				return new NextResponse('Missing upload ID', { status: 400 })
			}

			if (!playbackId) {
				return new NextResponse('Missing playback ID', { status: 400 })
			}

			const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`
			const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`

			const duration = data.duration ? Math.round(data.duration * 1000) : 0

			await db
				.update(videos)
				.set({
					muxStatus: data.status,
					muxPlaybackId: playbackId,
					muxAssetId: data.id,
					thumbnailUrl,
					previewUrl,
					duration,
				})
				.where(eq(videos.muxUploadId, data.upload_id))

			break
		}

		case 'video.asset.errored': {
			const data = payload.data as VideoAssetErroredWebhookEvent['data']

			if (!data.upload_id) {
				return new NextResponse('Missing upload ID', { status: 400 })
			}

			await db
				.update(videos)
				.set({
					muxStatus: data.status,
				})
				.where(eq(videos.muxUploadId, data.upload_id))

			break
		}

		case 'video.asset.deleted': {
			const data = payload.data as VideoAssetDeletedWebhookEvent['data']

			if (!data.upload_id) {
				return new NextResponse('Missing upload ID', { status: 400 })
			}

			// Find video in DB by muxUploadId
			const [existingVideo] = await db.select().from(videos).where(eq(videos.muxUploadId, data.upload_id))

			if (!existingVideo) {
				console.warn(`Video with muxUploadId=${data.upload_id} does not exist`)

				return new NextResponse('Video not found', { status: 200 })
			}

			// Delete thumbnail from UploadThing
			if (existingVideo.thumbnailKey) {
				try {
					const utApi = new UTApi()
					await utApi.deleteFiles(existingVideo.thumbnailKey)

					await db
						.update(videos)
						.set({ thumbnailKey: null, thumbnailUrl: null })
						.where(eq(videos.id, existingVideo.id))
				} catch (err) {
					console.error('Error deleting thumbnail from UploadThing:', err)
					// Continue to delete video, if thumbnail deletion fails
				}
			}

			// Delete video from MUX
			await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id))

			break
		}

		case 'video.asset.track.ready': {
			const data = payload.data as VideoAssetTrackReadyWebhookEvent['data'] & {
				asset_id: string
			}

			const trackId = data.id
			const assetId = data.asset_id
			const status = data.status

			if (!assetId) {
				return new NextResponse('Missing asset ID', { status: 400 })
			}

			await db
				.update(videos)
				.set({
					muxTrackId: trackId,
					muxTrackStatus: status,
				})
				.where(eq(videos.muxAssetId, assetId))

			break
		}
	}

	return new NextResponse('Webhook received', { status: 200 })
}
