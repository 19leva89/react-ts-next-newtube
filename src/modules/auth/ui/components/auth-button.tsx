'use client'

import { ClapperboardIcon, LoaderIcon, UserCircleIcon, UserIcon } from 'lucide-react'
import { ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

import { Button } from '@/components/ui'

export const AuthButton = () => {
	return (
		<>
			<ClerkLoading>
				<div className='flex w-full items-center justify-center'>
					<LoaderIcon className='size-6 animate-spin text-gray-500/80' />
				</div>
			</ClerkLoading>

			<SignedIn>
				<UserButton
					appearance={{
						elements: {
							userButtonAvatarBox: '!size-8',
						},
					}}
				>
					<UserButton.MenuItems>
						<UserButton.Link
							href='/users/current'
							label='My profile'
							labelIcon={<UserIcon className='size-4' />}
						/>

						<UserButton.Link
							href='/studio'
							label='Studio'
							labelIcon={<ClapperboardIcon className='size-4' />}
						/>

						<UserButton.Action label='manageAccount' />
					</UserButton.MenuItems>
				</UserButton>
			</SignedIn>

			<SignedOut>
				<SignInButton mode='modal'>
					<Button
						variant='outline'
						className='rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500'
					>
						<UserCircleIcon className='size-5' />
						Sign in
					</Button>
				</SignInButton>
			</SignedOut>
		</>
	)
}
