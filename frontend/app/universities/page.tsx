'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { universityAPI, shortlistAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
    GraduationCap,
    MapPin,
    Star,
    Plus,
    Check,
    ArrowLeft,
    ExternalLink,
    Search as SearchIcon,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UniversitiesPage() {
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [shortlisted, setShortlisted] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'dream' | 'target' | 'safe'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [recsResponse, shortlistResponse] = await Promise.all([
                universityAPI.getRecommendations(),
                shortlistAPI.getAll()
            ]);

            setRecommendations(recsResponse.data);
            const shortlistedIds = new Set<number>(shortlistResponse.data.map((s: any) => s.university_id));
            setShortlisted(shortlistedIds);
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                toast.error('Failed to load universities');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleShortlist = async (university: any, category: string, fitScore: number, reasoning: string, riskLevel: string) => {
        try {
            await shortlistAPI.add({
                university_id: university.id,
                category,
                fit_score: fitScore,
                risk_level: riskLevel,
                ai_reasoning: reasoning
            });

            setShortlisted(prev => new Set(prev).add(university.id));
            toast.success('Successfully shortlisted');
        } catch (error: any) {
            toast.error('Already in your shortlist');
        }
    };

    const categories = [
        { id: 'all', label: 'All Picks', color: 'bg-white/5' },
        { id: 'dream', label: 'Dream', color: 'bg-pink-500/10 text-pink-400' },
        { id: 'target', label: 'Target', color: 'bg-indigo-500/10 text-indigo-400' },
        { id: 'safe', label: 'Safe', color: 'bg-emerald-500/10 text-emerald-400' }
    ];

    const filteredRecs = recommendations
        .filter(r => activeFilter === 'all' || r.category === activeFilter)
        .filter(r => r.university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.university.country.toLowerCase().includes(searchQuery.toLowerCase()));

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-dark">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-bg-dark">
            <Toaster position="top-right" />

            {/* Navigation / Header */}
            <nav className="sticky top-0 z-50 border-b border-white/[0.05] bg-bg-dark/80 backdrop-blur-xl">
                <div className="container-custom h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-text-sub" />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight">University Discovery</h1>
                    </div>
                </div>
            </nav>

            <main className="container-custom pt-12">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.id as any)}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === cat.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'bg-white/[0.03] text-text-sub hover:bg-white/[0.08]'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative group min-w-[300px]">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find by name or country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 text-sm focus:outline-none focus:border-indigo-600/50 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Universities Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredRecs.map((rec) => {
                            const uni = rec.university;
                            const isShortlisted = shortlisted.has(uni.id);

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={uni.id}
                                >
                                    <Card className="h-full flex flex-col hover:border-white/10 group">
                                        {/* Top Meta */}
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rec.category === 'dream' ? 'bg-pink-500/10 text-pink-400' :
                                                            rec.category === 'target' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
                                                        }`}>
                                                        {rec.category}
                                                    </span>
                                                    {uni.ranking && (
                                                        <span className="text-[10px] font-bold text-text-dim flex items-center">
                                                            <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" />
                                                            Rank #{uni.ranking}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-black leading-snug group-hover:text-indigo-400 transition-colors">{uni.name}</h3>
                                                <div className="flex items-center text-text-dim text-xs font-bold uppercase tracking-wider">
                                                    <MapPin className="w-3 h-3 mr-1.5" />
                                                    {uni.city}, {uni.country}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-text-dim uppercase mb-1">Fit Score</div>
                                                <div className="text-3xl font-black text-white">{rec.fit_score.toFixed(0)}%</div>
                                            </div>
                                        </div>

                                        {/* AI Reasoning Strip */}
                                        <div className="p-4 bg-indigo-600/5 rounded-2xl border border-indigo-500/10 mb-8 flex items-start space-x-3">
                                            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-text-sub font-medium leading-relaxed italic">
                                                "{rec.reasoning}"
                                            </p>
                                        </div>

                                        {/* Specs Grid */}
                                        <div className="grid grid-cols-3 gap-4 mb-8">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold text-text-dim uppercase">Min GPA</span>
                                                <p className="text-sm font-black text-text-main">{uni.min_gpa}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold text-text-dim uppercase">Acceptance</span>
                                                <p className="text-sm font-black text-text-main">{uni.acceptance_rate}%</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold text-text-dim uppercase">Est. Cost</span>
                                                <p className="text-sm font-black text-emerald-400">${(uni.tuition_fee_max / 1000).toFixed(0)}K+</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center space-x-3">
                                            <Button
                                                onClick={() => !isShortlisted && handleShortlist(uni, rec.category, rec.fit_score, rec.reasoning, rec.risk_level)}
                                                variant={isShortlisted ? 'outline' : 'primary'}
                                                className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest"
                                                disabled={isShortlisted}
                                            >
                                                {isShortlisted ? (
                                                    <><Check className="w-4 h-4 mr-2" /> Shortlisted</>
                                                ) : (
                                                    <><Plus className="w-4 h-4 mr-2" /> Shortlist</>
                                                )}
                                            </Button>
                                            <button
                                                onClick={() => window.open(uni.website, '_blank')}
                                                className="p-3.5 bg-white/[0.03] hover:bg-white/10 rounded-xl transition-colors text-text-sub"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredRecs.length === 0 && (
                    <div className="py-40 text-center space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SearchIcon className="w-10 h-10 text-text-dim opacity-20" />
                        </div>
                        <h3 className="text-2xl font-black">No matches found</h3>
                        <p className="text-text-sub font-medium max-w-sm mx-auto">Try adjusting your filters or refining your search query.</p>
                        <Button variant="outline" onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} className="mt-8 rounded-full">Clear Filters</Button>
                    </div>
                )}
            </main>
        </div>
    );
}
