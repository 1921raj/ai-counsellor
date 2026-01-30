'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { universityAPI, shortlistAPI, profileAPI, chatAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX, GraduationCap, Target, ExternalLink, UserCheck } from 'lucide-react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Voice State
    const [isTTSActive, setIsTTSActive] = useState(true);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Initialize Speech Synthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    // Speech-to-Text Effect
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const response = await chatAPI.getHistory();
            setMessages(response.data);
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                toast.error('Failed to load chat history');
            }
        } finally {
            setIsFetchingHistory(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Text-to-Speech Function
    const speakMessage = (text: string) => {
        if (!isTTSActive || !synthRef.current) return;

        // Cancel ongoing speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Select a good voice if available
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
        if (preferredVoice) utterance.voice = preferredVoice;

        synthRef.current.speak(utterance);
    };

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setIsLoading(true);

        // Add user message to UI immediately
        const tempUserMsg = {
            role: 'user',
            content: userMessage,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempUserMsg]);

        try {
            const response = await chatAPI.sendMessage({ message: userMessage });

            // Add AI response
            const aiMessage = {
                role: 'assistant',
                content: response.data.message,
                action_results: response.data.action_results,
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);

            // Perform TTS on AI response
            if (isTTSActive) {
                speakMessage(response.data.message);
            }

            // Show success for actions
            if (response.data.actions && response.data.actions.length > 0) {
                toast.success('AI Counsellor performed actions based on our conversation');
            }
        } catch (error: any) {
            toast.error('Failed to send message');
            // Remove the temporary user message on error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isFetchingHistory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="border-b border-[#2d2d4a] bg-[#1a1a2e]/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                            <div className="h-6 w-px bg-gray-700" />
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold">AI Counsellor</h1>
                                    <p className="text-xs text-gray-400">Your personal study-abroad guide</p>
                                </div>
                            </div>
                        </div>

                        {/* Voice Controls */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsTTSActive(!isTTSActive)}
                            className={isTTSActive ? "text-indigo-400" : "text-gray-500"}
                            title={isTTSActive ? "Mute AI Voice" : "Enable AI Voice"}
                        >
                            {isTTSActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8 max-w-4xl">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Welcome to AI Counsellor!</h2>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                I'm here to guide you through your study-abroad journey. Ask me anything about universities, your profile, or next steps!
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {[
                                    'Analyze my profile strengths',
                                    'Recommend universities for me',
                                    'What should I do next?',
                                    'Help me improve my chances'
                                ].map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setInput(suggestion)}
                                        className="p-4 bg-[#1e1e3f] border border-[#2d2d4a] rounded-lg text-left hover:border-indigo-500 transition-colors"
                                    >
                                        <p className="text-sm">{suggestion}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start space-x-4 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                            ? 'bg-gray-700'
                                            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                            }`}
                                    >
                                        {message.role === 'user' ? (
                                            <User className="w-5 h-5 text-white" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-white" />
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div
                                        className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''
                                            }`}
                                    >
                                        <div className="flex flex-col space-y-4">
                                            <div
                                                className={`inline-block max-w-[90%] p-4 rounded-2xl ${message.role === 'user'
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-[#1e1e3f] border border-[#2d2d4a]'
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                                <p className="text-[10px] uppercase font-black tracking-widest opacity-30 mt-3">
                                                    {new Date(message.created_at).toLocaleTimeString()}
                                                </p>
                                            </div>

                                            {/* Action Results (e.g. University Search) */}
                                            {message.action_results && message.action_results.map((result: any, rid: number) => (
                                                <div key={rid} className="mt-2 space-y-4">
                                                    {result.type === 'PROFILE_UPDATE' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="flex items-center space-x-3 p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 max-w-fit"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                                                <UserCheck className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 leading-none mb-1">Neural Profile Update</p>
                                                                <p className="text-[9px] text-text-dim font-medium">Synchronized: <span className="text-white">{result.fields.join(', ')}</span></p>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {result.type === 'UNIVERSITY_SEARCH' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {result.results.map((uni: any) => (
                                                                <button
                                                                    key={uni.id}
                                                                    onClick={() => router.push(`/universities?id=${uni.id}`)}
                                                                    className="p-1 border-glow rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-all text-left group"
                                                                >
                                                                    <div className="p-4 bg-[#0c0c0e] rounded-[calc(1rem-1px)] h-full">
                                                                        <div className="flex justify-between items-start mb-3">
                                                                            <span className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded tracking-widest">RANK #{uni.ranking}</span>
                                                                            <Target className="w-3 h-3 text-text-dim group-hover:text-white transition-colors" />
                                                                        </div>
                                                                        <h4 className="font-bold text-sm mb-1 truncate group-hover:text-indigo-400 transition-colors">{uni.name}</h4>
                                                                        <div className="flex items-center space-x-2 mb-4">
                                                                            <span className="text-[10px] text-text-dim uppercase font-black tracking-tighter">{uni.country}</span>
                                                                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                                                                            <span className="text-[10px] text-emerald-400 font-black uppercase">${uni.tuition?.toLocaleString()}/yr</span>
                                                                        </div>
                                                                        {uni.scholarship && (
                                                                            <div className="flex items-center space-x-1 text-[8px] font-black uppercase text-purple-400 tracking-[0.2em] animate-pulse-glow">
                                                                                <Sparkles className="w-2.5 h-2.5" />
                                                                                <span>Scholarship Ready</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-[#1e1e3f] border border-[#2d2d4a] rounded-2xl p-4">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-[#2d2d4a] bg-[#1a1a2e]/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 max-w-4xl">
                    <div className="flex items-end space-x-4">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about your study-abroad journey..."
                            className="flex-1 px-4 py-3 bg-[#1e1e3f] border border-[#2d2d4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={3}
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="px-6 py-3"
                        >
                            <Send className="w-5 h-5" />
                        </Button>

                        {browserSupportsSpeechRecognition && (
                            <Button
                                onClick={toggleListening}
                                className={`px-4 py-3 ${listening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}
                                title={listening ? "Stop Listening" : "Start Voice Input"}
                            >
                                {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Press Enter to send, Shift+Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
}
