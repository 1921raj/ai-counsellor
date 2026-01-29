'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { profileAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Save, GraduationCap, Briefcase, DollarSign, Award, ArrowUpRight, Info, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [gpaScale, setGpaScale] = useState('4.0');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await profileAPI.get();
            setFormData(res.data);
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        console.log('⏳ Saving profile data...', formData);

        try {
            const safeParseFloat = (val: any) => {
                const parsed = parseFloat(val);
                return isNaN(parsed) ? null : parsed;
            };

            const safeParseInt = (val: any) => {
                const parsed = parseInt(val);
                return isNaN(parsed) ? null : parsed;
            };

            const rawGpa = safeParseFloat(formData.gpa);
            const standardizedGpa = rawGpa !== null
                ? (gpaScale === '10.0' ? rawGpa * 0.4 : rawGpa)
                : null;

            const dataToUpdate = {
                ...formData,
                gpa: standardizedGpa,
                age: safeParseInt(formData.age),
                graduation_year: safeParseInt(formData.graduation_year),
                target_intake_year: safeParseInt(formData.target_intake_year),
                budget_min: safeParseFloat(formData.budget_min),
                budget_max: safeParseFloat(formData.budget_max),
                ielts_score: safeParseFloat(formData.ielts_score),
                toefl_score: safeParseInt(formData.toefl_score),
                gre_score: safeParseInt(formData.gre_score),
                gmat_score: safeParseInt(formData.gmat_score),
            };

            await profileAPI.update(dataToUpdate);
            toast.success('Profile updated successfully');

            setTimeout(() => {
                router.push('/dashboard');
                setTimeout(() => {
                    if (window.location.pathname !== '/dashboard') {
                        window.location.href = '/dashboard';
                    }
                }, 2000);
            }, 500);

        } catch (error: any) {
            console.error('❌ Save error:', error);
            const errorMsg = error.response?.data?.detail || 'Failed to update profile';
            toast.error(errorMsg);
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-dark text-white">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-bg-dark relative overflow-x-hidden">
            <div className="fixed inset-0 -z-10 mesh-gradient opacity-30" />
            <Toaster position="top-right" />

            {/* Header */}
            <nav className="sticky top-0 z-50 border-b border-white/[0.05] bg-bg-dark/80 backdrop-blur-xl">
                <div className="container-custom h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => router.push('/dashboard')} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group">
                            <ArrowLeft className="w-5 h-5 text-text-sub group-hover:text-white" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">Profile Protocol</h1>
                        </div>
                    </div>
                    <Button onClick={() => handleSave()} isLoading={isSaving} size="sm" className="rounded-2xl h-11 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20">
                        <Save className="w-4 h-4 mr-2" />
                        Deploy Changes
                    </Button>
                </div>
            </nav>

            <main className="container-custom pt-12 max-w-4xl">
                <form onSubmit={(e) => handleSave(e)} className="space-y-20">
                    {/* Academic Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                <GraduationCap className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-white uppercase">Academic Base</h2>
                                <p className="text-xs font-bold text-text-dim uppercase tracking-widest">Neural profile foundations</p>
                            </div>
                        </div>
                        <div className="p-1 border-glow rounded-[2.5rem] bg-white/[0.02]">
                            <div className="grid md:grid-cols-2 gap-8 bg-[#0c0c0e] rounded-[calc(2.5rem-1px)] p-10">
                                <Input label="Age" type="number" value={formData.age || ''} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="Education Level" value={formData.education_level || ''} onChange={(e) => setFormData({ ...formData, education_level: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="Current Degree" value={formData.degree || ''} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="Major / Field" value={formData.major || ''} onChange={(e) => setFormData({ ...formData, major: e.target.value })} className="bg-white/[0.03]" />
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-text-dim uppercase tracking-widest">GPA / CGPA</label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.gpa || ''}
                                                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-indigo-600/50 transition-all text-white"
                                                />
                                                <select
                                                    value={gpaScale}
                                                    onChange={(e) => setGpaScale(e.target.value)}
                                                    className="w-32 h-14 bg-[#111] border border-white/10 rounded-2xl px-3 text-[10px] font-black focus:outline-none focus:border-indigo-600/50 transition-all text-white cursor-pointer uppercase"
                                                >
                                                    <option value="4.0">/ 4.0</option>
                                                    <option value="10.0">/ 10.0</option>
                                                </select>
                                            </div>
                                        </div>
                                        <Input label="Class Of" type="number" value={formData.graduation_year || ''} onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })} className="bg-white/[0.03]" />
                                    </div>
                                    {formData.gpa && gpaScale === '10.0' && (
                                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center space-x-3 backdrop-blur-md">
                                            <Info className="w-5 h-5 text-indigo-400" />
                                            <p className="text-[10px] font-black text-indigo-200/60 uppercase tracking-[0.2em]">
                                                Converted: {(parseFloat(formData.gpa) * 0.4).toFixed(2)} / 4.0 Standard
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Goals Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                <Briefcase className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-white uppercase">Study Goals</h2>
                                <p className="text-xs font-bold text-text-dim uppercase tracking-widest">Targeting global excellence</p>
                            </div>
                        </div>
                        <div className="p-1 border-glow rounded-[2.5rem] bg-white/[0.02]">
                            <div className="grid md:grid-cols-2 gap-8 bg-[#0c0c0e] rounded-[calc(2.5rem-1px)] p-10">
                                <Input label="Target Degree" value={formData.intended_degree || ''} onChange={(e) => setFormData({ ...formData, intended_degree: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="Field of Study" value={formData.field_of_study || ''} onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="Target Intake" type="number" value={formData.target_intake_year || ''} onChange={(e) => setFormData({ ...formData, target_intake_year: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="Target Countries" value={formData.preferred_countries || ''} onChange={(e) => setFormData({ ...formData, preferred_countries: e.target.value })} className="bg-white/[0.03]" />
                            </div>
                        </div>
                    </section>

                    {/* Financials Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <DollarSign className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-white uppercase">Financial Intel</h2>
                                <p className="text-xs font-bold text-text-dim uppercase tracking-widest">Budgeting foundations</p>
                            </div>
                        </div>
                        <div className="p-1 border-glow rounded-[2.5rem] bg-white/[0.02]">
                            <div className="grid md:grid-cols-3 gap-8 bg-[#0c0c0e] rounded-[calc(2.5rem-1px)] p-10">
                                <Input label="Min Budget ($)" type="number" value={formData.budget_min || ''} onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="Max Budget ($)" type="number" value={formData.budget_max || ''} onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="Funding Plan" value={formData.funding_plan || ''} onChange={(e) => setFormData({ ...formData, funding_plan: e.target.value })} className="bg-white/[0.03]" />
                            </div>
                        </div>
                    </section>

                    {/* Readiness Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                <Award className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-white uppercase">Exams & Readiness</h2>
                                <p className="text-xs font-bold text-text-dim uppercase tracking-widest">Validation protocols</p>
                            </div>
                        </div>
                        <div className="p-1 border-glow rounded-[2.5rem] bg-white/[0.02]">
                            <div className="space-y-12 bg-[#0c0c0e] rounded-[calc(2.5rem-1px)] p-10">
                                <div className="grid md:grid-cols-4 gap-8">
                                    <Input label="IELTS Score" value={formData.ielts_score || ''} onChange={(e) => setFormData({ ...formData, ielts_score: e.target.value })} className="bg-white/[0.03]" />
                                    <Input label="TOEFL Score" value={formData.toefl_score || ''} onChange={(e) => setFormData({ ...formData, toefl_score: e.target.value })} className="bg-white/[0.03]" />
                                    <Input label="GRE Score" value={formData.gre_score || ''} onChange={(e) => setFormData({ ...formData, gre_score: e.target.value })} className="bg-white/[0.03]" />
                                    <Input label="GMAT Score" value={formData.gmat_score || ''} onChange={(e) => setFormData({ ...formData, gmat_score: e.target.value })} className="bg-white/[0.03]" />
                                </div>
                                <div className="border-t border-white/5 pt-8">
                                    <label className="block text-[10px] font-black text-text-dim uppercase tracking-[0.3em] mb-4">SOP / Statement Status</label>
                                    <select
                                        className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-indigo-600/50 transition-all cursor-pointer"
                                        value={formData.sop_status || ''}
                                        onChange={(e) => setFormData({ ...formData, sop_status: e.target.value })}
                                    >
                                        <option value="Not started">Phase 0: Not Started</option>
                                        <option value="Draft">Phase 1: Draft Alpha</option>
                                        <option value="Ready">Phase 2: Final Release</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
                        <div className="flex items-center space-x-4 opacity-50">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">AI Matching Engine Status: Ready</p>
                        </div>
                        <Button onClick={() => handleSave()} size="lg" isLoading={isSaving} className="w-full md:w-auto px-16 h-20 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/40">
                            Update Protocol
                            <ArrowUpRight className="ml-3 w-6 h-6" />
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
