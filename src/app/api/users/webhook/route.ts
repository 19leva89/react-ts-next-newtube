import { Webhook } from 'svix'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/db'
import { users } from '@/db/schema'

export async function POST(req: NextRequest) {
	const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

	if (!SIGNING_SECRET) {
		throw new Error('Error: Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env')
	}

	// Create new Svix instance with secret
	const wh = new Webhook(SIGNING_SECRET)

	// Get headers
	const headerPayload = await headers()
	const svix_id = headerPayload.get('svix-id')
	const svix_timestamp = headerPayload.get('svix-timestamp')
	const svix_signature = headerPayload.get('svix-signature')

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new NextResponse('Error: Missing Svix headers', {
			status: 400,
		})
	}

	// Get body
	const payload = await req.json()
	const body = JSON.stringify(payload)

	let evt: WebhookEvent

	// Verify payload with headers
	try {
		evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature,
		}) as WebhookEvent
	} catch (err) {
		console.error('Error: Could not verify webhook:', err)

		return new NextResponse('Error: Verification error', {
			status: 400,
		})
	}

	// Events with Type Webhook Type Description
	const eventType = evt.type

	if (eventType === 'user.created') {
		const { data } = evt

		await db.insert(users).values({
			clerkId: data.id,
			name: `${data.first_name} ${data.last_name}`,
			imageUrl: data.image_url,
		})
	}

	if (eventType === 'user.deleted') {
		const { data } = evt

		if (!data.id) {
			return new NextResponse('Error: Missing user id', { status: 400 })
		}

		await db.delete(users).where(eq(users.clerkId, data.id))
	}

	if (eventType === 'user.updated') {
		const { data } = evt

		if (!data.id) {
			return new NextResponse('Error: Missing user id', { status: 400 })
		}

		await db
			.update(users)
			.set({
				name: `${data.first_name} ${data.last_name}`,
				imageUrl: data.image_url,
			})
			.where(eq(users.clerkId, data.id))
	}

	return new NextResponse('Webhook received', { status: 200 })
}
