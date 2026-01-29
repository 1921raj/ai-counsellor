'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { dashboardAPI, taskAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
    GraduationCap,
    MessageSquare,
    Search,
    CheckCircle,
    Clock,
    Target,
    BookOpen,
    LogOut,
    User,
    ChevronRight,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const STAGE_INFO = {
    building_profile: {
        title: 'Building Profile',
        description: 'Establish your academic and financial foundation',
        progress: 25
    },
    discovering_universities: {
        title: 'Discovering Universities',
        description: 'Exploring AI-matched institutions for you',
        progress: 50
    },
    finalizing_universities: {
        title: 'Finalizing Selection',
        description: 'Shortlisting and committing to your targets',
        progress: 75
    },
    preparing_applications: {
        title: 'Preparing Applications',
        description: 'Executing document checklists and tasks',
        progress: 100
    }
};

export default function DashboardPage() {
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await dashboardAPI.get();
            setDashboardData(response.data);
            setTasks(response.data.tasks || []);

            if (!response.data.user.onboarding_completed) {
                router.push('/onboarding');
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                toast.error('Failed to load dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleTaskComplete = async (taskId: number) => {
        try {
            await taskAPI.update(taskId, { status: 'completed' });
            toast.success('Task marked as complete');
            fetchDashboard();
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-dark">
                <div className="spinner" />
            </div>
        );
    }

    if (!dashboardData) return null;

    const currentStage = dashboardData.current_stage || 'building_profile';
    const stageInfo = STAGE_INFO[currentStage as keyof typeof STAGE_INFO];

    return (
        <div className="min-h-screen pb-20">
            <Toaster position="top-right" />

            {/* Navigation / Header */}
            <nav className="sticky top-0 z-50 border-b border-white/[0.05] bg-bg-dark/80 backdrop-blur-xl">
                <div className="container-custom h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">AI Counsellor</span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-bold text-text-dim uppercase tracking-widest">Active Student</span>
                            <span className="text-sm font-bold text-text-main">{dashboardData.user.full_name}</span>
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden md:block" />
                        <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <LogOut className="w-5 h-5 text-text-sub" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container-custom pt-12">
                {/* Status Bar / Current Stage */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card mb-12 bg-indigo-600/[0.03]"
                >
                    <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">Current Milestone</span>
                            </div>
                            <h2 className="text-3xl font-black mb-2">{stageInfo.title}</h2>
                            <p className="text-text-sub font-medium">{stageInfo.description}</p>
                        </div>
                        <div className="min-w-[200px]">
                            <div className="flex items-end justify-between mb-3 leading-none">
                                <span className="text-xs font-bold text-text-dim uppercase">Overall Progress</span>
                                <span className="text-2xl font-black">{stageInfo.progress}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stageInfo.progress}%` }}
                                    className="h-full bg-indigo-600"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Primary Content Area */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Action Hub */}
                        <section>
                            <h3 className="text-sm font-bold text-text-dim uppercase tracking-widest mb-6">Action Hub</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: <MessageSquare />, label: "Chat", sub: "Get Advice", path: "/chat", color: "text-indigo-400" },
                                    { icon: <Search />, label: "Discover", sub: "Matches", path: "/universities", color: "text-purple-400" },
                                    { icon: <Target />, label: "Shortlist", sub: "Lock In", path: "/shortlist", color: "text-pink-400" },
                                    { icon: <BookOpen />, label: "Strategy", sub: "Guidance", path: "/guidance", color: "text-emerald-400", disabled: dashboardData.locked_count === 0 }
                                ].map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => !action.disabled && router.push(action.path)}
                                        className={`glass-card p-6 text-left hover:bg-white/[0.03] transition-all group ${action.disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className={`mb-6 p-3 w-fit rounded-xl bg-white/[0.03] ${action.color}`}>
                                            {action.icon}
                                        </div>
                                        <h4 className="font-bold text-sm mb-1">{action.label}</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] uppercase font-bold text-text-dim">{action.sub}</span>
                                            <ChevronRight className="w-3 h-3 text-text-dim group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Recent Tasks */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-text-dim uppercase tracking-widest">Active Roadmap</h3>
                                <button className="text-xs font-bold text-indigo-400 hover:underline">View All Tasks</button>
                            </div>
                            <div className="space-y-3">
                                {tasks.length === 0 ? (
                                    <div className="glass-card p-10 text-center">
                                        <CheckCircle className="w-10 h-10 mx-auto mb-4 text-text-dim opacity-30" />
                                        <p className="text-text-sub font-medium">All tasks completed! You're on track.</p>
                                    </div>
                                ) : (
                                    tasks.map((task) => (
                                        <div key={task.id} className="glass-card p-5 group flex items-start space-x-4 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                                            <button
                                                onClick={() => handleTaskComplete(task.id)}
                                                className="mt-1 w-6 h-6 border-2 border-white/10 rounded-lg hover:border-indigo-500 transition-colors flex flex-shrink-0 items-center justify-center group-hover:bg-indigo-600/10"
                                            >
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-text-main mb-1">{task.title}</h4>
                                                <p className="text-xs text-text-sub line-clamp-1">{task.description}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${task.priority >= 4 ? 'bg-error/10 text-error' : 'bg-white/5 text-text-dim'
                                                    }`}>
                                                    Priority {task.priority}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Profile Meta */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Profile Card */}
                        <section>
                            <h3 className="text-sm font-bold text-text-dim uppercase tracking-widest mb-6">Profile Snapshot</h3>
                            <Card className="glass-card border-none bg-white/[0.02]">
                                <div className="p-8 space-y-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                                            <div className="w-full h-full rounded-full bg-bg-card flex items-center justify-center">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{dashboardData.user.full_name}</h4>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs font-bold text-text-dim uppercase tracking-wider">{dashboardData.profile?.intended_degree} Applicant</span>
                                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{dashboardData.profile?.age} Years Old</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 pb-8 border-b border-white/5">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-text-dim uppercase">Shortlisted</span>
                                            <p className="text-2xl font-black">{dashboardData.shortlisted_count}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-text-dim uppercase">Locked</span>
                                            <p className="text-2xl font-black text-indigo-400">{dashboardData.locked_count}</p>
                                        </div>
                                    </div>

                                    {/* Evaluation */}
                                    <div className="space-y-6">
                                        {[
                                            { label: "Academic", level: dashboardData.profile_strength?.academic },
                                            { label: "Standardized Tests", level: dashboardData.profile_strength?.exam },
                                            { label: "Portfolio/SOP", level: dashboardData.profile_strength?.sop }
                                        ].map((stat, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-text-sub">{stat.label}</span>
                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${stat.level === 'strong' ? 'text-success bg-success/10' :
                                                        stat.level === 'average' ? 'text-warning bg-warning/10' : 'text-error bg-error/10'
                                                        }`}>{stat.level}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full">
                                                    <div className={`h-full rounded-full ${stat.level === 'strong' ? 'bg-success' : stat.level === 'average' ? 'bg-warning' : 'bg-error'
                                                        }`} style={{ width: stat.level === 'strong' ? '100%' : stat.level === 'average' ? '60%' : '30%' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-widest" onClick={() => router.push('/profile')}>
                                        Manage Profile
                                        <ArrowUpRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        </section>

                        {/* Recommendation Prompt */}
                        <Card className="glass-card border-indigo-500/20 bg-indigo-600/[0.02] p-8">
                            <h4 className="font-bold mb-3 flex items-center">
                                <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                                AI Insight
                            </h4>
                            <p className="text-sm text-text-sub font-medium leading-relaxed mb-6">
                                Based on your STRONG academic profile, you have a high probability for Top 50 institutions in the UK and Canada.
                            </p>
                            <Button size="sm" onClick={() => router.push('/universities')} className="w-full rounded-xl">
                                Explore Targets
                            </Button>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
