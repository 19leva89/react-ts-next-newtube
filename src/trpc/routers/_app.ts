import { createTRPCRouter } from '@/trpc/init'
// import { studioRouter } from '@/modules/studio/server/procedures'
// import { videosRouter } from '@/modules/videos/server/procedures'
// import { categoriesRouter } from '@/modules/categories/server/procedures'

export const appRouter = createTRPCRouter({
	// categories: categoriesRouter,
	// studio: studioRouter,
	// videos: videosRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
