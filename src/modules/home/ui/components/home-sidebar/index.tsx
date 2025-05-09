import { SignedIn } from '@clerk/nextjs'

import { Separator, Sidebar, SidebarContent } from '@/components/ui'
import { MainSection } from '@/modules/home/ui/components/home-sidebar/main-section'
import { PersonalSection } from '@/modules/home/ui/components/home-sidebar/personal-section'
import { SubscriptionsSection } from '@/modules/home/ui/components/home-sidebar/subscriptions-section'

export const HomeSidebar = () => {
	return (
		<Sidebar collapsible="icon" className="z-40 pt-16 border-none">
			<SidebarContent className="bg-background">
				<MainSection />

				<Separator />

				<PersonalSection />

				<SignedIn>
					<Separator />

					<SubscriptionsSection />
				</SignedIn>
			</SidebarContent>
		</Sidebar>
	)
}
