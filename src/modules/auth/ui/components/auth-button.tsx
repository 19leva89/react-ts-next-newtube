'use client'

import { ClapperboardIcon, LoaderIcon, UserCircleIcon } from 'lucide-react'
import { ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

import { Button } from '@/components/ui'

export const AuthButton = () => {
	// TODO: Add different auth states

	return (
		<>
			<ClerkLoading>
				<div className="flex items-center justify-center w-full">
					<LoaderIcon className="size-5 text-gray-500/80 animate-spin" />
				</div>
			</ClerkLoading>

			<SignedIn>
				<UserButton>
					<UserButton.MenuItems>
						{/* // TODO: Add user profile menu button */}

						<UserButton.Link
							href="/studio"
							label="Studio"
							labelIcon={<ClapperboardIcon className="size-4" />}
						/>

						<UserButton.Action label="manageAccount" />
					</UserButton.MenuItems>
				</UserButton>

				{/* // TODO Add menu items here for studio and User profile */}
			</SignedIn>

			<SignedOut>
				<SignInButton mode="modal">
					<Button
						variant="outline"
						className="px-4 py-2 rounded-full text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 shadow-none"
					>
						<UserCircleIcon className="size-5" />
						Sign in
					</Button>
				</SignInButton>
			</SignedOut>
		</>
	)
}
