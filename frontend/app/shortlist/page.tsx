'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { shortlistAPI, universityAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
    GraduationCap,
    Lock,
    Unlock,
    Trash2,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Clock,
    FileText,
    TrendingUp
} from 'lucide-react';

export default function ShortlistPage() {
    const router = useRouter();
    const [shortlist, setShortlist] = useState<any[]>([]);
    const [universities, setUniversities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [shortlistRes, uniRes] = await Promise.all([
                shortlistAPI.getAll(),
                universityAPI.getAll()
            ]);
            setShortlist(shortlistRes.data);
            setUniversities(uniRes.data);
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                toast.error('Failed to load shortlist');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLock = async (shortlistId: number, currentLocked: boolean) => {
        const isLocking = !currentLocked;

        // If locking, we might want to warn them it's a commitment
        if (isLocking) {
            if (!confirm('Locking this university commits you to this choice for application guidance. You can unlock later, but we recommend focusing on your locked choice. Proceed?')) {
                return;
            }
        }

        try {
            await shortlistAPI.lock({ shortlist_id: shortlistId, lock: isLocking });
            toast.success(isLocking ? 'University locked! Application guidance unlocked.' : 'University unlocked.');
            fetchData();
        } catch (error) {
            toast.error('Failed to update lock status');
        }
    };

    const handleRemove = async (shortlistId: number) => {
        if (!confirm('Are you sure you want to remove this university from your shortlist?')) return;
        try {
            await shortlistAPI.remove(shortlistId);
            toast.success('Removed from shortlist');
            fetchData();
        } catch (error) {
            toast.error('Failed to remove university');
        }
    };

    const getUniDetails = (uniId: number) => {
        return universities.find(u => u.id === uniId);
    };

    const lockedUniversity = shortlist.find(s => s.is_locked);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="border-b border-[#2d2d4a] bg-[#1a1a2e]/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                            <div className="h-6 w-px bg-gray-700" />
                            <h1 className="text-2xl font-bold">My Shortlist</h1>
                        </div>
                        {lockedUniversity && (
                            <Button onClick={() => router.push('/guidance')} variant="secondary" size="sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Go to Application Guidance
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Lock Warning/Status */}
                {!lockedUniversity ? (
                    <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start space-x-4">
                        <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold text-amber-400">Lock a University to Proceed</h3>
                            <p className="text-gray-400">
                                You haven't locked a university yet. Locking is a commitment step that unlocks specific application guidance, document checklists, and personalized timelines for that institution.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start space-x-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold text-green-400">University Locked</h3>
                            <p className="text-gray-400">
                                You have committed to <strong>{getUniDetails(lockedUniversity.university_id)?.name}</strong>. Application guidance is now active.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid gap-6">
                    {shortlist.length === 0 ? (
                        <Card className="text-center py-16">
                            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <h2 className="text-2xl font-bold mb-2">No universities shortlisted yet</h2>
                            <p className="text-gray-400 mb-8">Start exploring universities to build your shortlist.</p>
                            <Button onClick={() => router.push('/universities')}>
                                Find Universities
                            </Button>
                        </Card>
                    ) : (
                        shortlist.map((item) => {
                            const uni = getUniDetails(item.university_id);
                            if (!uni) return null;

                            return (
                                <Card key={item.id} className={`relative overflow-hidden transition-all duration-300 ${item.is_locked ? 'border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : ''}`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-bold">{uni.name}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.category === 'dream' ? 'bg-pink-500/20 text-pink-400' :
                                                    item.category === 'target' ? 'bg-indigo-500/20 text-indigo-400' :
                                                        'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {item.category}
                                                </span>
                                                {item.is_locked && (
                                                    <span className="flex items-center px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-bold">
                                                        <Lock className="w-3 h-3 mr-1" />
                                                        LOCKED
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    Applied: {new Date(item.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <TrendingUp className={`w-4 h-4 mr-1 ${item.risk_level === 'Low' ? 'text-green-400' :
                                                        item.risk_level === 'High' ? 'text-red-400' : 'text-yellow-400'
                                                        }`} />
                                                    {item.risk_level} Risk
                                                </div>
                                            </div>

                                            <div className="p-3 bg-indigo-500/5 rounded-lg border border-white/5">
                                                <p className="text-xs text-indigo-300 font-semibold mb-1 uppercase tracking-wider">AI Reasoning</p>
                                                <p className="text-sm text-gray-300 italic">"{item.ai_reasoning}"</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Button
                                                variant={item.is_locked ? 'outline' : 'primary'}
                                                onClick={() => handleLock(item.id, item.is_locked)}
                                                className="flex-1 md:flex-none"
                                            >
                                                {item.is_locked ? (
                                                    <>
                                                        <Unlock className="w-4 h-4 mr-2" />
                                                        Unlock Choice
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-4 h-4 mr-2" />
                                                        Lock & Commit
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="text-gray-500 hover:text-red-400"
                                                onClick={() => handleRemove(item.id)}
                                                disabled={item.is_locked}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
