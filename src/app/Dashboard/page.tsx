import Dashboard from '../Dashboard';
// import { useAuth } from '../../components/auth/AuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

export default function DashboardPage() {
    // const { user, loading } = useAuth();
    // const router = useRouter();

    // useEffect(() => {
    //     if (!loading && !user) {
    //         router.push('/');
    //     }
    // }, [user, loading, router]);

    // if (loading) return <div>Loading...</div>;
    // if (!user) return null;
    return <Dashboard />;
} 