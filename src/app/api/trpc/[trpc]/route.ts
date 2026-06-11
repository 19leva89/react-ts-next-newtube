import { NextRequest } from 'next/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter } from '@/trpc/routers/_app'
import { createTRPCContext } from '@/trpc/init'

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: createTRPCContext,

		onError({ error, path }) {
			console.error(`❌ tRPC failed on ${path ?? '<no-path>'}`)
			console.error(error)
		},
	})

export { handler as GET, handler as POST }
