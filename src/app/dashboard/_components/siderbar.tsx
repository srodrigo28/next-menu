"use client"

import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import logoImg from "../../../../public/logo-width.png"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Banknote, CalendarCheck2, ChevronLeft, ChevronRight, Folder, List, Settings, type LucideIcon } from "lucide-react"

// MELHORIA: Links de navegação centralizados em um array para evitar repetição (princípio DRY).
// Facilita a manutenção: para adicionar/remover um link, basta mexer aqui.
const navItems = [
    { type: 'title', label: 'Painel' },
    { href: "/dashboard", label: "Agendamentos", icon: CalendarCheck2 },
    { href: "/dashboard/services", label: "Serviços", icon: Folder },
    { type: 'separator' },
    { type: 'title', label: 'Configurações' },
    { href: "/dashboard/profile", label: "Meu Perfil", icon: Settings },
    { href: "/dashboard/plans", label: "Planos", icon: Banknote },
]

export function SidebarDashboard({ children }: { children?: React.ReactNode }) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    
    // MELHORIA: Estado para controlar a abertura/fechamento do menu mobile (Sheet).
    // Isso permite que ele seja fechado programaticamente.
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed)

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            
            {/* Sidebar para telas maiores (Desktop) */}
            <aside className={clsx(
                "hidden md:flex flex-col border-r bg-background transition-all duration-300 fixed h-full",
                isCollapsed ? "w-20" : "w-64" 
            )}>
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                       {!isCollapsed ? (
                           <Image
                                src={logoImg}
                                alt="Logo Completa PlanoPRO"
                                priority
                                className="h-8 w-auto transition-all duration-300"
                            />
                       ) : (
                           <Image
                                src={logoImg} // Idealmente, uma versão quadrada da logo
                                alt="Ícone PlanoPRO"
                                priority
                                className="h-8 w-8"
                           />
                       )}
                    </Link>
                </div>
                
                <div className="flex-1 overflow-auto py-4">
                    {/* MELHORIA: Componente reutilizável para renderizar a navegação. */}
                    <NavLinks
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                    />
                </div>

                <div className="mt-auto border-t p-4">
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="w-full justify-center md:justify-start"
                        aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"} // Acessibilidade
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>
                </div>
            </aside>

            {/* Layout principal que se ajusta à sidebar */}
            <div className={clsx(
                "flex flex-1 flex-col transition-all duration-300",
                isCollapsed ? "md:ml-20" : "md:ml-64"
            )}>
                {/* Header para telas menores (Mobile) */}
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-[60px] sm:px-6 md:hidden">
                    
                    {/* MELHORIA: O Sheet agora é controlado pelo estado 'isMobileMenuOpen'. */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0"
                                aria-label="Abrir menu"
                            >
                                <List className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <SheetTitle className="mt-3">PlanoPro</SheetTitle>
                            <SheetDescription>Menu de Navegação</SheetDescription>
                            
                            {/* MELHORIA: Passa a função para fechar o menu quando um link for clicado. */}
                            <NavLinks 
                                pathname={pathname} 
                                isCollapsed={false}
                                onLinkClick={() => setIsMobileMenuOpen(false)} 
                            />
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </header>

                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
// --- Componentes Auxiliares ---

interface NavLinksProps {
    pathname: string;
    isCollapsed: boolean;
    onLinkClick?: () => void; // Prop opcional para o clique, usada no mobile
}

// Componente auxiliar para renderizar a lista de links, evitando duplicação de código.
function NavLinks({ pathname, isCollapsed, onLinkClick }: NavLinksProps) {
    return (
        <nav className={clsx("grid items-start gap-1 px-2 text-sm font-medium", isCollapsed && "px-0 justify-center")}>
            {navItems.map((item, index) => {
                if (item.type === 'title') {
                    return !isCollapsed && (
                        <h3 key={index} className="px-3 mt-4 mb-2 text-xs font-semibold uppercase text-muted-foreground">
                            {item.label}
                        </h3>
                    );
                }

                if (item.type === 'separator') {
                    return !isCollapsed && <hr key={index} className="my-2" />;
                }

                const Icon = item.icon as LucideIcon;
                return (
                    <SidebarLink
                        key={item.href}
                        href={item.href!}
                        label={item.label!}
                        icon={<Icon className="h-5 w-5" />}
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        // Passa a função de clique para o componente final do link
                        onClick={onLinkClick}
                    />
                )
            })}
        </nav>
    );
}

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    pathname: string;
    isCollapsed: boolean;
    onClick?: () => void; // Prop opcional para capturar o clique
}

// Componente de Link refatorado com melhor área de clique e estilização.
function SidebarLink({ href, icon, isCollapsed, label, pathname, onClick }: SidebarLinkProps) {
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick} // Aplica a função de clique recebida
            className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                {
                    "bg-muted text-primary font-semibold": isActive, // Estilo para link ativo
                    "justify-center": isCollapsed
                }
            )}
        >
            {icon}
            {!isCollapsed && <span className="overflow-hidden transition-all duration-300">{label}</span>}
        </Link>
    )
}
