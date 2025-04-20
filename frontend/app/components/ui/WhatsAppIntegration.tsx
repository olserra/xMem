import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Card } from './card'
import { Switch } from './switch'
import { useToast } from './use-toast'
import { Loader2 } from 'lucide-react'

interface WhatsAppConfig {
  enabled: boolean
  phoneNumber?: string
  welcomeMessage?: string
  knowledgeBaseEnabled: boolean
}

export function WhatsAppIntegration() {
  const [config, setConfig] = useState<WhatsAppConfig>({
    enabled: false,
    knowledgeBaseEnabled: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      setIsLoading(true)
      // Call your API to save WhatsApp configuration
      await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      toast({
        title: 'Success',
        description: 'WhatsApp configuration saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save WhatsApp configuration',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">WhatsApp Integration</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">Enable WhatsApp</label>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
          />
        </div>

        {config.enabled && (
          <>
            <div className="space-y-2">
              <label className="font-medium">WhatsApp Number</label>
              <Input
                placeholder="+1234567890"
                value={config.phoneNumber}
                onChange={(e) => setConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Welcome Message</label>
              <Input
                placeholder="Hello! How can I help you today?"
                value={config.welcomeMessage}
                onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Use Knowledge Base</label>
              <Switch
                checked={config.knowledgeBaseEnabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, knowledgeBaseEnabled: checked }))}
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </>
        )}
      </div>
    </Card>
  )
} 