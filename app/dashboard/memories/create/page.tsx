// File: app/dashboard/memories/create/page.tsx
import dynamic from 'next/dynamic';

// Dynamically load CreateMemory component with ssr: false to prevent SSR
const CreateMemory = dynamic(() => import('@/app/components/CreateMemory'), {
    ssr: false, // Disable SSR
});

export default function Page() {
    return <CreateMemory />;
}
