'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { universityAPI, shortlistAPI, profileAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import { Search, MapPin, GraduationCap, DollarSign, Bookmark, ArrowLeft, Filter, Sparkles, X, Globe, BookOpen, UserCheck, Activity, Send, Info, ExternalLink, Star, ChevronDown, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UniversitiesPage() {
    const router = useRouter();
    const [universities, setUniversities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [isGlobalSearch, setIsGlobalSearch] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [gridCols, setGridCols] = useState(4);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        country: '',
        name: '',
        major: '',
        min_tuition: '',
        max_tuition: '',
        min_ranking: '',
        max_ranking: '',
        scholarship: false
    });

    const fetchProfile = useCallback(async () => {
        try {
            const res = await profileAPI.get();
            setUserProfile(res.data);
        } catch (err: any) {
            if (err.response?.status === 401) {
                router.push('/login');
            }
        }
    }, []);

    const fetchUniversities = useCallback(async () => {
        setIsLoading(true);
        try {
            if (isGlobalSearch) {
                const response = await universityAPI.searchGlobal({
                    country: filters.country,
                    name: filters.name,
                    limit: 20
                });
                setUniversities(response.data);
            } else {
                const params: any = {};
                if (filters.name) params.name = filters.name;
                if (filters.country) params.country = filters.country;
                if (filters.major) params.major = filters.major;

                // Use raw USD from filters
                if (filters.min_tuition) params.min_tuition = parseFloat(filters.min_tuition);
                if (filters.max_tuition) params.max_tuition = parseFloat(filters.max_tuition);

                if (filters.min_ranking) params.min_ranking = parseInt(filters.min_ranking);
                if (filters.max_ranking) params.max_ranking = parseInt(filters.max_ranking);
                if (filters.scholarship) params.scholarship = true;

                console.log('🔍 Executing Discovery Protocol with params:', params);
                const response = await universityAPI.getAll(params);
                setUniversities(response.data);
            }
        } catch (error: any) {
            console.error('Fetch error:', error);
            toast.error('Failed to sync with university core.');
        } finally {
            setIsLoading(false);
        }
    }, [isGlobalSearch, filters]);

    useEffect(() => {
        fetchProfile();
        fetchUniversities();
    }, [isGlobalSearch, fetchProfile]); // Only refetch on mode change, use manual search button for filters

    const handleShortlist = async (uni: any) => {
        try {
            let targetUni = uni;

            if (isGlobalSearch || !uni.id) {
                setIsImporting(true);
                const loadingToast = toast.loading('Enriching node data with AI...', { id: 'import' });
                const importRes = await universityAPI.importExternal(uni);
                targetUni = importRes.data;
                toast.success('Node enriched!', { id: 'import' });
            }

            await shortlistAPI.add({
                university_id: targetUni.id,
                category: 'target',
                fit_score: calculateFitScore(targetUni),
                risk_level: calculateRiskLevel(targetUni),
                ai_reasoning: generateReasoning(targetUni)
            });
            toast.success('Target locked in selection hub!');
            setIsImporting(false);
            if (isGlobalSearch) fetchUniversities();
        } catch (error: any) {
            setIsImporting(false);
            toast.dismiss('import');
            toast.error(error.response?.data?.detail || 'Failed to lock target');
        }
    };

    const calculateFitScore = (uni: any) => {
        if (!userProfile || !uni.min_gpa) return 85;
        const gpaDiff = userProfile.gpa - uni.min_gpa;
        if (gpaDiff >= 0.5) return 98;
        if (gpaDiff >= 0) return 90;
        if (gpaDiff >= -0.2) return 75;
        return 60;
    };

    const calculateRiskLevel = (uni: any) => {
        if (!userProfile || !uni.min_gpa) return 'Medium';
        const gpaDiff = userProfile.gpa - uni.min_gpa;
        if (gpaDiff >= 0.4) return 'SAFE';
        if (gpaDiff >= 0.1) return 'TARGET';
        return 'REACH';
    };

    const generateReasoning = (uni: any) => {
        if (!userProfile) return `Based on orbital data, ${uni.name} is a high-probability choice.`;
        return `"System Analysis: GPA (${userProfile.gpa}) ${userProfile.gpa >= uni.min_gpa ? 'exceeds' : 'aligns with'} threshold (${uni.min_gpa || 3.0}). Strategic classification: ${calculateRiskLevel(uni)}."`;
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        fetchUniversities();
    };

    const resetFilters = () => {
        setFilters({
            country: '',
            name: '',
            major: '',
            min_tuition: '',
            max_tuition: '',
            min_ranking: '',
            max_ranking: '',
            scholarship: false
        });
    };

    return (
        <div className="min-h-screen pb-20 bg-bg-dark text-text-main relative overflow-x-hidden">
            <div className="fixed inset-0 -z-10 mesh-gradient opacity-30" />
            <Toaster position="top-right" />

            {/* Header */}
            <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-bg-dark/90 backdrop-blur-2xl">
                <div className="container-custom h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => router.push('/dashboard')} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group shimmer">
                            <ArrowLeft className="w-5 h-5 text-text-sub group-hover:text-white transition-colors" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 animate-pulse-glow">
                                <Search className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-black tracking-tighter uppercase whitespace-nowrap gradient-rainbow">Institution Discovery</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden xl:flex items-center glass-card-premium rounded-xl p-1.5 border border-white/10">
                            {[2, 3, 4].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setGridCols(n)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${gridCols === n ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/40' : 'text-text-dim hover:text-white'}`}
                                >
                                    {n} COL
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center glass-card-premium rounded-full p-1.5 border border-white/10">
                            <button
                                onClick={() => setIsGlobalSearch(false)}
                                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isGlobalSearch ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-900/50' : 'text-text-dim hover:text-white'}`}
                            >
                                Verified
                            </button>
                            <button
                                onClick={() => setIsGlobalSearch(true)}
                                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isGlobalSearch ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-900/50' : 'text-text-dim hover:text-white'}`}
                            >
                                Global
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container-custom pt-12">
                {/* Search & Filter Header */}
                <div className="flex flex-col space-y-6 mb-12">
                    <Card className="p-2 glass-card-premium border-white/10 rounded-[2.5rem] shadow-2xl shadow-indigo-600/10">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 relative w-full group">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-text-dim group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    className="w-full h-20 bg-white/[0.03] border border-white/5 rounded-[2rem] pl-20 pr-8 text-lg font-black tracking-tight focus:outline-none focus:border-indigo-600/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10 uppercase"
                                    placeholder={isGlobalSearch ? "Enter Global Target..." : "Search Verified Nodes..."}
                                    value={filters.name}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`h-20 w-20 flex items-center justify-center rounded-[2rem] border transition-all ${showFilters ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/40' : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}
                                >
                                    <Filter className="w-6 h-6" />
                                </button>
                                <Button type="submit" isLoading={isLoading} className="flex-1 md:flex-none h-20 px-12 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 border-t border-white/20 shimmer">
                                    Execute Protocol
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <Card className="p-10 bg-indigo-600/[0.02] border-indigo-500/10 rounded-[2.5rem] grid md:grid-cols-4 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] ml-2">Target Country</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                                            <input
                                                className="w-full h-14 bg-bg-dark/50 border border-white/5 rounded-2xl pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                                placeholder="e.g. United Kingdom"
                                                value={filters.country}
                                                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] ml-2">Budget Range ($)</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-1/2 h-14 bg-bg-dark/50 border border-white/5 rounded-2xl px-4 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                                placeholder="Min"
                                                value={filters.min_tuition}
                                                onChange={(e) => setFilters({ ...filters, min_tuition: e.target.value })}
                                            />
                                            <input
                                                className="w-1/2 h-14 bg-bg-dark/50 border border-white/5 rounded-2xl px-4 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                                placeholder="Max"
                                                value={filters.max_tuition}
                                                onChange={(e) => setFilters({ ...filters, max_tuition: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] ml-2">Global Ranking</label>
                                        <div className="flex gap-2">
                                            <input
                                                className="w-1/2 h-14 bg-bg-dark/50 border border-white/5 rounded-2xl px-4 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                                placeholder="From"
                                                value={filters.min_ranking}
                                                onChange={(e) => setFilters({ ...filters, min_ranking: e.target.value })}
                                            />
                                            <input
                                                className="w-1/2 h-14 bg-bg-dark/50 border border-white/5 rounded-2xl px-4 text-xs font-bold focus:outline-none focus:border-indigo-600"
                                                placeholder="To"
                                                value={filters.max_ranking}
                                                onChange={(e) => setFilters({ ...filters, max_ranking: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between gap-4">
                                        <div
                                            onClick={() => setFilters({ ...filters, scholarship: !filters.scholarship })}
                                            className={`flex-1 h-14 flex items-center justify-center rounded-2xl border cursor-pointer transition-all ${filters.scholarship ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-bg-dark border-white/5 text-text-dim'}`}
                                        >
                                            <Sparkles className="w-4 h-4 mr-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Scholarship</span>
                                        </div>
                                        <button
                                            onClick={resetFilters}
                                            className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-text-dim hover:text-white transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Results Section */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-8 shadow-2xl shadow-indigo-600/20" />
                        <p className="text-sm font-black text-text-dim uppercase tracking-[0.5em] animate-pulse">Syncing Database Protocols...</p>
                    </div>
                ) : universities.length === 0 ? (
                    <div className="text-center py-40">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                            <X className="w-12 h-12 text-white/20" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">No Matches Found</h3>
                        <p className="text-text-sub font-medium max-w-sm mx-auto leading-relaxed uppercase text-[10px] tracking-widest">Adjust your orbital parameters or filter criteria to broaden the search.</p>
                        <Button variant="outline" className="mt-10 h-16 px-12 rounded-[2rem] font-black uppercase tracking-widest" onClick={resetFilters}>Reset Global Filters</Button>
                    </div>
                ) : (
                    <div className={`grid md:grid-cols-2 ${gridCols === 2 ? 'lg:grid-cols-2' : gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-8`}>
                        {universities.map((uni, idx) => {
                            const fitScore = calculateFitScore(uni);
                            const riskLevel = calculateRiskLevel(uni);
                            const isGlobal = isGlobalSearch || !uni.id;

                            // Rainbow color mapping for risk levels
                            const riskColors = {
                                'SAFE': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
                                'TARGET': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
                                'REACH': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' }
                            };

                            const colors = riskColors[riskLevel as keyof typeof riskColors] || riskColors['TARGET'];

                            return (
                                <motion.div
                                    key={uni.id || uni.name + idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="group relative"
                                >
                                    {/* Premium Glass Card with Rainbow Glow */}
                                    <div className={`glass-card-premium p-8 h-full flex flex-col relative overflow-hidden border-rainbow hover:scale-[1.02] transition-all duration-300 ${colors.glow} shadow-2xl`}>

                                        {/* Animated Background Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Content Container */}
                                        <div className="relative z-10 flex flex-col h-full">

                                            {/* Header: Ranking Badge */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${colors.bg} ${colors.border} border backdrop-blur-sm`}>
                                                    <Trophy className={`w-4 h-4 ${colors.text}`} />
                                                    <span className={`text-xs font-black ${colors.text} tracking-wider`}>
                                                        #{uni.ranking || '???'}
                                                    </span>
                                                </div>

                                                <div className={`px-4 py-2 rounded-xl ${colors.bg} ${colors.border} border backdrop-blur-sm`}>
                                                    <span className={`text-xs font-black ${colors.text} tracking-wider uppercase`}>
                                                        {riskLevel}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* University Name */}
                                            <h3 className="text-2xl font-black text-white mb-3 leading-tight tracking-tight group-hover:gradient-rainbow transition-all duration-300">
                                                {uni.name}
                                            </h3>

                                            {/* Location */}
                                            <div className="flex items-center text-xs font-bold text-text-sub mb-6 uppercase tracking-wide">
                                                <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                                                {uni.city ? `${uni.city}, ` : ''}{uni.country}
                                            </div>

                                            {/* Probability Score - Large & Centered */}
                                            <div className="flex items-center justify-center py-8 mb-6 bg-white/[0.02] rounded-2xl border border-white/5 backdrop-blur-sm">
                                                <div className="text-center">
                                                    <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Match Score</p>
                                                    <p className={`text-6xl font-black ${colors.text} tracking-tighter`}>
                                                        {isGlobal ? '??' : `${fitScore}%`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Stats Grid - Compact */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
                                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-1">Acceptance</p>
                                                    <p className="text-xl font-black text-white">{uni.acceptance_rate || '---'}%</p>
                                                </div>
                                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
                                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-1">Tuition</p>
                                                    <p className="text-xl font-black text-emerald-400">
                                                        {uni.tuition_fee_min ? `$${(uni.tuition_fee_min / 1000).toFixed(0)}K+` : '---'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* AI Insight - Simplified */}
                                            <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-xl p-4 mb-6 relative backdrop-blur-sm">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/40">
                                                        <Sparkles className="w-4 h-4 text-white" />
                                                    </div>
                                                    <p className="text-[11px] font-medium text-indigo-200 leading-relaxed">
                                                        {isGlobal
                                                            ? "Global node detected. Import to analyze compatibility."
                                                            : `GPA ${userProfile?.gpa || 'N/A'} ${userProfile?.gpa >= (uni.min_gpa || 3.0) ? 'exceeds' : 'meets'} requirement (${uni.min_gpa || 3.0})`
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Buttons - Spacer */}
                                            <div className="mt-auto flex gap-3">
                                                <Button
                                                    className={`flex-1 h-14 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl ${colors.glow} bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-t border-white/20 group/btn`}
                                                    onClick={() => handleShortlist(uni)}
                                                    disabled={isImporting}
                                                >
                                                    <Bookmark className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                                    {isGlobal ? 'Import' : 'Shortlist'}
                                                </Button>
                                                <button
                                                    onClick={() => window.open(uni.website || `https://www.google.com/search?q=${uni.name}`, '_blank')}
                                                    className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group/link"
                                                >
                                                    <ExternalLink className="w-5 h-5 text-white/40 group-hover/link:text-white transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
