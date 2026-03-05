import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    FileText,
    FolderKanban,
    BarChart3,
    HelpCircle,
    Briefcase,
    Inbox,
    Activity,
    Settings
} from 'lucide-react';
import logo from '../../../assets/logo.jpg';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
    { to: '/admin', icon: Activity, label: 'Dashboard', exact: true },
    { to: '/admin/blog', icon: FileText, label: 'Blog' },
    { to: '/admin/initiatives', icon: FolderKanban, label: 'Initiatives' },
    { to: '/admin/metrics', icon: BarChart3, label: 'Metrics' },
    { to: '/admin/faq', icon: HelpCircle, label: 'FAQ' },
    { to: '/admin/careers', icon: Briefcase, label: 'Careers' },
    { to: '/admin/inbox', icon: Inbox, label: 'Inbox' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-[100] flex flex-col py-8 
                    backdrop-blur-xl bg-[#0B0E14]/95 lg:bg-white/5 border-r border-white/10 shrink-0 transition-all duration-500 ease-in-out
                    ${isOpen ? 'w-72 translate-x-0' : 'w-72 lg:w-20 -translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Section */}
                <div className="mb-12 px-6 lg:px-0 flex lg:justify-center items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/25 border border-emerald-500/30 shrink-0">
                        <img src={logo} alt="LOF" className="w-full h-full object-cover" />
                    </div>
                    {/* Only show text on mobile drawer */}
                    <div className={`lg:hidden flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="text-white font-black tracking-tighter leading-none">LOF</span>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Admin</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-2 px-3 lg:px-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            onClick={onClose}
                            className={({ isActive }) => `
                                relative group flex items-center gap-4 p-3.5 lg:justify-center lg:w-12 lg:h-12 rounded-2xl transition-all duration-300
                                ${isActive
                                    ? 'bg-[#10B981] shadow-lg shadow-emerald-500/20 text-white'
                                    : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className="w-5 h-5 shrink-0" />

                                    {/* Mobile Label */}
                                    <span className={`
                                        lg:hidden text-sm font-bold tracking-tight transition-all duration-300
                                        ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                                    `}>
                                        {item.label}
                                    </span>

                                    {/* Active Indicator (Border-style) */}
                                    {isActive && (
                                        <div className="absolute -left-3 lg:-left-1 top-1/2 -translate-y-1/2 w-1 h-6 lg:h-8 bg-[#10B981] lg:bg-white rounded-r-full" />
                                    )}

                                    {/* Desktop Tooltip */}
                                    <div className="hidden lg:block absolute left-[100%] ml-4 px-3 py-2 bg-gray-900 text-white text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap border border-white/10 shadow-2xl z-[9999]">
                                        {item.label}
                                    </div>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* System Status */}
                <div className="mt-auto px-6 lg:px-0 pt-8 border-t border-white/5 w-full flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 w-full lg:justify-center">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                        </div>
                        <span className="lg:hidden text-[11px] text-gray-400 font-bold uppercase tracking-widest">System Secure</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
