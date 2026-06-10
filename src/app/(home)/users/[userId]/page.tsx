import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { UserView } from '@/modules/users/ui/views/user-view'

interface Props {
	params: Promise<{
		userId: string
	}>
}

const UsersIdPage = async ({ params }: Props) => {
	const queryClient = getQueryClient()

	const { userId } = await params

	void queryClient.prefetchQuery(trpc.users.getOne.queryOptions({ id: userId }))

	void queryClient.prefetchInfiniteQuery(
		trpc.videos.getMany.infiniteQueryOptions(
			{
				userId,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <UserView userId={userId} />
}

export default UsersIdPage
