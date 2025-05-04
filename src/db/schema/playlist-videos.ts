import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { playlists, videos } from '@/db/schema'

export const playlistVideos = pgTable(
	'playlist_videos',
	{
		playlistId: text('playlist_id')
			.references(() => playlists.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		videoId: text('video_id')
			.references(() => videos.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			name: 'playlist_videos_pk',
			columns: [t.playlistId, t.videoId],
		}),
	],
)

export const playlistVideosRelations = relations(playlistVideos, ({ one }) => ({
	playlists: one(playlists, {
		fields: [playlistVideos.playlistId],
		references: [playlists.id],
	}),
	videos: one(videos, {
		fields: [playlistVideos.videoId],
		references: [videos.id],
	}),
}))
