import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { comments, users } from '@/db/schema'
import { reactionTypes } from '@/db/schema/enums'

export const commentsReactions = pgTable(
	'comments_reactions',
	{
		userId: text('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		commentId: text('comment_id')
			.references(() => comments.id, { onDelete: 'cascade' })
			.notNull(),
		type: reactionTypes('type').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			name: 'comments_reactions_pk',
			columns: [t.userId, t.commentId],
		}),
	],
)

export const commentsReactionsRelations = relations(commentsReactions, ({ one }) => ({
	users: one(users, {
		fields: [commentsReactions.userId],
		references: [users.id],
	}),
	comments: one(comments, {
		fields: [commentsReactions.commentId],
		references: [comments.id],
	}),
}))
