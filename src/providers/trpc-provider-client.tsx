import { PropsWithChildren } from 'react'

import { TRPCProvider } from '@/trpc/client'
import { HydrateClient } from '@/trpc/server'

export const TRPCProviderClient = ({ children }: PropsWithChildren) => {
	return (
		<TRPCProvider>
			<HydrateClient>{children}</HydrateClient>
		</TRPCProvider>
	)
}
