import { z } from 'zod'

export const narrationEnvSchema = z.object({
  ELEVENLABS_API_KEY: z.string().min(1),
  ELEVENLABS_VOICE_ID: z.string().min(1),
})
