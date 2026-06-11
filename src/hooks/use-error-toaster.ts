import { toast } from 'sonner'

type TAppError = {
	data?: {
		code?: string
	} | null
	message?: string
}

type TErrorMap = {
	[code: string]: {
		[key: string]: string
	}
}

const errorMap: TErrorMap = {
	BAD_REQUEST: {
		EMAIL_EXISTS: 'Email is already in use',
		ID: 'ID is required',
		OAUTH_EMAIL: 'Email cannot be changed for OAuth users',
		OAUTH_PASSWORD: 'Password cannot be changed for OAuth users',
		QUANTITY: 'Invalid quantity. Use positive for buy, negative for sell',
		REPLY_TO_REPLY: 'You cannot reply to a reply',
		SUBSCRIBE_TO_YOURSELF: 'You cannot subscribe to yourself',
		UPLOAD_NOT_FOUND: 'Upload not found',
	},

	CONFLICT: {
		PLAYLIST_VIDEO: 'Video already in playlist',
	},

	FORBIDDEN: {
		COINS: 'You have reached the maximum number of free coins. Upgrade to premium to add more coins',
		CREDENTIALS_ACCOUNT: 'This email is already registered with a password. Please use password login',
		OAUTH_ACCOUNT: 'This email is linked to a social login. Please use X or Google',
		TRANSACTIONS:
			'You have reached the maximum number of free transactions. Upgrade to premium to add more transactions',
	},

	INTERNAL_SERVER_ERROR: {
		CREATE_PLAYLIST: 'Failed to create playlist',
		CREATE_PLAYLIST_VIDEO: 'Failed to add video to playlist',
		REMOVE_PLAYLIST_VIDEO: 'Failed to remove video from playlist',
	},

	NOT_FOUND: {
		COMMENT: 'Comment not found',
		EMAIL: 'Email not found',
		MISSING_TOKEN: 'Missing token!',
		PLAYLIST: 'Playlist not found',
		PLAYLIST_VIDEO: 'Playlist video not found',
		TOKEN: 'Token not found!',
		TRANSACTION: 'Transaction not found',
		USER: 'User not found',
		VIDEO: 'Video not found',
	},

	PRECONDITION_FAILED: {
		NOT_ENOUGH_COINS_TO_SELL: 'Not enough coins to sell',
	},

	TOO_MANY_REQUESTS: {
		FALLBACK: 'Too many requests. Please try again later',
	},

	UNAUTHORIZED: {
		EMAIL_NOT_VERIFIED: 'Please verify your email first. We sent you a new verification email!',
		EXPIRED_2FA_CODE: '2FA code expired!',
		EXPIRED_TOKEN: 'Token has expired!',
		INVALID_2FA_CODE: '2FA code invalid!',
		INVALID_CREDENTIALS: 'Invalid email or password',
		INVALID_TOKEN: 'Invalid token!',
		USER: 'Please login to continue',
	},
}

/**
 * Hook for displaying application errors via toast notifications
 * @returns {Object} Object with functions for error handling
 * @returns {Function} returns.toastError - Function to display error in toast
 */
export const useErrorToaster = () => {
	const toastError = (error: TAppError, context?: string) => {
		console.error(`${context || 'App'} error:`, error)

		const errorCode = error.data?.code
		const errorMessage = error.message

		const codeMap = errorCode ? errorMap[errorCode] : undefined

		if (codeMap && errorMessage) {
			for (const key of Object.keys(codeMap)) {
				if (errorMessage.includes(key)) {
					return toast.error(codeMap[key])
				}
			}
		}

		toast.error('An error occurred. Please try again')
	}

	return { toastError }
}
