import { z } from 'zod'

export const whatsappConfigSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  apiKey: z.string().min(1, 'API key is required'),
  webhookUrl: z.string().url('Must be a valid URL').optional().nullable(),
})

export type WhatsappConfigFormData = z.infer<typeof whatsappConfigSchema> 