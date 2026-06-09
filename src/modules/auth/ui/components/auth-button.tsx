'use client'

import { ClerkLoading, SignInButton, UserButton, useAuth } from '@clerk/nextjs'
import { ClapperboardIcon, LoaderIcon, UserCircleIcon, UserIcon } from 'lucide-react'

import { Button } from '@/components/ui'

export const AuthButton = () => {
	const { isSignedIn } = useAuth()

	return (
		<>
			<ClerkLoading>
				<div className='flex w-full items-center justify-center'>
					<LoaderIcon className='size-6 animate-spin text-gray-500/80' />
				</div>
			</ClerkLoading>

			{isSignedIn && (
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
			)}

			{!isSignedIn && (
				<SignInButton mode='modal'>
					<Button
						variant='outline'
						className='rounded-full border-blue-500/20 px-4 py-2 text-sm font-medium text-blue-600 shadow-none hover:text-blue-500'
					>
						<UserCircleIcon className='size-5' />
						Sign in
					</Button>
				</SignInButton>
			)}
		</>
	)
}
