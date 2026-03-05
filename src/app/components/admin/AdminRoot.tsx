import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PrefsProvider } from '../../context/PrefsContext';

export function AdminRoot() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <PrefsProvider>
            <div className="flex h-screen bg-[#0B0E14] text-white overflow-hidden relative">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                    <div className="relative z-20">
                        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                    </div>
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </PrefsProvider>
    );
}
