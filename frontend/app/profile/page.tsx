'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { profileAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Save, GraduationCap, Briefcase, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await profileAPI.update(formData);
            toast.success('Profile updated successfully');
            router.push('/dashboard');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
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
        <div className="min-h-screen pb-20 bg-bg-dark">
            <Toaster position="top-right" />

            {/* Header */}
            <nav className="sticky top-0 z-50 border-b border-white/[0.05] bg-bg-dark/80 backdrop-blur-xl">
                <div className="container-custom h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-text-sub" />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight">Edit Profile</h1>
                    </div>
                    <Button onClick={handleSave} isLoading={isSaving} size="sm" className="rounded-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </div>
            </nav>

            <main className="container-custom pt-12 max-w-4xl">
                <form onSubmit={handleSave} className="space-y-16">
                    {/* Academic Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h2 className="text-sm font-bold text-text-dim uppercase tracking-[0.2em]">Academic Background</h2>
                        </div>
                        <Card className="grid md:grid-cols-2 gap-8 bg-white/[0.02] border-white/5">
                            <Input
                                label="Education Level"
                                value={formData.education_level || ''}
                                onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                            <Input
                                label="Current Degree"
                                value={formData.degree || ''}
                                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                            <Input
                                label="Major / Field"
                                value={formData.major || ''}
                                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="GPA"
                                    type="number"
                                    step="0.01"
                                    value={formData.gpa || ''}
                                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                    className="bg-white/[0.03]"
                                />
                                <Input
                                    label="Class Of"
                                    type="number"
                                    value={formData.graduation_year || ''}
                                    onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                                    className="bg-white/[0.03]"
                                />
                            </div>
                        </Card>
                    </section>

                    {/* Goals Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-sm font-bold text-text-dim uppercase tracking-[0.2em]">Study Goals</h2>
                        </div>
                        <Card className="grid md:grid-cols-2 gap-8 bg-white/[0.02] border-white/5">
                            <Input
                                label="Target Degree"
                                value={formData.intended_degree || ''}
                                onChange={(e) => setFormData({ ...formData, intended_degree: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                            <Input
                                label="Field of Study"
                                value={formData.field_of_study || ''}
                                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                            <Input
                                label="Target Intake"
                                type="number"
                                value={formData.target_intake_year || ''}
                                onChange={(e) => setFormData({ ...formData, target_intake_year: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                            <Input
                                label="Target Countries"
                                value={formData.preferred_countries || ''}
                                onChange={(e) => setFormData({ ...formData, preferred_countries: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                        </Card>
                    </section>

                    {/* Financials Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <DollarSign className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-sm font-bold text-text-dim uppercase tracking-[0.2em]">Financial Planning</h2>
                        </div>
                        <Card className="grid md:grid-cols-3 gap-8 bg-white/[0.02] border-white/5">
                            <Input
                                label="Min Budget ($)"
                                type="number"
                                value={formData.budget_min || ''}
                                onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                            <Input
                                label="Max Budget ($)"
                                type="number"
                                value={formData.budget_max || ''}
                                onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                            <Input
                                label="Funding Plan"
                                value={formData.funding_plan || ''}
                                onChange={(e) => setFormData({ ...formData, funding_plan: e.target.value })}
                                className="bg-white/[0.03]"
                            />
                        </Card>
                    </section>

                    {/* Readiness Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Award className="w-5 h-5 text-amber-400" />
                            </div>
                            <h2 className="text-sm font-bold text-text-dim uppercase tracking-[0.2em]">Exams & Readiness</h2>
                        </div>
                        <Card className="space-y-12 bg-white/[0.02] border-white/5">
                            <div className="grid md:grid-cols-4 gap-8">
                                <Input label="IELTS" value={formData.ielts_score || ''} onChange={(e) => setFormData({ ...formData, ielts_score: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="TOEFL" value={formData.toefl_score || ''} onChange={(e) => setFormData({ ...formData, toefl_score: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="GRE" value={formData.gre_score || ''} onChange={(e) => setFormData({ ...formData, gre_score: e.target.value })} className="bg-white/[0.03]" />
                                <Input label="GMAT" value={formData.gmat_score || ''} onChange={(e) => setFormData({ ...formData, gmat_score: e.target.value })} className="bg-white/[0.03]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-dim uppercase tracking-widest mb-3">Statement of Purpose Status</label>
                                <select
                                    className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-indigo-600/50 transition-all"
                                    value={formData.sop_status || ''}
                                    onChange={(e) => setFormData({ ...formData, sop_status: e.target.value })}
                                >
                                    <option value="Not started">Not started</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Ready">Ready</option>
                                </select>
                            </div>
                        </Card>
                    </section>

                    <div className="flex items-center justify-between pt-10">
                        <p className="text-xs text-text-dim font-bold uppercase tracking-widest italic">
                            Updated data will recalculate your AI recommendations.
                        </p>
                        <Button type="submit" size="lg" isLoading={isSaving} className="rounded-full px-12">
                            Update Profile
                            <ArrowUpRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
