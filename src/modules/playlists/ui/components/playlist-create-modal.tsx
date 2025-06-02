'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { trpc } from '@/trpc/client'
import { ResponsiveModal } from '@/components/shared'
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@/components/ui'

interface Props {
	open: boolean
	onOpenChangeAction: (open: boolean) => void
}

const formSchema = z.object({
	name: z.string().min(1).max(100),
})

export const PlaylistCreateModal = ({ open, onOpenChangeAction }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	const utils = trpc.useUtils()

	const create = trpc.playlists.create.useMutation({
		onSuccess: () => {
			form.reset()
			onOpenChangeAction(false)
			utils.playlists.getMany.invalidate()

			toast.success('Playlist created')
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		create.mutate(values)
	}

	return (
		<ResponsiveModal open={open} onOpenChangeAction={onOpenChangeAction} title='Create a playlist'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='mb-4'>
								<FormLabel>Name</FormLabel>

								<FormControl>
									<Input {...field} placeholder='Enter playlist name' className='w-full' />
								</FormControl>
							</FormItem>
						)}
					/>

					<Button type='submit' disabled={create.isPending}>
						Create
					</Button>
				</form>
			</Form>
		</ResponsiveModal>
	)
}
