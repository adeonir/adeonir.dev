import { atom } from 'nanostores'

import type { NarrationSection } from '~/helpers/narration'

export const $narration = atom<NarrationSection | null>(null)
