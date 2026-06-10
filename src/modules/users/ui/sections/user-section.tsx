'use client'

import { Suspense } from 'react'
import { useTRPC } from '@/trpc/client'
import { ErrorBoundary } from 'react-error-boundary'
import { useSuspenseQuery } from '@tanstack/react-query'

import { Separator } from '@/components/ui'
import { UserPageInfo, UserPageInfoSkeleton } from '@/modules/users/ui/components/user-page-info'
import { UserPageBanner, UserPageBannerSkeleton } from '@/modules/users/ui/components/user-page-banner'

interface Props {
	userId: string
}

export const UserSection = (props: Props) => {
	return (
		<Suspense fallback={<UserSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<UserSectionSuspense {...props} />
			</ErrorBoundary>
		</Suspense>
	)
}

const UserSectionSkeleton = () => {
	return (
		<div className='flex flex-col'>
			<UserPageBannerSkeleton />

			<UserPageInfoSkeleton />

			<Separator />
		</div>
	)
}

const UserSectionSuspense = ({ userId }: Props) => {
	const trpc = useTRPC()

	const { data: user } = useSuspenseQuery(trpc.users.getOne.queryOptions({ id: userId }))

	return (
		<div className='flex flex-col'>
			<UserPageBanner user={user} />

			<UserPageInfo user={user} />

			<Separator />
		</div>
	)
}
