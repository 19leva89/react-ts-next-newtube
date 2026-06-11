import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useUser, useClerk } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { UserAvatar } from '@/components/shared'
import { commentInsertSchema } from '@/db/schema'
import { useErrorToaster } from '@/hooks/use-error-toaster'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Textarea } from '@/components/ui'

interface Props {
	videoId: string
	parentId?: string
	variant?: 'reply' | 'comment'
	onSuccess?: () => void
	onCancel?: () => void
}

export const CommentForm = ({ videoId, parentId, variant = 'comment', onSuccess, onCancel }: Props) => {
	const trpc = useTRPC()
	const clerk = useClerk()
	const queryClient = useQueryClient()

	const { user } = useUser()
	const { toastError } = useErrorToaster()

	const create = useMutation(
		trpc.comments.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.comments.getMany.queryFilter({
						videoId,
						parentId,
					}),
				)

				form.reset()

				toast.success('Comment added')

				onSuccess?.()
			},
			onError: (error) => {
				toastError(error, 'Add comment')

				if (error.data?.code === 'UNAUTHORIZED') {
					clerk.openSignIn()
				}
			},
		}),
	)

	const formSchema = commentInsertSchema.pick({
		videoId: true,
		parentId: true,
		value: true,
	}) as typeof commentInsertSchema & z.ZodType<any, any, any>

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			videoId,
			parentId,
			value: '',
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		create.mutate(values)
	}

	const handleCancel = () => {
		form.reset()
		onCancel?.()
	}

	return (
		<Form {...form}>
			<form className='group flex gap-4' onSubmit={form.handleSubmit(onSubmit)}>
				<UserAvatar
					size='lg'
					name={user?.username || 'User'}
					imageUrl={user?.imageUrl || '/svg/user-placeholder.svg'}
				/>

				<div className='flex-1'>
					<FormField
						name='value'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										{...field}
										placeholder={variant === 'reply' ? 'Reply to this comment...' : 'Add a comment...'}
										className='resize-none overflow-hidden bg-transparent'
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='mt-2 flex justify-end gap-2'>
						{onCancel && (
							<Button type='button' variant='ghost' size='sm' onClick={handleCancel}>
								Cancel
							</Button>
						)}

						<Button type='submit' size='sm' disabled={create.isPending}>
							{variant === 'reply' ? 'Reply' : 'Comment'}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
