'use client'
import { ReactNode } from 'react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui'
import { useIsMobile } from '@/hooks/use-mobile'

interface Props {
	title: string
	open: boolean
	children: ReactNode
	onOpenChangeAction: (open: boolean) => void
}

export const ResponsiveModal = ({ title, open, children, onOpenChangeAction }: Props) => {
	const isMobile = useIsMobile()

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={onOpenChangeAction}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{title}</DrawerTitle>

						<DrawerDescription className="hidden" />
					</DrawerHeader>
					{children}
				</DrawerContent>
			</Drawer>
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChangeAction}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>

					<DialogDescription className="hidden" />
				</DialogHeader>

				{children}
			</DialogContent>
		</Dialog>
	)
}
