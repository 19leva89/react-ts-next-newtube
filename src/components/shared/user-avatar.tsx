import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Avatar, AvatarImage } from '@/components/ui'

const avatarVariants = cva('', {
	variants: {
		size: {
			default: 'size-9',
			xs: 'size-4',
			sm: 'size-6',
			lg: 'size-10',
			xl: 'size-40',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

interface Props extends VariantProps<typeof avatarVariants> {
	name: string
	imageUrl: string
	className?: string
	onClick?: () => void
}

export const UserAvatar = ({ size, name, imageUrl, className, onClick }: Props) => {
	return (
		<Avatar className={cn(avatarVariants({ size, className }))} onClick={onClick}>
			<AvatarImage src={imageUrl} alt={name} />
		</Avatar>
	)
}
