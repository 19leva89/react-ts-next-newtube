import { config } from 'dotenv'
import ngrok from '@ngrok/ngrok'

config({ path: '.env.local' })

async function startNgrok() {
	const authtoken = process.env.NGROK_AUTHTOKEN
	const domain = process.env.NGROK_DOMAIN

	if (!authtoken) {
		console.error('❌ NGROK_AUTHTOKEN environment variable is required')

		process.exit(1)
	}

	try {
		const listener = await ngrok.forward({
			addr: 3000,

			authtoken,
			domain,
		})

		console.log(`✅ Ngrok tunnel established at: ${listener.url()}`)
	} catch (error) {
		console.error('❌ Failed to establish ngrok tunnel:', error)

		process.exit(1)
	}
}

startNgrok()
process.stdin.resume()
