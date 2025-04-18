import { NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ChromaClient } from '@/app/services/mcp';

let model: any = null;
let tokenizer: any = null;

// Initialize the model
async function initialize() {
    if (!model) {
        model = await pipeline('text-generation', 'Xenova/LaMini-Flan-T5-783M');
        tokenizer = model.tokenizer;
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { message, userId } = await req.json();
        if (!message) {
            return new NextResponse('Message is required', { status: 400 });
        }

        await initialize();

        // Get relevant context from memory
        const chromaClient = new ChromaClient();
        const searchResults = await chromaClient.semanticSearch(message, undefined, userId);
        
        let context = '';
        if (searchResults.status === 'success' && searchResults.data?.results.documents.length > 0) {
            context = 'Relevant context:\n' + searchResults.data.results.documents
                .map((doc: string) => '- ' + doc)
                .join('\n') + '\n\n';
        }

        // Generate response
        const input = `${context}User: ${message}\nAssistant: Let me help you with that.`;
        const result = await model.generate(input, {
            max_new_tokens: 256,
            temperature: 0.7,
            repetition_penalty: 1.2,
        });

        const response = result[0].generated_text;

        // Analyze if the response contains important information to save
        const analysisPrompt = `Is this information important to save for future reference? Content: ${response}`;
        const analysisResult = await model.generate(analysisPrompt, {
            max_new_tokens: 64,
            temperature: 0.3,
        });

        const shouldSaveToMemory = analysisResult[0].generated_text.toLowerCase().includes('yes');
        
        // Extract potential tags
        const tagsPrompt = `Extract 2-3 relevant tags from this content: ${response}`;
        const tagsResult = await model.generate(tagsPrompt, {
            max_new_tokens: 32,
            temperature: 0.3,
        });

        const tags = tagsResult[0].generated_text
            .split(',')
            .map((tag: string) => tag.trim().toLowerCase())
            .filter((tag: string) => tag.length > 0);

        return NextResponse.json({
            response,
            shouldSaveToMemory,
            tags: tags.length > 0 ? tags : ['chat'],
            memoryContent: response,
        });
    } catch (error) {
        console.error('Chat error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 