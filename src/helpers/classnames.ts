import { cx } from 'class-variance-authority'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display',
        'heading',
        'title',
        'subtitle',
        'body',
        'caption',
        'label',
        'button',
        'code',
      ],
    },
  },
})

export function cn(...inputs: Parameters<typeof cx>) {
  return twMerge(cx(...inputs))
}
