import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <FileQuestion className="w-8 h-8 text-[#94A3B8]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
            <p className="text-[#94A3B8] max-w-sm mb-8">{description}</p>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-all"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
