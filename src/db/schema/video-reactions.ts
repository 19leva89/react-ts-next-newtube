import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

import { users, videos } from '@/db/schema'
import { reactionType } from '@/db/schema/enums'

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
		type: reactionType('type').notNull(),
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
	user: one(users, {
		fields: [videoReactions.userId],
		references: [users.id],
	}),
	video: one(videos, {
		fields: [videoReactions.videoId],
		references: [videos.id],
	}),
}))

export const videoReactionInsertSchema = createInsertSchema(videoReactions)
export const videoReactionSelectSchema = createSelectSchema(videoReactions)
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions)
