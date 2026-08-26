import { getAgentDocuments } from '~/services/agent-documents'

export const prerender = true

export async function GET() {
  const { markdown } = await getAgentDocuments('pt')

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
