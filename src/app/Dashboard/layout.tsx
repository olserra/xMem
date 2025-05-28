import SessionProviderWrapper from '../../components/SessionProviderWrapper';
import DashboardShell from '../../components/layout/DashboardShell';
import { TagProvider } from '../../components/tags/TagContext';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProviderWrapper>
            <TagProvider>
                <DashboardShell>{children}</DashboardShell>
            </TagProvider>
        </SessionProviderWrapper>
    );
} 