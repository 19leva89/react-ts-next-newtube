import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from '@/db/schema'

export const subscriptions = pgTable(
	'subscriptions',
	{
		viewerId: text('viewer_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		creatorId: text('creator_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			name: 'subscriptions_pk',
			columns: [t.viewerId, t.creatorId],
		}),
	],
)

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
	viewers: one(users, {
		fields: [subscriptions.viewerId],
		references: [users.id],
		relationName: 'subscriptions_viewer_id_fk',
	}),
	creators: one(users, {
		fields: [subscriptions.creatorId],
		references: [users.id],
		relationName: 'subscriptions_creator_id_fk',
	}),
}))
