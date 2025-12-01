'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';
import { motion } from 'framer-motion';

// Import wallet button with no SSR
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export const Hero: FC = () => {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)]"></div>
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center px-4 max-w-5xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mb-8 relative inline-block"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl rounded-full animate-pulse-slow"></div>
                    <h1 className="relative text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 tracking-tight">
                        Hastrology
                    </h1>
                </motion.div>

                <motion.p
                    className="text-2xl md:text-3xl text-purple-200/80 mb-6 font-light tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Discover Your Cosmic Path
                </motion.p>

                <motion.p
                    className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    Unlock the secrets of the stars with AI-powered insights on Solana.
                    Your destiny is written in the code of the cosmos. ✨
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="glass-panel p-1 rounded-full">
                        <WalletMultiButtonDynamic className="!bg-transparent !h-14 !px-8 !text-lg hover:!bg-white/5 !transition-all" />
                    </div>

                    <p className="text-sm text-slate-500">
                        Connect wallet to begin your journey
                    </p>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
            </motion.div>
        </section>
    );
};
