'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { WhatsappConfigFormData, whatsappConfigSchema } from '@/lib/validations/whatsapp'

const formSchema = z.object({
  enabled: z.boolean(),
  phoneNumber: z.string().min(10, {
    message: 'Phone number must be at least 10 characters.',
  }),
  welcomeMessage: z.string().min(10, {
    message: 'Welcome message must be at least 10 characters.',
  }),
  knowledgeBaseEnabled: z.boolean(),
})

type WhatsAppConfigFormValues = z.infer<typeof formSchema>

interface WhatsappConfigFormProps {
  initialData?: WhatsappConfigFormData
  onSubmit: (data: WhatsappConfigFormData) => void
  isLoading?: boolean
}

export function WhatsappConfigForm({
  initialData,
  onSubmit,
  isLoading = false,
}: WhatsappConfigFormProps) {
  const form = useForm<WhatsappConfigFormData>({
    resolver: zodResolver(whatsappConfigSchema),
    defaultValues: initialData || {
      phoneNumber: '',
      apiKey: '',
      webhookUrl: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your WhatsApp phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your WhatsApp API key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your webhook URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </form>
    </Form>
  )
} 