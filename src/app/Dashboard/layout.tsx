import SessionProviderWrapper from '../../components/SessionProviderWrapper';
import DashboardShell from '../../components/layout/DashboardShell';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProviderWrapper>
            <DashboardShell>{children}</DashboardShell>
        </SessionProviderWrapper>
    );
} 