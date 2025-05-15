import { config } from 'dotenv'
import ngrok from '@ngrok/ngrok'

config({ path: '.env.local' })

async function startNgrok() {
	const listener = await ngrok.forward({
		addr: 3000,
		authtoken: process.env.NGROK_AUTHTOKEN,
		domain: process.env.NGROK_DOMAIN,
	})

	console.log(`✅ Ngrok tunnel established at: ${listener.url()}`)
}

startNgrok()
process.stdin.resume()
