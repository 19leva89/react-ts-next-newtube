'use client'

import { Suspense } from 'react'
import { trpc } from '@/trpc/client'
import { ErrorBoundary } from 'react-error-boundary'

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
		<div className="flex flex-col">
			<UserPageBannerSkeleton />

			<UserPageInfoSkeleton />
		</div>
	)
}

const UserSectionSuspense = ({ userId }: Props) => {
	const [data] = trpc.users.getOne.useSuspenseQuery({
		id: userId,
	})

	return (
		<div className="flex flex-col">
			<UserPageBanner user={data} />

			<UserPageInfo user={data} />

			<Separator />
		</div>
	)
}
