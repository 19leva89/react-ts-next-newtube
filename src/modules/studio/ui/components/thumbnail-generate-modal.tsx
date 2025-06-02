import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Textarea,
} from '@/components/ui'
import { trpc } from '@/trpc/client'
import { ResponsiveModal } from '@/components/shared'

interface Props {
	videoId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
	prompt: z.string().min(10),
})

export const ThumbnailGenerateModal = ({ videoId, open, onOpenChange }: Props) => {
	const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
		onSuccess: () => {
			toast.success('Background job started', {
				description: 'This may take a few minutes',
			})
			form.reset()
			onOpenChange(false)
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prompt: '',
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		generateThumbnail.mutate({ id: videoId, prompt: values.prompt })
	}

	return (
		<ResponsiveModal open={open} onOpenChangeAction={onOpenChange} title='Upload a thumbnail'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
					<FormField
						name='prompt'
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prompt</FormLabel>

								<FormControl>
									<Textarea
										{...field}
										cols={30}
										rows={5}
										placeholder='Enter description of wanted thumbnail'
										className='min-h-28 resize-none'
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-end'>
						<Button type='submit' disabled={generateThumbnail.isPending}>
							Generate
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveModal>
	)
}
