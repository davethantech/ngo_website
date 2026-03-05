import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger'
}: ConfirmationModalProps) {
    const colors: Record<string, string> = {
        danger: 'bg-red-500 hover:bg-red-600 border-red-500/50 text-white',
        warning: 'bg-amber-500 hover:bg-amber-600 border-amber-500/50 text-white',
        info: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500/50 text-white',
    };

    const iconColors: Record<string, string> = {
        danger: 'text-red-500 bg-red-500/10',
        warning: 'text-amber-500 bg-amber-500/10',
        info: 'text-emerald-500 bg-emerald-500/10',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[201] p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[#0F172A] border border-white/10 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto shadow-black/60"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex justify-between items-start mb-8 text-left">
                                    <div className={`p-4 rounded-2xl ${iconColors[variant]} shadow-lg`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2.5 hover:bg-white/5 rounded-2xl transition-all text-gray-600 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="text-left">
                                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
                                    <p className="text-[#94A3B8] text-sm md:text-base font-medium leading-relaxed mb-10">
                                        {message}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className={`flex-1 px-6 py-4 rounded-2xl border text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${colors[variant]}`}
                                    >
                                        {confirmLabel}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
