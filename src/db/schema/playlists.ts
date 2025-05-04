import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

import { cuid } from '@/db/helpers'
import { playlistVideos, users } from '@/db/schema'

export const playlists = pgTable('playlists', {
	id: cuid('id').primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	description: text('description'),
	userId: text('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
	users: one(users, {
		fields: [playlists.userId],
		references: [users.id],
	}),
	playlistVideos: many(playlistVideos),
}))

export const playlistInsertSchema = createInsertSchema(playlists)
export const playlistSelectSchema = createSelectSchema(playlists)
export const playlistUpdateSchema = createUpdateSchema(playlists)
