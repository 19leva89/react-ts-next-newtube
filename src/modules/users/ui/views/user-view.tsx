import { UserSection } from '@/modules/users/ui/sections/user-section'
import { VideosSection } from '@/modules/users/ui/sections/videos-section'

interface Props {
	userId: string
}

export const UserView = ({ userId }: Props) => {
	return (
		<div className='mx-auto mb-10 flex max-w-325 flex-col gap-y-6 px-4 pt-2.5'>
			<UserSection userId={userId} />

			<VideosSection userId={userId} />
		</div>
	)
}
