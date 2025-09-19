import { SidebarDashboard } from "./_components/siderbar";

export default function DashboardLayout({
    children,
} : { children: React.ReactNode }) {
    return (
        <div className="min-h-screen relative">
            <SidebarDashboard>
                {children}
            </SidebarDashboard>
        </div>
    )
}