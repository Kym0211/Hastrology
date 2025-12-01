'use client';

import { FC, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useStore } from '@/store/useStore';

const PAYMENT_AMOUNT = 0.01; // SOL

export const HoroscopeSection: FC = () => {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { user, horoscope, setHoroscope, loading, setLoading } = useStore();

    const [status, setStatus] = useState<'checking' | 'ready' | 'paying' | 'generating' | 'complete'>('checking');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (publicKey && user) {
            checkStatus();
        }
    }, [publicKey, user]);

    const checkStatus = async () => {
        if (!publicKey) return;

        try {
            const result = await api.getStatus(publicKey.toBase58());

            if (result.status === 'exists' && result.horoscope) {
                setHoroscope(result.horoscope);
                setStatus('complete');
            } else {
                setStatus('ready');
            }
        } catch (err) {
            console.error('Failed to check status:', err);
            setStatus('ready');
        }
    };

    const handlePayment = async () => {
        if (!publicKey || !sendTransaction) return;

        setLoading(true);
        setError(null);
        setStatus('paying');

        try {
            // Create payment transaction (0.01 SOL to self for now)
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: publicKey, // In production, this would be your treasury wallet
                    lamports: PAYMENT_AMOUNT * LAMPORTS_PER_SOL
                })
            );

            const signature = await sendTransaction(transaction, connection);

            // Wait for confirmation
            // await connection.confirmTransaction(signature, 'confirmed');

            // Generate horoscope
            setStatus('generating');
            const result = await api.confirmHoroscope(publicKey.toBase58(), signature);

            setHoroscope(result.horoscope_text);
            setStatus('complete');
        } catch (err: any) {
            setError(err.message || 'Failed to process payment');
            setStatus('ready');
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = async () => {
        setLoading(true);
        setError(null);
        setStatus('generating');

        // Simulate generation delay for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Demo horoscope based on user's birth details
        const demoHoroscope = `🌟 Your Cosmic Reading (Demo Mode) 🌟

Welcome, ${user?.name || 'Cosmic Traveler'}!

Born under the ${user?.zodiacSign || 'stars'}, your journey through this phase brings remarkable opportunities for growth and transformation.

✨ CAREER & AMBITIONS ✨
The celestial bodies align in your favor this week, bringing fresh perspectives to your professional endeavors. Jupiter's influence suggests that collaboration will be key to unlocking new opportunities. A creative project or innovative idea you've been nurturing may finally find the recognition it deserves.

💫 RELATIONSHIPS & CONNECTIONS 💫
Venus graces your social sphere, enhancing your natural charm and magnetism. Existing relationships deepen as you find new ways to express yourself authentically. For those seeking connection, the cosmic energies favor genuine conversations over superficial interactions.

🌙 PERSONAL GROWTH 🌙
This is a powerful time for introspection and self-discovery. The Moon's position encourages you to trust your intuition more deeply. Don't shy away from your inner wisdom - it's guiding you toward your highest potential.

⚡ LUCKY ELEMENTS ⚡
• Lucky Numbers: 3, 7, 14, 21
• Power Days: Tuesday & Friday
• Beneficial Colors: Deep Purple, Silver
• Element Focus: ${user?.birthTime ? 'Water - Trust your emotional intelligence' : 'Earth - Stay grounded in your values'}

Remember: The stars guide us, but we shape our own destiny. Use this cosmic wisdom to illuminate your path forward.

🔮 Note: This is a demo horoscope. For personalized, AI-generated readings based on your exact birth chart, complete a full payment. 🔮`;

        setHoroscope(demoHoroscope);
        setStatus('complete');
        setLoading(false);
    };

    if (!user || !publicKey) {
        return null;
    }

    return (
        <section id="horoscope-section" className="min-h-screen flex items-center justify-center py-20 px-4 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full max-w-3xl relative z-10"
            >
                {status === 'ready' && (
                    <div className="glass-panel rounded-3xl p-8 md:p-12 text-center border-t border-white/10">
                        <div className="inline-block p-4 rounded-full bg-purple-500/10 mb-6 animate-pulse-slow">
                            <span className="text-4xl">✨</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200">
                            Ready to Discover Your Path?
                        </h2>
                        <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
                            The stars have aligned to reveal your cosmic destiny. Choose your journey below.
                        </p>

                        {error && (
                            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-center justify-center gap-2">
                                <span className="text-lg">⚠️</span> {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Payment Option */}
                            <div className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-500 blur"></div>
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="relative w-full h-full bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-slate-800 transition-all duration-300"
                                >
                                    <div className="text-purple-400 font-bold tracking-wider text-sm uppercase">Premium Reading</div>
                                    <div className="text-3xl font-bold text-white">{PAYMENT_AMOUNT} SOL</div>
                                    <div className="text-slate-500 text-sm">Deep AI Analysis • Full Chart</div>
                                    <div className="w-full py-3 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold shadow-lg shadow-purple-900/20 group-hover:shadow-purple-600/40 transition-all">
                                        {loading ? 'Processing...' : 'Unlock Destiny'}
                                    </div>
                                </button>
                            </div>

                            {/* Demo Option */}
                            <button
                                onClick={handleDemo}
                                disabled={loading}
                                className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-blue-400/30 group"
                            >
                                <div className="text-blue-400 font-bold tracking-wider text-sm uppercase">Preview</div>
                                <div className="text-3xl font-bold text-white">Free</div>
                                <div className="text-slate-500 text-sm">Sample Reading • Quick View</div>
                                <div className="w-full py-3 mt-2 bg-slate-800 text-blue-300 rounded-xl font-bold border border-blue-500/20 group-hover:bg-blue-500/10 group-hover:text-blue-200 transition-all">
                                    Try Demo
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {(status === 'paying' || status === 'generating') && (
                    <div className="glass-panel rounded-3xl p-16 text-center">
                        <div className="cosmic-loader mb-8"></div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {status === 'paying' ? 'Confirming Transaction...' : 'Consulting the Stars...'}
                        </h3>
                        <p className="text-slate-400 text-lg animate-pulse">
                            {status === 'paying' ? 'Please approve the request in your wallet' : 'AI is interpreting your celestial alignment'}
                        </p>
                    </div>
                )}

                {status === 'complete' && horoscope && (
                    <div className="glass-panel rounded-3xl p-8 md:p-12 border-t border-purple-500/20 shadow-2xl shadow-purple-900/20">
                        <div className="text-center mb-10">
                            <span className="inline-block py-1 px-3 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest uppercase mb-4 border border-purple-500/20">
                                Cosmic Revelation
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-pink-200">
                                Your Reading
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto opacity-50"></div>
                        </div>

                        <div className="prose prose-invert max-w-none mb-10">
                            <div className="bg-slate-950/30 rounded-2xl p-6 md:p-8 border border-white/5 leading-relaxed text-slate-200 text-lg whitespace-pre-wrap font-light">
                                {horoscope}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-white/5 hover:border-white/10"
                            >
                                ↻ New Reading
                            </button>

                            <button
                                onClick={() => {
                                    alert('Share feature coming soon!');
                                }}
                                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 hover:-translate-y-1 active:translate-y-0"
                            >
                                Share on X
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </section>
    );
};
