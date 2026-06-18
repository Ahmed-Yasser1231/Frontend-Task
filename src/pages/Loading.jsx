import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    const skeletonCards = Array.from({ length: 4 });

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="min-h-screen w-full overflow-hidden bg-background px-4 py-6 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                    <div className="h-8 w-48 rounded-full bg-slate-200/80 animate-pulse" />
                    <div className="h-4 w-72 max-w-full rounded-full bg-slate-200/70 animate-pulse" />
                </div>
                <div className="h-11 w-full rounded-xl bg-slate-200/70 animate-pulse sm:w-40" />
            </motion.div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {skeletonCards.map((_, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="h-32 w-full rounded-xl bg-slate-200/80 animate-pulse sm:w-32" />
                            <div className="flex-1 space-y-3">
                                <div className="h-5 w-3/4 rounded-full bg-slate-200/80 animate-pulse" />
                                <div className="h-4 w-1/2 rounded-full bg-slate-200/70 animate-pulse" />
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="h-9 rounded-lg bg-slate-200/70 animate-pulse" />
                                    <div className="h-9 rounded-lg bg-slate-200/70 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={itemVariants} className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="h-5 w-40 rounded-full bg-slate-200/80 animate-pulse" />
                    <div className="h-9 w-28 rounded-lg bg-slate-200/70 animate-pulse" />
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-4 gap-3">
                            <div className="h-10 rounded-lg bg-slate-200/70 animate-pulse" />
                            <div className="h-10 rounded-lg bg-slate-200/70 animate-pulse" />
                            <div className="h-10 rounded-lg bg-slate-200/70 animate-pulse" />
                            <div className="h-10 rounded-lg bg-slate-200/70 animate-pulse" />
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Loading;