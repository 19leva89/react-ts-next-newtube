import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDuration(duration: number) {
	const minutes = Math.floor(duration / 60000)
	const seconds = Math.floor((duration % 60000) / 1000)

	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function snakeCaseToTitle(str: string) {
	return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export function absoluteUrl(path: string): string {
	// If in a browser, return the relative path
	if (typeof window !== 'undefined') {
		return path
	}

	// Remove extra slashes to avoid format errors
	return new URL(path, baseUrl).toString()
}
