import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'

import {
	comments,
	commentsReactions,
	playlists,
	subscriptions,
	videoReactions,
	videos,
	videoViews,
} from '@/db/schema'
import { cuid } from '@/db/helpers'

export const users = pgTable(
	'users',
	{
		id: cuid('id').primaryKey(),
		clerkId: text('clerk_id').unique().notNull(),
		name: varchar({ length: 255 }).notNull(),
		imageUrl: text('image_url').notNull(),
		bannerUrl: text('banner_url'),
		bannerKey: text('banner_key'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [uniqueIndex('clerk_id_idx').on(t.clerkId)],
)

export const userRelations = relations(users, ({ many }) => ({
	videos: many(videos),
	videoViews: many(videoViews),
	videoReactions: many(videoReactions),
	subscriptions: many(subscriptions, {
		relationName: 'subscriptions_viewer_id_fk',
	}),
	subscribers: many(subscriptions, {
		relationName: 'subscriptions_creator_id_fk',
	}),
	comments: many(comments),
	commentsReactions: many(commentsReactions),
	playlists: many(playlists),
}))
