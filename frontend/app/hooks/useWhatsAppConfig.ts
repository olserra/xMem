import { useState, useEffect } from 'react';

interface WhatsAppConfig {
  phoneNumber: string;
  apiKey: string;
  webhookUrl: string;
}

export function useWhatsAppConfig() {
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/whatsapp/config');
        if (!response.ok) {
          throw new Error('Failed to fetch WhatsApp configuration');
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { config, isLoading, error };
} 