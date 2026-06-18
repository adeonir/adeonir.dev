export function interpolate(
  template: string,
  tokens: Record<string, string>,
): string {
  return Object.entries(tokens).reduce(
    (text, [token, value]) => text.replaceAll(`{${token}}`, value),
    template,
  )
}
