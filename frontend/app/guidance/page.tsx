'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { shortlistAPI, universityAPI, taskAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import {
    ArrowLeft,
    Lock,
    FileText,
    Calendar,
    CheckCircle,
    Clock,
    ExternalLink,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';

export default function GuidancePage() {
    const router = useRouter();
    const [lockedUni, setLockedUni] = useState<any>(null);
    const [details, setDetails] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [shortlistRes, uniRes, tasksRes] = await Promise.all([
                shortlistAPI.getAll(),
                universityAPI.getAll(),
                taskAPI.getAll()
            ]);

            const lockedS = shortlistRes.data.find((s: any) => s.is_locked);
            if (lockedS) {
                setLockedUni(lockedS);
                const uniDetails = uniRes.data.find((u: any) => u.id === lockedS.university_id);
                setDetails(uniDetails);
                setTasks(tasksRes.data);
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                toast.error('Failed to load guidance data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleTaskComplete = async (taskId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            await taskAPI.update(taskId, { status: newStatus });
            toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task restored');
            // Refresh tasks
            const res = await taskAPI.getAll();
            setTasks(res.data);
        } catch (error) {
            toast.error('Update failed');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    if (!lockedUni) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center py-12">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Feature Locked</h2>
                    <p className="text-gray-400 mb-8">
                        Detailed application guidance, document checklists, and personalized timelines are only available after you "Lock" a university choice in your shortlist.
                    </p>
                    <div className="space-y-4">
                        <Button onClick={() => router.push('/shortlist')} className="w-full">
                            Go to Shortlist
                        </Button>
                        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="w-full">
                            Back to Dashboard
                        </Button>
                    </div>
                </Card>
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
                            <h1 className="text-2xl font-bold">Application Strategy</h1>
                        </div>
                        <div className="flex items-center text-sm font-semibold bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full border border-green-500/20">
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Target: {details?.name}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Strategy Overview */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <FileText className="w-6 h-6 mr-3 text-indigo-400" />
                                Step-by-Step Strategy
                            </h2>
                            <Card className="p-0 overflow-hidden">
                                {[
                                    {
                                        step: '01',
                                        title: 'Document Preparation',
                                        desc: 'Gather academic transcripts, get 2-3 Letters of Recommendation (LORs), and finalize your Statement of Purpose (SOP).',
                                        status: 'current'
                                    },
                                    {
                                        step: '02',
                                        title: 'Entrance Examinations',
                                        desc: `Complete your ${details?.min_ielts ? 'IELTS/TOEFL' : 'standardized'} tests and ensure scores are sent to ${details?.name}.`,
                                        status: 'pending'
                                    },
                                    {
                                        step: '03',
                                        title: 'Financial Documentation',
                                        desc: 'Prepare bank statements or loan sanction letters to prove you meet the $' + (details?.tuition_fee_max + details?.living_cost_yearly).toLocaleString() + ' yearly requirement.',
                                        status: 'pending'
                                    },
                                    {
                                        step: '04',
                                        title: 'Online Application',
                                        desc: `Fill out the portal at ${details?.website}. Pay the application fee and submit before the target intake.`,
                                        status: 'pending'
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className={`p-6 border-b border-[#2d2d4a] last:border-0 ${item.status === 'current' ? 'bg-indigo-500/5' : ''}`}>
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${item.status === 'current' ? 'bg-indigo-500 text-white' : 'bg-[#252540] text-gray-500 border border-[#2d2d4a]'
                                                }`}>
                                                {item.step}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold ${item.status === 'current' ? 'text-white' : 'text-gray-400'}`}>
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </section>

                        {/* Application Tasks */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                Actionable To-Dos
                            </h2>
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <Card key={task.id} className={`hover:bg-[#252540] transition-colors cursor-pointer ${task.status === 'completed' ? 'opacity-50' : ''}`} onClick={() => handleTaskComplete(task.id, task.status)}>
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-600'
                                                }`}>
                                                {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-bold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                                                    {task.title}
                                                </h4>
                                                <p className="text-sm text-gray-400">{task.description}</p>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Due: ASAP
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Institution Card */}
                        <section>
                            <h3 className="text-lg font-bold mb-4">Institution Info</h3>
                            <Card className="bg-indigo-600/10 border-indigo-500/20">
                                <h4 className="font-bold text-xl mb-2">{details?.name}</h4>
                                <p className="text-sm text-gray-400 mb-6">{details?.description}</p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Acceptance Rate</span>
                                        <span className="font-bold text-indigo-400">{details?.acceptance_rate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">World Ranking</span>
                                        <span className="font-bold text-indigo-400">#{details?.ranking}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Est. Annual Cost</span>
                                        <span className="font-bold text-green-400">${(details?.tuition_fee_max + details?.living_cost_yearly).toLocaleString()}</span>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full mt-6" onClick={() => window.open(details?.website, '_blank')}>
                                    Official Website
                                    <ExternalLink className="w-3 h-3 ml-2" />
                                </Button>
                            </Card>
                        </section>

                        {/* Document Checklist */}
                        <section>
                            <h3 className="text-lg font-bold mb-4">Required Documents</h3>
                            <Card className="space-y-3">
                                {[
                                    'Official Transcripts',
                                    'Statement of Purpose (SOP)',
                                    'Letters of Rec (3)',
                                    'Test Score Reports',
                                    'Proof of Finances',
                                    'Passport Scan'
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center space-x-3 text-sm text-gray-300">
                                        <div className="w-4 h-4 rounded-full border border-gray-600" />
                                        <span>{doc}</span>
                                    </div>
                                ))}
                            </Card>
                        </section>

                        {/* AI Advisor Note */}
                        <section>
                            <Card className="bg-purple-600/10 border-purple-500/20">
                                <div className="flex items-center space-x-2 mb-3">
                                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                                    <span className="font-bold text-purple-300 text-sm uppercase tracking-wider">AI Strategist</span>
                                </div>
                                <p className="text-sm text-gray-300 italic">
                                    "Since this is a {lockedUni.category} school for you, I recommend focusing heavily on your SOP. Highlight your research in {(() => {
                                        if (!details?.programs) return 'your field';
                                        try {
                                            const p = JSON.parse(details.programs);
                                            return Array.isArray(p) ? p[0] : p;
                                        } catch {
                                            return details.programs.split(',')[0].trim();
                                        }
                                    })()} to differentiate yourself from other high-GPA applicants."
                                </p>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
