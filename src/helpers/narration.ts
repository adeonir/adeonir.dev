export const narrationSections = ['hero', 'about', 'expertise'] as const

export type NarrationSection = (typeof narrationSections)[number]
