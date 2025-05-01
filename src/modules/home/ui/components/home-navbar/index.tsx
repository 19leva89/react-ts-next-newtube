import Link from 'next/link'
import Image from 'next/image'

import { SidebarTrigger } from '@/components/ui'
import { AuthButton } from '@/modules/auth/ui/components/auth-button'
import { SearchInput } from '@/modules/home/ui/components/home-navbar/search-input'

export const HomeNavbar = () => {
	return (
		<nav className="z-50 fixed top-0 left-0 right-0 flex items-center h-16 px-2 pr-5 bg-white">
			<div className="flex items-center gap-4 w-full">
				{/* Menu and Logo */}
				<div className="flex shrink-0 items-center gap-4">
					<SidebarTrigger className="cursor-pointer" />

					<Link href="/">
						<div className="flex items-center gap-1">
							<Image src="/svg/logo.svg" alt="Logo" width={32} height={32} />

							<p className="text-xl font-semibold tracking-tight">NewTube</p>
						</div>
					</Link>
				</div>

				{/* Search bar */}
				<div className="flex flex-1 justify-center max-w-180 mx-auto">
					<SearchInput />
				</div>

				<div className="flex flex-shrink-0 items-center justify-center gap-4">
					{/* <div className="flex items-center justify-center w-26"> */}
					<AuthButton />
					{/* </div> */}
				</div>
			</div>
		</nav>
	)
}
