import Link from 'next/link'
import Image from 'next/image'

import { SidebarTrigger } from '@/components/ui'
import { AuthButton } from '@/modules/auth/ui/components/auth-button'
import { StudioUploadModal } from '@/modules/studio/ui/components/studio-upload-modal'

export const StudioNavbar = () => {
	return (
		<nav className='fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b bg-white px-2 pr-5 shadow-md'>
			<div className='flex w-full items-center gap-4'>
				{/* Menu and Logo */}
				<div className='flex shrink-0 items-center'>
					<SidebarTrigger />

					<Link prefetch href='/studio' className='hidden md:block'>
						<div className='flex items-center gap-1 p-4'>
							<Image src='/svg/logo.svg' alt='Logo' width={32} height={32} />

							<p className='text-xl font-semibold tracking-tight'>Studio</p>
						</div>
					</Link>
				</div>

				{/* Spacer */}
				<div className='flex-1' />

				<div className='flex flex-shrink-0 items-center gap-4'>
					<StudioUploadModal />

					<div className='flex items-center justify-center'>
						<AuthButton />
					</div>
				</div>
			</div>
		</nav>
	)
}
