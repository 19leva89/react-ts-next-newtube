import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface Props {
	compactViews: string
	expandedViews: string
	compactDate: string
	expandedDate: string
	description?: string | null
}

export const VideoDescription = ({
	description,
	compactViews,
	expandedViews,
	compactDate,
	expandedDate,
}: Props) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false)

	return (
		<div
			onClick={() => setIsExpanded(!isExpanded)}
			className="p-3 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition"
		>
			<div className="flex gap-2 mb-2 text-sm">
				<span className="font-medium">{isExpanded ? expandedViews : compactViews} views</span>

				<span className="font-medium">{isExpanded ? expandedDate : compactDate}</span>
			</div>

			<div className="relative">
				<p className={cn('text-sm whitespace-pre-wrap', !isExpanded && 'line-clamp-2')}>
					{description || 'No description'}
				</p>

				<div className="flex items-center gap-1 mt-4 text-sm font-medium">
					{isExpanded ? (
						<>
							show less <ChevronUpIcon className="size-4" />
						</>
					) : (
						<>
							show more <ChevronDownIcon className="size-4" />
						</>
					)}
				</div>
			</div>
		</div>
	)
}
