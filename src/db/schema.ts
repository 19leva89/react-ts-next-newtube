import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

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

export const videos = pgTable('videos', {
	id: cuid('id').primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	description: text('description'),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	categoryId: text('category_id').references(() => categories.id, {
		onDelete: 'set null',
	}),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const videoRelations = relations(videos, ({ one }) => ({
	user: one(users, {
		fields: [videos.userId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [videos.categoryId],
		references: [categories.id],
	}),
}))
