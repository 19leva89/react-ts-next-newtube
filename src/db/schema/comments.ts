import { relations } from 'drizzle-orm'
import { foreignKey, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

import { cuid } from '@/db/helpers'
import { commentsReactions, users, videos } from '@/db/schema'

export const comments = pgTable(
	'comments',
	{
		id: cuid('id').primaryKey(),
		// https://orm.drizzle.team/docs/indexes-constraints#foreign-key
		parentId: text('parent_id'),
		videoId: text('video_id')
			.references(() => videos.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		userId: text('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		value: text('value').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [
		foreignKey({
			columns: [t.parentId],
			foreignColumns: [t.id],
			name: 'comments_parent_id_fk',
		}).onDelete('cascade'),
	],
)

export const commentRelations = relations(comments, ({ one, many }) => ({
	users: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
	videos: one(videos, {
		fields: [comments.videoId],
		references: [videos.id],
	}),
	parentId: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
		relationName: 'comments_thread',
	}),
	reactions: many(commentsReactions),
	replies: many(comments, {
		relationName: 'comments_thread',
	}),
}))

export const commentsInsertSchema = createInsertSchema(comments)
export const commentsSelectSchema = createSelectSchema(comments)
export const commentsUpdateSchema = createUpdateSchema(comments)
