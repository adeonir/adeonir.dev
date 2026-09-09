import { onVisit } from '~/scripts/visit'

type Period = 'coffee' | 'beer'

// Business hours in the visitor's local time: 9:00 inclusive to 18:00 exclusive.
const BUSINESS_START_HOUR = 9
const BUSINESS_END_HOUR = 18

export const periodAt = (date: Date): Period => {
  const hours = date.getHours()
  return hours >= BUSINESS_START_HOUR && hours < BUSINESS_END_HOUR
    ? 'coffee'
    : 'beer'
}

const nextBoundary = (date: Date) => {
  const boundary = new Date(date)
  boundary.setMinutes(0, 0, 0)

  const hours = date.getHours()
  if (hours < BUSINESS_START_HOUR) {
    boundary.setHours(BUSINESS_START_HOUR)
  } else if (hours < BUSINESS_END_HOUR) {
    boundary.setHours(BUSINESS_END_HOUR)
  } else {
    boundary.setDate(boundary.getDate() + 1)
    boundary.setHours(BUSINESS_START_HOUR)
  }

  return boundary
}

export const bindCharacters = () => {
  const characters =
    document.querySelectorAll<HTMLImageElement>('[data-character]')
  if (characters.length === 0) return

  let timer: ReturnType<typeof setTimeout> | undefined

  const apply = () => {
    const now = new Date()
    const period = periodAt(now)

    for (const character of characters) {
      character.hidden = character.dataset.character !== period
      // Fetch the hidden one now so the switch at the boundary paints at once.
      if (character.hidden) character.loading = 'eager'
    }

    timer = setTimeout(apply, nextBoundary(now).getTime() - now.getTime())
  }

  apply()

  return () => {
    clearTimeout(timer)
  }
}

onVisit(bindCharacters)
