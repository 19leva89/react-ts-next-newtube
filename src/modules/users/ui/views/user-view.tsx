import { UserSection } from '@/modules/users/ui/sections/user-section'
import { VideosSection } from '@/modules/users/ui/sections/videos-section'

interface Props {
	userId: string
}

export const UserView = ({ userId }: Props) => {
	return (
		<div className="flex flex-col gap-y-6 max-w-325 px-4 pt-2.5 mb-10 mx-auto">
			<UserSection userId={userId} />

			<VideosSection userId={userId} />
		</div>
	)
}
