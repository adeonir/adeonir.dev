import { getAgentDocuments } from '~/services/agent-documents'

export const prerender = true

export async function GET() {
  const { llms } = await getAgentDocuments('pt')

  return new Response(llms, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
