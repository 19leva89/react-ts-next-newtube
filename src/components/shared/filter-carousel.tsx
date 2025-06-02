'use client'

import { useEffect, useState } from 'react'

import {
	Badge,
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	Skeleton,
} from '@/components/ui'
import { cn } from '@/lib/utils'

interface Props {
	value?: string | null
	isLoading?: boolean
	onSelectAction: (value: string | null) => void
	data: {
		value: string
		label: string
	}[]
}

export const FilterCarousel = ({ value, isLoading, onSelectAction, data }: Props) => {
	const [api, setApi] = useState<CarouselApi>()
	const [count, setCount] = useState<number>(0)
	const [current, setCurrent] = useState<number>(0)

	useEffect(() => {
		if (!api) return

		setCount(api.scrollSnapList().length)
		setCurrent(api.selectedScrollSnap() + 1)

		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1)
		})
	}, [api])

	return (
		<div className='relative w-full'>
			{/* Left fade */}
			<div
				className={cn(
					'pointer-events-none absolute top-0 bottom-0 left-12 z-10 w-12 bg-gradient-to-r from-white to-transparent',
					current === 1 && 'hidden',
				)}
			/>

			<Carousel
				setApi={setApi}
				opts={{
					align: 'start',
					dragFree: true,
				}}
				className='w-full px-12'
			>
				<CarouselPrevious className='left-0 z-20' />

				<CarouselContent className='-ml-3'>
					{!isLoading && (
						<CarouselItem onClick={() => onSelectAction(null)} className='basis-auto pl-3'>
							<Badge
								variant={!value ? 'default' : 'secondary'}
								className='cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap'
							>
								All
							</Badge>
						</CarouselItem>
					)}

					{isLoading &&
						Array.from({ length: 14 }).map((_, index) => (
							<CarouselItem key={index} className='basis-auto pl-3'>
								<Skeleton className='h-full w-25 rounded-lg px-3 py-1 text-sm font-semibold' />
							</CarouselItem>
						))}

					{!isLoading &&
						data.map((item) => (
							<CarouselItem
								key={item.value}
								onClick={() => onSelectAction(item.value)}
								className='basis-auto pl-3'
							>
								<Badge
									variant={value === item.value ? 'default' : 'secondary'}
									onClick={() => onSelectAction(item.value)}
									className='cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap'
								>
									{item.label}
								</Badge>
							</CarouselItem>
						))}
				</CarouselContent>

				<CarouselNext className='right-0 z-20' />
			</Carousel>

			{/* Right fade */}
			<div
				className={cn(
					'pointer-events-none absolute top-0 right-12 bottom-0 w-12 bg-gradient-to-l from-white to-transparent',
					current === count && 'hidden',
				)}
			/>
		</div>
	)
}
