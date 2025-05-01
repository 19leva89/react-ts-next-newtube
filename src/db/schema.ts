import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

import { cuid } from '@/db/helpers'

export const users = pgTable(
	'users',
	{
		id: cuid('id').primaryKey(),
		clerkId: text('clerk_id').unique().notNull(),
		name: varchar({ length: 255 }).notNull(),
		// TODO: add banner fields
		imageUrl: text('image_url').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [uniqueIndex('clerk_id_idx').on(t.clerkId)],
)

export const userRelations = relations(users, ({ many }) => ({
	videos: many(videos),
}))

export const categories = pgTable(
	'categories',
	{
		id: cuid('id').primaryKey(),
		name: varchar({ length: 255 }).notNull().unique(),
		description: text('description'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [uniqueIndex('name_idx').on(t.name)],
)

export const categoryRelations = relations(categories, ({ many }) => ({
	videos: many(videos),
}))

export const videoVisibility = pgEnum('video_visibility', ['public', 'private'])

export const videos = pgTable('videos', {
	id: cuid('id').primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	description: text('description'),
	thumbnailUrl: text('thumbnail_url'),
	thumbnailKey: text('thumbnail_key'),
	previewUrl: text('preview_url'),
	previewKey: text('preview_key'),
	duration: integer('duration'),
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

export const videosInsertSchema = createInsertSchema(videos)
export const videosSelectSchema = createSelectSchema(videos)
export const videosUpdateSchema = createUpdateSchema(videos)

export const videoRelations = relations(videos, ({ one, many }) => ({
	user: one(users, {
		fields: [videos.userId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [videos.categoryId],
		references: [categories.id],
	}),
	// views: many(videoViews),
	// reactions: many(videoReactions),
	// comments: many(comments),
	// playlistVideos: many(playlistVideos),
}))
