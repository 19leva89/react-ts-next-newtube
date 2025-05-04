import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

import { users, videos } from '@/db/schema'
import { reactionTypes } from '@/db/schema/enums'

export const videoReactions = pgTable(
	'video_reactions',
	{
		userId: text('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		videoId: text('video_id')
			.references(() => videos.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		type: reactionTypes('type').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			name: 'video_reactions_pk',
			columns: [t.videoId, t.userId],
		}),
	],
)

export const videoReactionsRelations = relations(videoReactions, ({ one }) => ({
	users: one(users, {
		fields: [videoReactions.userId],
		references: [users.id],
	}),
	videos: one(videos, {
		fields: [videoReactions.videoId],
		references: [videos.id],
	}),
}))

export const videoReactionsInsertSchema = createInsertSchema(videoReactions)
export const videoReactionsSelectSchema = createSelectSchema(videoReactions)
export const videoReactionsUpdateSchema = createUpdateSchema(videoReactions)
