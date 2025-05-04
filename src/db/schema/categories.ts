import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

import { cuid } from '@/db/helpers'
import { videos } from '@/db/schema'

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
