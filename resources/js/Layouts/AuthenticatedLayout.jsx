import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Film, 
    Heart, 
    User, 
    LogOut, 
    Menu, 
    X, 
    Tv, 
    Settings,
    Shield
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Daftar link navigasi di Sidebar
    const navItems = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutDashboard,
            active: route().current('dashboard'),
        },
        {
            name: 'Katalog Film',
            href: '/movies', // Sesuaikan dengan route film milikmu
            icon: Film,
            active: route().current('movies*'),
        },
        {
            name: 'Favorit Saya',
            href: '/watchlist', // Sesuaikan dengan route watchlist milikmu
            icon: Heart,
            active: route().current('watchlist*'),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            
            {/* Backdrop Overlay untuk Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* 1. SIDEBAR (Fixed di Kiri) */}
            <aside 
                className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* Header Sidebar / Brand Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-600/40">
                                <Tv className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-wider text-white">
                                STREAM<span className="text-red-500">X</span>
                            </span>
                        </Link>
                        {/* Tombol Close di Mobile */}
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-4 space-y-1.5">
                        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                            Menu Utama
                        </div>

                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        item.active
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Sidebar / Profile & Logout */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="w-9 h-9 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-sm border border-red-500/30">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                        >
                            <Settings className="w-3.5 h-3.5" /> Profil
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Keluar
                        </Link>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                
                {/* Topbar Header */}
                <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Tombol Toggle Sidebar (Mobile) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Title Header dari Page Component */}
                        {header && (
                            <div className="text-slate-200 text-sm font-semibold">
                                {header}
                            </div>
                        )}
                    </div>

                    {/* Badge / Status VIP Topbar */}
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Shield className="w-3.5 h-3.5" /> Mode Terotentikasi
                        </span>
                    </div>
                </header>

                {/* Content Body */}
                <main className="flex-1">
                    {children}
                </main>
            </div>

        </div>
    );
}