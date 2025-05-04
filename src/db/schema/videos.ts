import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

import { cuid } from '@/db/helpers'
import { videoVisibility } from '@/db/schema/enums'
import { categories, comments, playlistVideos, users, videoReactions, videoViews } from '@/db/schema'

export const videos = pgTable('videos', {
	id: cuid('id').primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	description: text('description'),
	thumbnailUrl: text('thumbnail_url'),
	thumbnailKey: text('thumbnail_key'),
	previewUrl: text('preview_url'),
	previewKey: text('preview_key'),
	duration: integer('duration').default(0).notNull(),
	visibility: videoVisibility('visibility').default('private').notNull(),

	muxStatus: text('mux_status'),
	muxAssetId: text('mux_asset_id').unique(),
	muxUploadId: text('mux_upload_id').unique(),
	muxPlaybackId: text('mux_playback_id').unique(),
	muxTrackId: text('mux_track_id').unique(),
	muxTrackStatus: text('mux_track_status'),

	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),

	categoryId: text('category_id').references(() => categories.id, {
		onDelete: 'set null',
	}),

	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const videoRelations = relations(videos, ({ one, many }) => ({
	users: one(users, {
		fields: [videos.userId],
		references: [users.id],
	}),
	categories: one(categories, {
		fields: [videos.categoryId],
		references: [categories.id],
	}),
	views: many(videoViews),
	reactions: many(videoReactions),
	comments: many(comments),
	playlistVideos: many(playlistVideos),
}))

export const videoInsertSchema = createInsertSchema(videos)
export const videoSelectSchema = createSelectSchema(videos)
export const videoUpdateSchema = createUpdateSchema(videos)
