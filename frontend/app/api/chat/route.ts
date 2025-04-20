import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { MCPClient } from '@/app/services/mcp';
import { parseAuthHeader } from '@/app/helpers/auth';

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

async function generateResponse(prompt: string) {
    try {
        const response = await fetch(HUGGING_FACE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.HUGGING_FACE_API_KEY}`
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 512,
                    temperature: 0.7,
                    top_p: 0.95,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status}`);
        }

        const result = await response.json();
        return result[0].generated_text;
    } catch (error) {
        console.error('Error generating response:', error);
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Validate bearer token
        const authHeader = req.headers.get('authorization');
        const token = parseAuthHeader(authHeader);
        if (!token) {
            return new NextResponse('Bearer token required', { status: 401 });
        }

        const { message, userId } = await req.json();
        if (!message) {
            return new NextResponse('Message is required', { status: 400 });
        }

        if (userId !== session.user.id) {
            return new NextResponse('Invalid user ID', { status: 403 });
        }

        // Get relevant context from memory using MCP client
        const mcpClient = new MCPClient(
            process.env.NEXT_PUBLIC_MCP_URL || 'http://localhost:8000/mcp',
            token,
            userId
        );
        
        const searchResults = await mcpClient.semanticSearch(message);
        
        let context = '';
        if (searchResults.status === 'success' && searchResults.data?.results) {
            context = searchResults.data.results.documents
                .map((doc: string) => doc)
                .join('\n');
        }

        // Generate response using Mistral
        const prompt = `<s>[INST] You are a helpful AI assistant. Use the following context (if available) to answer the user's question. If the context is not relevant or empty, respond based on your general knowledge.

Context:
${context || "No specific context available."}

User's question: ${message}

Please provide a helpful and informative response. [/INST]</s>`;

        const response = await generateResponse(prompt);
        
        if (!response) {
            return NextResponse.json({
                response: "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.",
                shouldSaveToMemory: false,
                tags: ['chat'],
                memoryContent: null,
            });
        }

        // Save the interaction to memory
        try {
            await mcpClient.addMemory({
                content: `User Query: ${message}\nResponse: ${response}`,
                metadata: {
                    type: 'CHAT',
                    source: 'chat_interaction',
                    created_at: new Date().toISOString(),
                    tags: ['chat', 'interaction'],
                }
            });
        } catch (memoryError) {
            console.error('Failed to save chat to memory:', memoryError);
        }

        return NextResponse.json({
            response,
            shouldSaveToMemory: false, // Already saved above
            tags: ['chat'],
            memoryContent: null,
        });
    } catch (error) {
        console.error('Chat error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 