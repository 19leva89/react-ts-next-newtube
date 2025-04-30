import 'dotenv/config'
import { Client } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

import { categories } from '@/db/schema'

const categoryNames = [
	'Cars and Vehicles',
	'Comedy',
	'Education',
	'Gaming',
	'Entertainment',
	'Film and Animation',
	'How-to and Style',
	'Music',
	'News and Politics',
	'People and Blogs',
	'Pets and Animals',
	'Science and Technology',
	'Sports',
	'Travel and Events',
]

async function main() {
	console.log('Seeding categories...')

	const client = new Client({
		connectionString: process.env.DATABASE_URL,
	})

	await client.connect()
	const db = drizzle(client)

	try {
		// Delete all existing records
		await db.delete(categories)
		console.log('Existing categories deleted!')

		// Create new records
		const values = categoryNames.map((name) => ({
			name,
			description: `Videos related to ${name.toLowerCase()}`,
		}))

		await db.insert(categories).values(values)

		console.log('Categories seeded successfully!')
	} catch (error) {
		console.error('Error seeding categories:', error)

		process.exit(1)
	} finally {
		await client.end()
	}
}

main()
