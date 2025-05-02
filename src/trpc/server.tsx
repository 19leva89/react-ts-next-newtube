import 'server-only' // <-- ensure this file cannot be imported from the client

import { cache } from 'react'
import { createHydrationHelpers } from '@trpc/react-query/rsc'

import { appRouter } from '@/trpc/routers/_app'
import { makeQueryClient } from '@/trpc/query-client'
import { createCallerFactory, createTRPCContext } from '@/trpc/init'

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient)
const caller = createCallerFactory(appRouter)(createTRPCContext)
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(caller, getQueryClient)
