import { pgEnum } from 'drizzle-orm/pg-core'

export const reactionTypes = pgEnum('reaction_type', ['like', 'dislike'])

export const videoVisibility = pgEnum('video_visibility', ['public', 'private'])
