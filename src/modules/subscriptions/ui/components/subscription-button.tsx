import { ComponentProps } from 'react'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui'

interface Props {
	disabled: boolean
	isSubscribed: boolean
	onClick: ComponentProps<'button'>['onClick']
	size?: VariantProps<typeof buttonVariants>['size']
	className?: string
}

export const SubscriptionButton = ({ disabled, isSubscribed, onClick, className, size }: Props) => {
	return (
		<Button
			variant={isSubscribed ? 'secondary' : 'default'}
			size={size}
			disabled={disabled}
			onClick={onClick}
			className={cn('rounded-full', className)}
		>
			{isSubscribed ? 'Unsubscribe' : 'Subscribe'}
		</Button>
	)
}
