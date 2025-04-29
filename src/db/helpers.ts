import { text } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export function cuid(columnName: string) {
	return text(columnName).$defaultFn(() => createId())
}
