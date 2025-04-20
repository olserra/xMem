import Chat from '@/components/Chat';

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Chat with Memory</h1>
      <div className="flex-1">
        <Chat />
      </div>
    </main>
  );
} 