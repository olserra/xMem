// File: app/dashboard/data/create/page.tsx
import dynamic from 'next/dynamic';

// Dynamically load CreateMemory component with ssr: false to prevent SSR
const CreateData = dynamic(() => import('@/app/components/CreateData'), {
    ssr: false, // Disable SSR
});

export default function Page() {
    return <CreateData />;
}
