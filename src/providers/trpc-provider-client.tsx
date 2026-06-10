import { PropsWithChildren } from 'react'

import { TRPCReactProvider } from '@/trpc/client'

export const TRPCProviderClient = ({ children }: PropsWithChildren) => {
	return <TRPCReactProvider>{children}</TRPCReactProvider>
}
