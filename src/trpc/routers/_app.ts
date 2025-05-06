import { createTRPCRouter } from '@/trpc/init'
import { searchRouter } from '@/modules/search/server/procedures'
import { studioRouter } from '@/modules/studio/server/procedures'
import { videosRouter } from '@/modules/videos/server/procedures'
import { commentsRouter } from '@/modules/comments/server/procedures'
import { categoriesRouter } from '@/modules/categories/server/procedures'
import { videoViewsRouter } from '@/modules/video-views/server/procedures'
import { suggestionsRouter } from '@/modules/suggestions/server/procedures'
import { subscriptionsRouter } from '@/modules/subscriptions/server/procedures'
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedures'
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures'
// import { playlistsRouter } from '@/modules/playlists/server/procedures'
// import { usersRouter } from '@/modules/users/server/procedures'

export const appRouter = createTRPCRouter({
	search: searchRouter,
	studio: studioRouter,
	videos: videosRouter,
	comments: commentsRouter,
	categories: categoriesRouter,
	videoViews: videoViewsRouter,
	suggestions: suggestionsRouter,
	subscriptions: subscriptionsRouter,
	videoReactions: videoReactionsRouter,
	commentReactions: commentReactionsRouter,
	// playlists: playlistsRouter,
	// users: usersRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
