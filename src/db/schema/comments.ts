import { relations } from 'drizzle-orm'
import { foreignKey, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

import { cuid } from '@/db/helpers'
import { commentsReactions, users, videos } from '@/db/schema'

export const comments = pgTable(
	'comments',
	{
		id: cuid('id').primaryKey(),
		userId: text('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		videoId: text('video_id')
			.references(() => videos.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		parentId: text('parent_id'),
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
	user: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
	video: one(videos, {
		fields: [comments.videoId],
		references: [videos.id],
	}),
	parent: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
		relationName: 'comments_parent_id_fk',
	}),
	reactions: many(commentsReactions),
	replies: many(comments, {
		relationName: 'comments_parent_id_fk',
	}),
}))

export const commentInsertSchema = createInsertSchema(comments)
export const commentSelectSchema = createSelectSchema(comments)
export const commentUpdateSchema = createUpdateSchema(comments)
