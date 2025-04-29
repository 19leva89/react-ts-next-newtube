import { PropsWithChildren } from 'react'

import { HydrateClient } from '@/trpc/server'
import { TRPCReactProvider } from '@/trpc/client'

export const TRPCProviderClient = ({ children }: PropsWithChildren) => {
	return (
		<TRPCReactProvider>
			<HydrateClient>{children}</HydrateClient>
		</TRPCReactProvider>
	)
}
