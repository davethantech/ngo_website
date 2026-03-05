import { motion } from 'motion/react';

export function SkeletonLoader() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-white/5 rounded-lg" />
                    <div className="h-4 w-48 bg-white/5 rounded-lg" />
                </div>
                <div className="h-12 w-32 bg-white/5 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-xl border border-white/10" />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/10" />
                ))}
            </div>
        </div>
    );
}
