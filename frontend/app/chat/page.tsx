'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { chatAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react';

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);

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
                                        <div
                                            className={`inline-block max-w-[80%] p-4 rounded-2xl ${message.role === 'user'
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-[#1e1e3f] border border-[#2d2d4a]'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className="text-xs opacity-50 mt-2">
                                                {new Date(message.created_at).toLocaleTimeString()}
                                            </p>
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
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Press Enter to send, Shift+Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
}
