'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { shortlistAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import { MapPin, ArrowLeft, Trash2, Lock, CheckCircle, AlertCircle, Sparkles, GraduationCap, DollarSign, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShortlistPage() {
    const router = useRouter();
    const [shortlist, setShortlist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchShortlist();
    }, []);

    const fetchShortlist = async () => {
        setIsLoading(true);
        try {
            const response = await shortlistAPI.getAll();
            setShortlist(response.data);
        } catch (error) {
            toast.error('Failed to load shortlist');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (id: number) => {
        try {
            await shortlistAPI.remove(id);
            toast.success('Removed from shortlist');
            fetchShortlist();
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const handleLock = async (shortlistId: number) => {
        try {
            await shortlistAPI.lock({ shortlist_id: shortlistId, lock: true });
            toast.success('University Locked! Application phase started.');
            fetchShortlist();
        } catch (error) {
            toast.error('Failed to lock university');
        }
    };

    return (
        <div className="min-h-screen pb-20 bg-bg-dark text-text-main">
            <Toaster position="top-right" />

            <nav className="sticky top-0 z-50 border-b border-white/[0.05] bg-bg-dark/80 backdrop-blur-xl">
                <div className="container-custom h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-xl font-bold font-heading uppercase tracking-tighter">Selection Hub</h1>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 hidden md:block">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Total: {shortlist.length} Institutions</span>
                    </div>
                </div>
            </nav>

            <main className="container-custom pt-8 max-w-5xl">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-sm font-bold text-text-dim uppercase tracking-widest">Retrieving your choices...</p>
                    </div>
                ) : shortlist.length === 0 ? (
                    <div className="text-center py-32 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
                        <div className="w-20 h-20 bg-indigo-500/5 rounded-full flex items-center justify-center mx-auto mb-8">
                            <GraduationCap className="w-10 h-10 text-indigo-500/30" />
                        </div>
                        <p className="text-xl font-bold mb-2">Your selection is empty</p>
                        <p className="text-text-sub text-sm max-w-xs mx-auto mb-10 leading-relaxed font-medium">Start exploring institutions to add them to your selection hub.</p>
                        <Button variant="outline" className="h-12 px-10 rounded-full" onClick={() => router.push('/universities')}>
                            Discover Universities
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {shortlist.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group"
                            >
                                <Card className={`glass-card p-0 overflow-hidden relative transition-all duration-500 ${item.is_locked ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                                    <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 md:items-center">

                                        {/* Uni Info */}
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center space-x-3">
                                                {item.is_locked ? (
                                                    <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-lg flex items-center shadow-lg shadow-emerald-900/40">
                                                        <Lock className="w-3.5 h-3.5 mr-1.5" /> Target Locked
                                                    </span>
                                                ) : (
                                                    <span className="bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border border-indigo-500/20">
                                                        Admission Prospect
                                                    </span>
                                                )}
                                                <div className="h-4 w-px bg-white/10" />
                                                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                                                    Rank #{item.university.ranking}
                                                </span>
                                                {item.university.scholarship_available && (
                                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">{item.university.name}</h3>
                                                <div className="flex flex-wrap items-center text-text-dim space-x-6 text-xs font-bold uppercase tracking-widest leading-loose">
                                                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {item.university.city}, {item.university.country}</span>
                                                    <span className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-2 text-indigo-500" /> ${item.university.tuition_fee_min?.toLocaleString()} / yr</span>
                                                    <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-2 text-indigo-500" /> {item.university.acceptance_rate}% Acceptance</span>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Reasoning */}
                                                <div className="bg-indigo-600/[0.03] border border-indigo-500/10 rounded-2xl p-6 text-sm text-text-sub font-medium leading-relaxed flex items-start">
                                                    <AlertCircle className="w-4 h-4 mr-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                                                    {item.ai_reasoning}
                                                </div>
                                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                                                    <span className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">Estimated Profile Match</span>
                                                    <div className="flex items-end space-x-2">
                                                        <span className="text-3xl font-black text-indigo-400">{item.fit_score}%</span>
                                                        <span className="text-[10px] font-bold text-text-dim mb-1.5 italic font-heading lowercase tracking-tighter">score</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col gap-3 min-w-[200px]">
                                            {!item.is_locked && (
                                                <Button
                                                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 border-none text-white shadow-xl shadow-emerald-900/40 text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02]"
                                                    onClick={() => handleLock(item.id)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Finalize & Lock
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                className={`w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${item.is_locked ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:bg-error/10 hover:text-error hover:border-error/50'}`}
                                                onClick={() => handleRemove(item.id)}
                                                disabled={item.is_locked}
                                            >
                                                {item.is_locked ? 'Committed' : (
                                                    <>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Remove selection
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
