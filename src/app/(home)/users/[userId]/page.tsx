import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { UserView } from '@/modules/users/ui/views/user-view'

interface Props {
	params: Promise<{
		userId: string
	}>
}

export const dynamic = 'force-dynamic'

const UsersIdPage = async ({ params }: Props) => {
	const { userId } = await params

	void trpc.users.getOne.prefetch({
		id: userId,
	})

	void trpc.videos.getMany.prefetchInfinite({
		userId,
		limit: DEFAULT_LIMIT,
	})

	return <UserView userId={userId} />
}

export default UsersIdPage
