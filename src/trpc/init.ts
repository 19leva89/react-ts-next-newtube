import { cache } from 'react'
import { eq } from 'drizzle-orm'
import superjson from 'superjson'
import { auth } from '@clerk/nextjs/server'
import { initTRPC, TRPCError } from '@trpc/server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { ratelimit } from '@/lib/ratelimit'

/**
 * Creates TRPC context with user session data
 * @returns Promise containing user ID from session
 */
export const createTRPCContext = cache(async () => {
	const { userId } = await auth()

	return { clerkUserId: userId }
})

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

// Avoid exporting the entire t-object since it's not very descriptive.
// For instance, the use of a t variable is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,

	/**
	 * This function formats errors returned by the TRPC server
	 * @param opts - The options object
	 * @param opts.shape - The shape of the error
	 * @param opts.error - The error object
	 * @returns The formatted error object
	 * @see https://trpc.io/docs/server/data-transformers
	 */
	errorFormatter: ({ shape, error }) => ({
		...shape,
		data: {
			...shape.data,
			zodError: error.cause?.message,
		},
	}),
})

// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory

export const baseProcedure = t.procedure

/**
 * Protected procedure that requires user authentication
 */
export const protectedProcedure = baseProcedure.use(async function isAuthed({ ctx, next }) {
	if (!ctx.clerkUserId) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'USER' })
	}

	// Get user data from the database
	const [user] = await db.select().from(users).where(eq(users.clerkId, ctx.clerkUserId)).limit(1)

	if (!user) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'USER' })
	}

	// Check if the user has exceeded the request limit
	const { success } = await ratelimit.limit(user.id)
	if (!success) {
		throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'FALLBACK' })
	}

	return next({
		ctx: {
			...ctx,
			user,
		},
	})
})
