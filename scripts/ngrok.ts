import { config } from 'dotenv'
import ngrok from '@ngrok/ngrok'

config({ path: '.env' })

async function startNgrok() {
	const listener = await ngrok.forward({
		addr: 3000,
		authtoken: process.env.NGROK_AUTHTOKEN,
		domain: 'notably-just-cheetah.ngrok-free.app',
	})

	console.log(`✅ Ngrok tunnel established at: ${listener.url()}`)
}

startNgrok()
process.stdin.resume()
