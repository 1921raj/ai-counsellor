'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { profileAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Personal Details', description: 'Your basic information' },
    { id: 2, title: 'Academic Background', description: 'Tell us about your education' },
    { id: 3, title: 'Study Goals', description: 'What do you want to study?' },
    { id: 4, title: 'Budget & Funding', description: 'Financial planning' },
    { id: 5, title: 'Exams & Readiness', description: 'Test scores and preparation' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Personal Details
        full_name: '',
        email: '',
        age: '',

        // Academic Background
        education_level: '',
        degree: '',
        major: '',
        graduation_year: new Date().getFullYear(),
        gpa: '',

        // Study Goals
        intended_degree: '',
        field_of_study: '',
        target_intake_year: new Date().getFullYear() + 1,
        preferred_countries: '',

        // Budget
        budget_min: '',
        budget_max: '',
        funding_plan: '',

        // Exams
        ielts_score: '',
        toefl_score: '',
        gre_score: '',
        gmat_score: '',
        sop_status: '',
    });

    // Load user data on mount
    useState(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setFormData(prev => ({
                        ...prev,
                        full_name: user.full_name || '',
                        email: user.email || ''
                    }));
                } catch (e) {
                    console.error('Error parsing user data', e);
                }
            }
        }
    });

    const handleNext = () => {
        // Validation for Budget Step (Step 4)
        if (currentStep === 4) {
            const min = parseFloat(formData.budget_min);
            const max = parseFloat(formData.budget_max);
            if (!isNaN(min) && !isNaN(max) && min > max) {
                toast.error('Minimum budget cannot be greater than maximum budget');
                return;
            }
        }

        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            // Convert string numbers to actual numbers
            const profileData = {
                ...formData,
                age: formData.age ? parseInt(formData.age.toString()) : null,
                graduation_year: parseInt(formData.graduation_year.toString()),
                target_intake_year: parseInt(formData.target_intake_year.toString()),
                gpa: formData.gpa ? parseFloat(formData.gpa) : null,
                budget_min: parseFloat(formData.budget_min),
                budget_max: parseFloat(formData.budget_max),
                ielts_score: formData.ielts_score ? parseFloat(formData.ielts_score) : null,
                toefl_score: formData.toefl_score ? parseInt(formData.toefl_score) : null,
                gre_score: formData.gre_score ? parseInt(formData.gre_score) : null,
                gmat_score: formData.gmat_score ? parseInt(formData.gmat_score) : null,
            };

            await profileAPI.create(profileData);
            toast.success('Profile created successfully!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to create profile');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <Input
                            label="Full Name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            disabled // Typically name/email from signup are immutable here, or simplify by allowing edit
                            className="opacity-60 cursor-not-allowed"
                        />

                        <Input
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled
                            className="opacity-60 cursor-not-allowed"
                        />

                        <Input
                            label="Age"
                            type="number"
                            placeholder="e.g., 22"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            required
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Education Level</label>
                            <select
                                className="w-full px-4 py-3 bg-[#1e1e3f] border border-[#2d2d4a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.education_level}
                                onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                                required
                            >
                                <option value="" className="text-gray-500">Select level</option>
                                <option value="High School">High School</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Postgraduate">Postgraduate</option>
                            </select>
                        </div>

                        <Input
                            label="Current Degree"
                            placeholder="e.g., Bachelor of Science"
                            value={formData.degree}
                            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                            required
                        />

                        <Input
                            label="Major/Field"
                            placeholder="e.g., Computer Science"
                            value={formData.major}
                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Graduation Year"
                                type="number"
                                value={formData.graduation_year}
                                onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) })}
                                required
                            />

                            <Input
                                label="GPA (Optional)"
                                type="number"
                                step="0.01"
                                placeholder="e.g., 3.5"
                                value={formData.gpa}
                                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Intended Degree</label>
                            <select
                                className="w-full px-4 py-3 bg-[#1e1e3f] border border-[#2d2d4a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.intended_degree}
                                onChange={(e) => setFormData({ ...formData, intended_degree: e.target.value })}
                                required
                            >
                                <option value="">Select degree</option>
                                <option value="Bachelor's">Bachelor's</option>
                                <option value="Master's">Master's</option>
                                <option value="MBA">MBA</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </div>

                        <Input
                            label="Field of Study"
                            placeholder="e.g., Computer Science, Business"
                            value={formData.field_of_study}
                            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                            required
                        />

                        <Input
                            label="Target Intake Year"
                            type="number"
                            value={formData.target_intake_year}
                            onChange={(e) => setFormData({ ...formData, target_intake_year: parseInt(e.target.value) })}
                            required
                        />

                        <Input
                            label="Preferred Countries (comma-separated)"
                            placeholder="e.g., USA, UK, Canada"
                            value={formData.preferred_countries}
                            onChange={(e) => setFormData({ ...formData, preferred_countries: e.target.value })}
                            required
                        />
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Minimum Budget (USD/year)"
                                type="number"
                                placeholder="20000"
                                value={formData.budget_min}
                                onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                                required
                            />

                            <Input
                                label="Maximum Budget (USD/year)"
                                type="number"
                                placeholder="50000"
                                value={formData.budget_max}
                                onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Funding Plan</label>
                            <select
                                className="w-full px-4 py-3 bg-[#1e1e3f] border border-[#2d2d4a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.funding_plan}
                                onChange={(e) => setFormData({ ...formData, funding_plan: e.target.value })}
                                required
                            >
                                <option value="">Select funding plan</option>
                                <option value="Self-funded">Self-funded</option>
                                <option value="Scholarship-dependent">Scholarship-dependent</option>
                                <option value="Loan-dependent">Loan-dependent</option>
                                <option value="Mixed">Mixed (Self + Scholarship/Loan)</option>
                            </select>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-8">
                        {/* Intro Note */}
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                            <p className="text-sm text-indigo-200">
                                <strong>Note:</strong> These scores help us match you with universities that fit your profile.
                                Don't worry if you haven't taken them yet; you can update this later.
                            </p>
                        </div>

                        {/* English Proficiency */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">English Proficiency</h3>
                                <p className="text-sm text-gray-400">Most international universities require proof of English skills.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="IELTS Score"
                                    type="number"
                                    step="0.5"
                                    placeholder="e.g. 7.5"
                                    value={formData.ielts_score}
                                    onChange={(e) => setFormData({ ...formData, ielts_score: e.target.value })}
                                />
                                <Input
                                    label="TOEFL Score"
                                    type="number"
                                    placeholder="e.g. 100"
                                    value={formData.toefl_score}
                                    onChange={(e) => setFormData({ ...formData, toefl_score: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Aptitude Tests */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Standardized Tests</h3>
                                <p className="text-sm text-gray-400">GRE/GMAT may be required for some graduate programs.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="GRE Score"
                                    type="number"
                                    placeholder="e.g. 320"
                                    value={formData.gre_score}
                                    onChange={(e) => setFormData({ ...formData, gre_score: e.target.value })}
                                />
                                <Input
                                    label="GMAT Score"
                                    type="number"
                                    placeholder="e.g. 700"
                                    value={formData.gmat_score}
                                    onChange={(e) => setFormData({ ...formData, gmat_score: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* SOP */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Statement of Purpose (SOP)</h3>
                                <p className="text-sm text-gray-400">Your personal essay to the admission committee.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Current Status</label>
                                <select
                                    className="w-full px-4 py-3 bg-[#1e1e3f] border border-[#2d2d4a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.sop_status}
                                    onChange={(e) => setFormData({ ...formData, sop_status: e.target.value })}
                                    required
                                >
                                    <option value="" className="text-gray-500">Select status</option>
                                    <option value="Not started">I haven't started yet</option>
                                    <option value="Draft">I have a draft</option>
                                    <option value="Ready">It's ready to submit</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );


            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen py-12 px-6">
            <Toaster position="top-right" />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Complete Your Profile</h1>
                    <p className="text-gray-400">Help us understand your background and goals</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.id
                                            ? 'bg-indigo-500 border-indigo-500 text-white'
                                            : 'border-gray-600 text-gray-600'
                                            }`}
                                    >
                                        {currentStep > step.id ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <span className="font-bold">{step.id}</span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-center hidden md:block">
                                        <p className="text-sm font-medium text-gray-300">{step.title}</p>
                                        <p className="text-xs text-gray-500">{step.description}</p>
                                    </div>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`h-1 flex-1 mx-2 transition-all ${currentStep > step.id ? 'bg-indigo-500' : 'bg-gray-700'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">{STEPS[currentStep - 1].title}</h2>
                        <p className="text-gray-400">{STEPS[currentStep - 1].description}</p>
                    </div>

                    {renderStep()}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div className="text-sm text-gray-400">
                            Step {currentStep} of {STEPS.length}
                        </div>

                        <Button
                            onClick={handleNext}
                            isLoading={isLoading && currentStep === 5}
                        >
                            {currentStep === 5 ? 'Complete' : 'Next'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
