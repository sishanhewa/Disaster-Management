import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

// Replace with environment variable in production
const API_KEY = "AIzaSyDzOHWSOzMumdBe45DuHuoNcsUS-a6x7_A";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are SIDMS Guide, an authoritative, calm, and highly intelligent AI disaster management assistant for Sri Lanka.
Your primary goal is to provide verified, life-saving survival guidance to citizens before, during, and after disasters like floods and landslides.

Guidelines:
1. Always remain calm, professional, and reassuring.
2. Provide step-by-step, actionable advice that is easy to understand.
3. If a user states they are in immediate life-threatening danger, explicitly tell them to contact local emergency services (119) or use the SIDMS SOS Beacon feature.
4. Keep your responses concise; people in emergencies do not have time to read long paragraphs.
5. Base your knowledge on Sri Lankan disaster management protocols (Disaster Management Centre - DMC).
6. NEVER hallucinate medical advice. Provide basic first-aid steps if asked, but always recommend seeking professional medical help.
7. You can communicate in English, but understand if users ask questions about Sri Lanka.`;

type Message = {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
};

export default function DisasterChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            content: 'Hello. I am the SIDMS Intelligent Guidance Assistant. How can I help you prepare for or navigate a disaster today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // For Gemini 2.5 Flash
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: SYSTEM_PROMPT
            });

            // Format previous messages for the model (excluding the system welcome message to avoid role validation errors)
            const formattedHistory = messages
                .filter(msg => msg.id !== 'welcome') // Gemini strictly wants user as first message in history
                .map(msg => ({
                    role: msg.role === 'model' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }));

            const chat = model.startChat({
                history: formattedHistory,
            });

            const result = await chat.sendMessage(userMsg.content);
            const responseText = result.response.text();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: "⚠️ I'm currently unable to connect to the guidance network. Please check your internet connection or refer to the Offline Survival Guides section.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] max-h-[80vh] bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">SIDMS Guide</h2>
                        <p className="text-blue-100 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            AI Assistant Online
                        </p>
                    </div>
                </div>
                <div className="text-blue-200 hover:text-white cursor-pointer" title="Verified Information">
                    <AlertTriangle size={20} />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] gap-3 shadow-sm ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${message.role === 'user' ? 'bg-blue-900/50 text-blue-400' : 'bg-emerald-900/50 text-emerald-400'
                                }`}>
                                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`p-3 rounded-2xl ${message.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-slate-700 border border-slate-600 text-slate-200 rounded-tl-none'
                                }`}>
                                {message.role === 'model' ? (
                                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                )}
                                <div className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%] flex-row">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-emerald-900/50 text-emerald-400">
                                <Bot size={16} />
                            </div>
                            <div className="bg-slate-700 border border-slate-600 text-slate-300 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-blue-400" />
                                <span className="text-sm text-slate-400">Formulating response...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-800 border-t border-slate-700">
                <form onSubmit={handleSend} className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about disaster preparation or safety..."
                        className="flex-1 border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-shadow"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className={`absolute right-1.5 top-1.5 p-2 rounded-full flex items-center justify-center transition-colors ${input.trim() && !isLoading ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-600 text-slate-400'
                            }`}
                    >
                        <Send size={18} className={input.trim() && !isLoading ? 'translate-x-0.5' : ''} />
                    </button>
                </form>
                <p className="text-center text-xs text-slate-500 mt-2">
                    AI guidance is for informational purposes. In life-threatening emergencies, call 119.
                </p>
            </div>
        </div>
    );
}
