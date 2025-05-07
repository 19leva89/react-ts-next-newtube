import { CategoriesSection, HomeVideosSection } from '@/modules/home/ui/sections'

export const dynamic = 'force-dynamic'

interface Props {
	categoryId?: string
}

export const HomeView = ({ categoryId }: Props) => {
	return (
		<div className="flex flex-col gap-y-6 max-w-600 mx-auto mb-10 px-4 pt-2.5">
			<CategoriesSection categoryId={categoryId} />

			<HomeVideosSection categoryId={categoryId} />
		</div>
	)
}
