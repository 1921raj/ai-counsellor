'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { universityAPI, shortlistAPI, profileAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import toast, { Toaster } from 'react-hot-toast';
import { Search, MapPin, GraduationCap, DollarSign, Bookmark, ArrowLeft, Filter, Sparkles, X, Globe, BookOpen, UserCheck, Activity, Send, Info, ExternalLink, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UniversitiesPage() {
    const router = useRouter();
    const [universities, setUniversities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [selectedUni, setSelectedUni] = useState<any>(null);
    const [isGlobalSearch, setIsGlobalSearch] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [gridCols, setGridCols] = useState(4);

    const [filters, setFilters] = useState({
        country: '',
        name: '',
        major: '',
        max_tuition: '',
        scholarship: false
    });

    useEffect(() => {
        fetchProfile();
        fetchUniversities();
    }, [isGlobalSearch]);

    const fetchProfile = async () => {
        try {
            const res = await profileAPI.get();
            setUserProfile(res.data);
        } catch (err) { }
    };

    const fetchUniversities = async () => {
        setIsLoading(true);
        try {
            if (isGlobalSearch) {
                const response = await universityAPI.searchGlobal({
                    country: filters.country,
                    name: filters.name,
                    limit: 20 // 4x5 grid
                });
                setUniversities(response.data);
            } else {
                const params: any = {};
                if (filters.name) params.name = filters.name;
                if (filters.country) params.country = filters.country;
                if (filters.major) params.major = filters.major;
                if (filters.max_tuition) params.max_tuition = parseFloat(filters.max_tuition);
                if (filters.scholarship) params.scholarship = true;

                const response = await universityAPI.getAll(params);
                setUniversities(response.data);
            }
        } catch (error: any) {
            console.error('Fetch error:', error);
            const msg = error.response?.data?.detail || error.message || 'Unknown error';
            toast.error(`Error: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShortlist = async (uni: any) => {
        try {
            let targetUni = uni;

            if (isGlobalSearch || !uni.id) {
                setIsImporting(true);
                const loadingToast = toast.loading('Enriching data with AI...', { id: 'import' });
                const importRes = await universityAPI.importExternal(uni);
                targetUni = importRes.data;
                toast.success('Data enriched!', { id: 'import' });
            }

            await shortlistAPI.add({
                university_id: targetUni.id,
                category: 'target',
                fit_score: calculateFitScore(targetUni),
                risk_level: calculateRiskLevel(targetUni),
                ai_reasoning: generateReasoning(targetUni)
            });
            toast.success('University shortlisted!');
            setIsImporting(false);
            if (isGlobalSearch) fetchUniversities(); // Refresh to show local ID if needed
        } catch (error: any) {
            setIsImporting(false);
            toast.dismiss('import');
            toast.error(error.response?.data?.detail || 'Failed to shortlist');
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
        if (!userProfile) return `Based on our data, ${uni.name} is a strong choice.`;
        return `"Your GPA (${userProfile.gpa}) ${userProfile.gpa >= uni.min_gpa ? 'meets or exceeds' : 'is slightly below'} the requirement (${uni.min_gpa || 3.0}). This university represents a ${calculateRiskLevel(uni).toLowerCase()} match for your academic profile."`;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUniversities();
    };

    return (
        <div className="min-h-screen pb-20 bg-[#080808] text-text-main">
            <Toaster position="top-right" />

            <nav className="sticky top-0 z-50 border-b border-white/[0.05] bg-black/80 backdrop-blur-xl">
                <div className="container-custom h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-xl font-bold font-heading uppercase tracking-tighter">Institution Discovery</h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Grid Size Controls */}
                        <div className="hidden xl:flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                            {[2, 3, 4].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setGridCols(n)}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${gridCols === n ? 'bg-white/10 text-white' : 'text-text-dim hover:text-white'}`}
                                >
                                    {n} COL
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setIsGlobalSearch(false)}
                                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isGlobalSearch ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-text-dim hover:text-white'}`}
                            >
                                Verified
                            </button>
                            <button
                                onClick={() => setIsGlobalSearch(true)}
                                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isGlobalSearch ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-text-dim hover:text-white'}`}
                            >
                                Global
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container-custom pt-8">
                {/* Search Bar */}
                <Card className="glass-card mb-12 p-1 bg-white/[0.01] border-white/5 rounded-[2rem]">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4 p-4">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
                            <input
                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                placeholder={isGlobalSearch ? "Search any university in the world..." : "Search by name or country..."}
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            />
                        </div>
                        <Button type="submit" isLoading={isLoading} className="h-16 px-12 rounded-2xl bg-indigo-600 group">
                            <span className="font-black uppercase tracking-widest text-[11px]">Execute Search</span>
                        </Button>
                    </form>
                </Card>

                {/* Results Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-6" />
                        <p className="text-xs font-black text-text-dim uppercase tracking-[0.3em] animate-pulse">Scanning Databases...</p>
                    </div>
                ) : (
                    <div className={`grid md:grid-cols-2 ${gridCols === 2 ? 'lg:grid-cols-2' : gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-10`}>
                        {universities.map((uni, idx) => {
                            const fitScore = calculateFitScore(uni);
                            const riskLevel = calculateRiskLevel(uni);
                            const isGlobal = isGlobalSearch || !uni.id;

                            return (
                                <motion.div
                                    key={uni.id || uni.name + idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <div className="bg-[#0f0f0f] border border-white/[0.08] rounded-[2.5rem] p-10 relative overflow-hidden group">
                                        {/* Top Meta */}
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${riskLevel.toUpperCase() === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' : riskLevel.toUpperCase() === 'REACH' ? 'bg-orange-500/20 text-orange-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                    {riskLevel.toUpperCase()}
                                                </span>
                                                <span className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    <Star className="w-3.5 h-3.5 mr-1.5 text-orange-400 fill-orange-400" />
                                                    RANK #{uni.ranking || 'TBD'}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">FIT SCORE</p>
                                                <p className="text-4xl font-black text-white leading-none tracking-tighter">{isGlobal ? '--' : `${fitScore}%`}</p>
                                            </div>
                                        </div>

                                        {/* Title & Info */}
                                        <div className="mb-10">
                                            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase leading-none">{uni.name}</h3>
                                            <div className="flex items-center text-text-dim text-xs font-bold uppercase tracking-widest">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {uni.city ? `${uni.city.toUpperCase()}, ` : ''}{uni.country.toUpperCase()}
                                            </div>
                                        </div>

                                        {/* AI Box */}
                                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8 mb-10 relative group-hover:border-indigo-500/40 transition-colors">
                                            <div className="flex items-start space-x-4">
                                                <Sparkles className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                                                <p className="text-sm font-medium text-text-sub italic leading-relaxed">
                                                    {isGlobal ? "Global institution detected. Shortlist to trigger full AI profile match analysis and verify entry requirements." : generateReasoning(uni)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="grid grid-cols-3 gap-8 mb-10 border-b border-white/5 pb-10">
                                            <div>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">MIN GPA</p>
                                                <p className="text-xl font-black text-white">{uni.min_gpa || '3.0'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 text-center">ACCEPTANCE</p>
                                                <p className="text-xl font-black text-white text-center">{uni.acceptance_rate || '---'}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">EST. COST</p>
                                                <p className="text-xl font-black text-emerald-400">
                                                    {uni.tuition_fee_min ? `$${Math.round(uni.tuition_fee_min / 1000)}K+` : '---'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4">
                                            <Button
                                                className="flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-900/20 border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                onClick={() => handleShortlist(uni)}
                                                disabled={isImporting}
                                            >
                                                <span className="font-black uppercase tracking-[0.2em] text-[11px] flex items-center">
                                                    <Bookmark className="w-4 h-4 mr-3" />
                                                    {isGlobal ? 'Enrich & Shortlist' : 'Add to Shortlist'}
                                                </span>
                                            </Button>
                                            <button
                                                onClick={() => window.open(uni.website || `https://www.google.com/search?q=${uni.name}`, '_blank')}
                                                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </button>
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
