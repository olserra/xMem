"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const whatsappSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  webhookUrl: z.string().url("Must be a valid URL").optional(),
});

type WhatsappFormData = z.infer<typeof whatsappSchema>;

export default function WhatsappConfigPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WhatsappFormData>({
    resolver: zodResolver(whatsappSchema),
  });

  const onSubmit = async (data: WhatsappFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save WhatsApp configuration");
      }

      toast.success("WhatsApp configuration saved successfully");
    } catch (error) {
      console.error("Error saving WhatsApp configuration:", error);
      toast.error("Failed to save WhatsApp configuration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">WhatsApp Configuration</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              {...register("apiKey")}
              type="password"
              id="apiKey"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              {...register("phoneNumber")}
              type="text"
              id="phoneNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="+1234567890"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
              Webhook URL (Optional)
            </label>
            <input
              {...register("webhookUrl")}
              type="url"
              id="webhookUrl"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://your-webhook-url.com"
            />
            {errors.webhookUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.webhookUrl.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Saving..." : "Save Configuration"}
          </button>
        </form>
      </div>
    </div>
  );
} 