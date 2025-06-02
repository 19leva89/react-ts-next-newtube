'use client'

import {
	CopyCheckIcon,
	CopyIcon,
	ImagePlusIcon,
	Loader2Icon,
	LockIcon,
	LockOpenIcon,
	MoreVerticalIcon,
	RotateCcwIcon,
	SparklesIcon,
	TrashIcon,
} from 'lucide-react'
import { z } from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { trpc } from '@/trpc/client'
import { useForm } from 'react-hook-form'
import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Skeleton,
	Textarea,
} from '@/components/ui'
import { videoUpdateSchema } from '@/db/schema'
import { baseUrl, snakeCaseToTitle } from '@/lib/utils'
import { VideoPlayer } from '@/modules/videos/ui/components/video-player'
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants/thumbnail-fallback'
import { ThumbnailUploadModal } from '@/modules/studio/ui/components/thumbnail-upload-modal'
import { ThumbnailGenerateModal } from '@/modules/studio/ui/components/thumbnail-generate-modal'

interface Props {
	videoId: string
}

export const FormSection = ({ videoId }: Props) => {
	return (
		<Suspense fallback={<FormSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<FormSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const FormSectionSkeleton = () => {
	return (
		<div>
			<div className='mb-6 flex items-center justify-between'>
				<div className='space-y-2'>
					<Skeleton className='h-7 w-32' />
					<Skeleton className='h-4 w-40' />
				</div>

				<Skeleton className='h-9 w-24' />
			</div>

			<div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
				{/* Left side */}
				<div className='space-y-8 lg:col-span-3'>
					<div className='space-y-2'>
						<Skeleton className='h-5 w-16' />
						<Skeleton className='h-10 w-full' />
					</div>

					<div className='space-y-2'>
						<Skeleton className='h-5 w-24' />
						<Skeleton className='h-55 w-full' />
					</div>

					<div className='space-y-2'>
						<Skeleton className='h-5 w-20' />
						<Skeleton className='h-21 w-38' />
					</div>

					<div className='space-y-2'>
						<Skeleton className='h-5 w-20' />
						<Skeleton className='h-10 w-full' />
					</div>
				</div>

				{/* Right side */}
				<div className='flex flex-col gap-y-8 lg:col-span-2'>
					<div className='flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#F9F9F9]'>
						<Skeleton className='aspect-video' />

						<div className='space-y-6 p-4'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-20' />
								<Skeleton className='h-5 w-full' />
							</div>

							<div className='space-y-2'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-5 w-32' />
							</div>

							<div className='space-y-2'>
								<Skeleton className='h-4 w-24' />
								<Skeleton className='h-5 w-32' />
							</div>
						</div>
					</div>

					<div className='space-y-2'>
						<Skeleton className='h-5 w-20' />
						<Skeleton className='h-10 w-full' />
					</div>
				</div>
			</div>
		</div>
	)
}

const FormSectionSuspense = ({ videoId }: Props) => {
	const router = useRouter()
	const utils = trpc.useUtils()
	const fullUrl = `${baseUrl}/videos/${videoId}`

	const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
	const [categories] = trpc.categories.getMany.useSuspenseQuery()

	const [isCopied, setIsCopied] = useState<boolean>(false)
	const [thumbnailModalOpen, setThumbnailModalOpen] = useState<boolean>(false)
	const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] = useState<boolean>(false)

	const update = trpc.videos.update.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()
			utils.studio.getOne.invalidate({ id: videoId })

			toast.success('Video updated')
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const remove = trpc.videos.remove.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()

			toast.success('Video removed')

			router.push('/studio')
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const revalidate = trpc.videos.revalidate.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()
			utils.studio.getOne.invalidate({ id: videoId })

			toast.success('Video revalidated')
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()
			utils.studio.getOne.invalidate({ id: videoId })

			toast.success('Thumbnail restored')
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const generateTitle = trpc.videos.generateTitle.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()
			utils.studio.getOne.invalidate({ id: videoId })

			toast.success('Background job started', {
				description: 'This may take a few minutes',
			})
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const generateDescription = trpc.videos.generateDescription.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()
			utils.studio.getOne.invalidate({ id: videoId })

			toast.success('Background job started', {
				description: 'This may take a few minutes',
			})
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const form = useForm<z.infer<typeof videoUpdateSchema>>({
		defaultValues: video,
		resolver: zodResolver(videoUpdateSchema),
	})

	const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
		update.mutateAsync(data)
	}

	const onCopy = async () => {
		await navigator.clipboard.writeText(fullUrl)

		setIsCopied(true)

		toast.success('Copied to clipboard')

		setTimeout(() => {
			setIsCopied(false)
		}, 2000)
	}

	return (
		<>
			<ThumbnailUploadModal
				videoId={videoId}
				open={thumbnailModalOpen}
				onOpenChange={setThumbnailModalOpen}
			/>

			<ThumbnailGenerateModal
				videoId={videoId}
				open={thumbnailGenerateModalOpen}
				onOpenChange={setThumbnailGenerateModalOpen}
			/>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='mb-6 flex items-center justify-between'>
						<div>
							<h1 className='text-2xl font-bold'>Video details</h1>

							<p className='text-xs text-muted-foreground'>Manage your video details</p>
						</div>

						<div className='flex items-center gap-x-2'>
							<Button type='submit' disabled={update.isPending || !form.formState.isDirty}>
								Save
							</Button>

							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='icon'>
										<MoreVerticalIcon className='size-4' />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align='end'>
									<DropdownMenuItem
										onClick={() => {
											revalidate.mutate({ id: videoId })
										}}
										className='cursor-pointer'
									>
										<RotateCcwIcon className='mr-2 size-4' />
										Revalidate
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={() => {
											remove.mutate({ id: videoId })
										}}
										className='cursor-pointer'
									>
										<TrashIcon className='mr-2 size-4' />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
						{/* Left side */}
						<div className='space-y-6 lg:col-span-3'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<div className='flex items-center gap-x-2'>
												Title
												<Button
													variant='outline'
													size='icon'
													type='button'
													disabled={generateTitle.isPending || !video.muxTrackId}
													onClick={() => generateTitle.mutate({ id: videoId })}
													className='size-6 rounded-full [&_svg]:size-3'
												>
													{generateTitle.isPending ? (
														<Loader2Icon className='animate-spin' />
													) : (
														<SparklesIcon />
													)}
												</Button>
											</div>
										</FormLabel>

										<FormControl>
											<Input {...field} placeholder='Video title' />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<div className='flex items-center gap-x-2'>
												Description
												<Button
													variant='outline'
													size='icon'
													type='button'
													disabled={generateDescription.isPending || !video.muxTrackId}
													onClick={() => generateDescription.mutate({ id: videoId })}
													className='size-6 rounded-full [&_svg]:size-3'
												>
													{generateDescription.isPending ? (
														<Loader2Icon className='animate-spin' />
													) : (
														<SparklesIcon />
													)}
												</Button>
											</div>
										</FormLabel>

										<FormControl>
											<Textarea
												{...field}
												rows={10}
												value={field.value || ''}
												placeholder='Add a description to your video'
												className='min-h-55 resize-none'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='thumbnailUrl'
								render={() => (
									<FormItem>
										<FormLabel>Thumbnail</FormLabel>

										<FormControl>
											<div className='group relative h-21 w-38 border border-dashed border-neutral-400 p-0.5'>
												<Image
													src={video.thumbnailUrl || THUMBNAIL_FALLBACK}
													alt='Thumbnail'
													fill
													className='object-cover'
												/>

												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															size='icon'
															type='button'
															className='absolute top-1 right-1 size-7 rounded-full bg-black/50 opacity-100 duration-300 group-hover:opacity-100 hover:bg-black/50 md:opacity-0'
														>
															<MoreVerticalIcon className='text-white' />
														</Button>
													</DropdownMenuTrigger>

													<DropdownMenuContent align='start' side='right'>
														<DropdownMenuItem
															onClick={() => setThumbnailModalOpen(true)}
															className='cursor-pointer'
														>
															<ImagePlusIcon className='mr-1 size-4' />
															Change
														</DropdownMenuItem>

														<DropdownMenuItem
															onClick={() => setThumbnailGenerateModalOpen(true)}
															className='cursor-pointer'
														>
															<SparklesIcon className='mr-1 size-4' />
															AI-Generated
														</DropdownMenuItem>

														<DropdownMenuItem
															onClick={() => restoreThumbnail.mutate({ id: video.id })}
															className='cursor-pointer'
														>
															<RotateCcwIcon className='mr-1 size-4' />
															Restore
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='categoryId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>

										<Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
											<FormControl>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select a category' />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category.id} value={category.id} className='cursor-pointer'>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Right side */}
						<div className='flex flex-col gap-y-8 lg:col-span-2'>
							<div className='flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#F9F9F9]'>
								<div className='relative aspect-video overflow-hidden'>
									<VideoPlayer playbackId={video.muxPlaybackId} thumbnailUrl={video.thumbnailUrl} />
								</div>

								<div className='flex flex-col gap-y-6 p-4'>
									<div className='flex items-center justify-between gap-x-2'>
										<div className='flex flex-col gap-y-1'>
											<p className='text-sm text-muted-foreground'>Video link</p>

											<div className='flex items-center gap-x-2'>
												<Link prefetch href={`/videos/${video.id}`}>
													<p className='line-clamp-1 text-sm text-blue-500'>{fullUrl}</p>
												</Link>

												<Button
													variant='ghost'
													type='button'
													size='icon'
													onClick={onCopy}
													disabled={isCopied}
													className='shrink-0'
												>
													{isCopied ? <CopyCheckIcon /> : <CopyIcon />}
												</Button>
											</div>
										</div>
									</div>

									<div className='flex items-center justify-between'>
										<div className='flex flex-col gap-y-1'>
											<p className='text-xs text-muted-foreground'>Video status</p>

											<p className='text-sm'>{snakeCaseToTitle(video.muxStatus || 'preparing')}</p>
										</div>
									</div>

									<div className='flex items-center justify-between'>
										<div className='flex flex-col gap-y-1'>
											<p className='text-xs text-muted-foreground'>Subtitles status</p>

											<p className='text-sm'>{snakeCaseToTitle(video.muxTrackStatus || 'no_subtitles')}</p>
										</div>
									</div>
								</div>
							</div>

							<FormField
								control={form.control}
								name='visibility'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Visibility</FormLabel>

										<Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
											<FormControl className='w-full'>
												<SelectTrigger>
													<SelectValue placeholder='Select visibility' />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												<SelectItem value='public' className='cursor-pointer'>
													<LockOpenIcon className='mr-2 size-4' />
													Public
												</SelectItem>

												<SelectItem value='private' className='cursor-pointer'>
													<LockIcon className='mr-2 size-4' />
													Private
												</SelectItem>
											</SelectContent>
										</Select>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</form>
			</Form>
		</>
	)
}
