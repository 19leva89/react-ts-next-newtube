import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

import { users, videos } from '@/db/schema'

export const videoViews = pgTable(
	'video_views',
	{
		userId: text('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		videoId: text('video_id')
			.references(() => videos.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			name: 'video_views_pk',
			columns: [t.videoId, t.userId],
		}),
	],
)

export const videoViewsRelations = relations(videoViews, ({ one }) => ({
	users: one(users, {
		fields: [videoViews.userId],
		references: [users.id],
	}),
	videos: one(videos, {
		fields: [videoViews.videoId],
		references: [videos.id],
	}),
}))

export const videoViewInsertSchema = createInsertSchema(videoViews)
export const videoViewSelectSchema = createSelectSchema(videoViews)
export const videoViewUpdateSchema = createUpdateSchema(videoViews)
