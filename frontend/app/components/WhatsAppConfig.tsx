import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const whatsAppSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  welcomeMessage: z.string().min(1, 'Welcome message is required'),
  knowledgeBaseEnabled: z.boolean().default(false),
});

type WhatsAppFormData = z.infer<typeof whatsAppSchema>;

export default function WhatsAppConfig() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsAppSchema),
  });

  const onSubmit = async (data: WhatsAppFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          enabled: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to update configuration');
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">WhatsApp Configuration</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            {...register('phoneNumber')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Welcome Message</label>
          <textarea
            {...register('welcomeMessage')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
          {errors.welcomeMessage && (
            <p className="mt-1 text-sm text-red-600">{errors.welcomeMessage.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            {...register('knowledgeBaseEnabled')}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Enable Knowledge Base
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
} 