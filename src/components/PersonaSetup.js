import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { User, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { healthcarePersonaConfig } from '../config/personas';
import { tavusService } from '../services/tavusService';
import ConversationRoom from './ConversationRoom';
export const PersonaSetup = ({ onPersonaCreated }) => {
    const [step, setStep] = useState(1);
    const [videoFile, setVideoFile] = useState(null);
    const [personaName, setPersonaName] = useState(healthcarePersonaConfig.name);
    const [personaDescription, setPersonaDescription] = useState(healthcarePersonaConfig.description);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const [pipelineMode, setPipelineMode] = useState('full');
    const [systemPrompt, setSystemPrompt] = useState('As a compassionate healthcare assistant, you provide clear, empathetic, and professional support to patients during video consultations.');
    const [conversationUrl, setConversationUrl] = useState(null);
    const [activeConversations, setActiveConversations] = useState([]);
    const [showEndConversations, setShowEndConversations] = useState(false);
    const handleVideoUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith('video/')) {
                setVideoFile(file);
                setError(null);
            }
            else {
                setError('Please select a valid video file');
            }
        }
    };
    const handleCreatePersona = async () => {
        setIsCreating(true);
        setError(null);
        try {
            // Only create persona with text fields, no video upload
            const personaRes = await tavusService.createPersona({
                ...healthcarePersonaConfig,
                name: personaName,
                description: personaDescription,
                status: 'active',
                pipeline_mode: pipelineMode,
                system_prompt: systemPrompt,
            });
            if (!personaRes.success || !personaRes.data?.id) {
                throw new Error(personaRes.error || 'Failed to create persona');
            }
            onPersonaCreated(personaRes.data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create persona. Please try again.');
        }
        finally {
            setIsCreating(false);
        }
    };
    const fetchActiveConversations = async () => {
        setIsCreating(true);
        setError(null);
        try {
            const response = await fetch('https://tavusapi.com/v2/conversations', {
                method: 'GET',
                headers: {
                    'x-api-key': import.meta.env.VITE_TAVUS_API_KEY,
                },
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setActiveConversations(data.filter((c) => c.status === 'active'));
            }
            else if (Array.isArray(data.conversations)) {
                setActiveConversations(data.conversations.filter((c) => c.status === 'active'));
            }
            else {
                setActiveConversations([]);
            }
            setShowEndConversations(true);
        }
        catch (err) {
            setError('Failed to fetch active conversations.');
        }
        finally {
            setIsCreating(false);
        }
    };
    const endConversation = async (conversationId) => {
        setIsCreating(true);
        setError(null);
        try {
            await fetch(`https://tavusapi.com/v2/conversations/${conversationId}/end`, {
                method: 'POST',
                headers: {
                    'x-api-key': import.meta.env.VITE_TAVUS_API_KEY,
                },
            });
            setActiveConversations((prev) => prev.filter((c) => c.conversation_id !== conversationId));
        }
        catch (err) {
            setError('Failed to end conversation.');
        }
        finally {
            setIsCreating(false);
        }
    };
    const handleStartConversation = async () => {
        setIsCreating(true);
        setError(null);
        try {
            const response = await fetch('https://tavusapi.com/v2/conversations', {
                method: 'POST',
                headers: {
                    'x-api-key': import.meta.env.VITE_TAVUS_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    replica_id: import.meta.env.VITE_TAVUS_REPLICA_ID,
                    persona_id: import.meta.env.VITE_TAVUS_PERSONA_ID,
                }),
            });
            const data = await response.json();
            console.log('Tavus Conversation API response:', data);
            if (data.conversation_url) {
                setConversationUrl(data.conversation_url);
            }
            else if (data.message && data.message.includes('maximum concurrent conversations')) {
                setError('You have reached the maximum number of active video calls. Please end an existing call before starting a new one.');
                fetchActiveConversations();
            }
            else {
                setError('Failed to start conversation.');
            }
        }
        catch (err) {
            setError('Failed to start conversation.');
        }
        finally {
            setIsCreating(false);
        }
    };
    const renderStep = () => {
        switch (step) {
            case 1:
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx(User, { className: "w-16 h-16 text-primary-500 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-healthcare-800 mb-2", children: "Create Healthcare Persona" }), _jsx("p", { className: "text-healthcare-600", children: "Upload a 2-minute video to create your AI healthcare assistant" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-healthcare-700 mb-2", children: "Persona Name" }), _jsx("input", { type: "text", value: personaName, onChange: (e) => setPersonaName(e.target.value), className: "w-full px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-healthcare-700 mb-2", children: "Description" }), _jsx("textarea", { value: personaDescription, onChange: (e) => setPersonaDescription(e.target.value), rows: 3, className: "w-full px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-healthcare-700 mb-2", children: "Pipeline Mode" }), _jsx("input", { type: "text", value: pipelineMode, onChange: (e) => setPipelineMode(e.target.value), className: "w-full px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-healthcare-700 mb-2", children: "System Prompt" }), _jsx("textarea", { value: systemPrompt, onChange: (e) => setSystemPrompt(e.target.value), rows: 3, className: "w-full px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Describe the persona's behavior and expertise..." })] })] }), _jsx("button", { onClick: () => setStep(2), className: "w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors", children: "Continue" })] }));
            case 2:
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx(Settings, { className: "w-16 h-16 text-primary-500 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-healthcare-800 mb-2", children: "Review Configuration" }), _jsx("p", { className: "text-healthcare-600", children: "Review your persona settings before creation" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-healthcare-50 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-healthcare-800 mb-3", children: "Persona Details" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-healthcare-600", children: "Name:" }), _jsx("span", { className: "text-healthcare-800", children: personaName })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-healthcare-600", children: "Specialty:" }), _jsx("span", { className: "text-healthcare-800", children: "General Practice" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-healthcare-600", children: "Language:" }), _jsx("span", { className: "text-healthcare-800", children: "English (US)" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-healthcare-600", children: "Max Duration:" }), _jsx("span", { className: "text-healthcare-800", children: "30 minutes" })] })] })] }), _jsxs("div", { className: "bg-healthcare-50 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-healthcare-800 mb-3", children: "Conversation Flow" }), _jsxs("div", { className: "space-y-2 text-sm text-healthcare-600", children: [_jsx("div", { children: "\u2713 Patient consent collection" }), _jsx("div", { children: "\u2713 Demographic information gathering" }), _jsx("div", { children: "\u2713 Medical history assessment" }), _jsx("div", { children: "\u2713 Current symptoms evaluation" }), _jsx("div", { children: "\u2713 Appointment scheduling preferences" }), _jsx("div", { children: "\u2713 Insurance verification" }), _jsx("div", { children: "\u2713 Data integration with EHR/CRM" })] })] }), videoFile && (_jsxs("div", { className: "bg-healthcare-50 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-healthcare-800 mb-3", children: "Training Video" }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-healthcare-800", children: videoFile.name }), _jsxs("p", { className: "text-xs text-healthcare-600", children: [(videoFile.size / (1024 * 1024)).toFixed(2), " MB"] })] })] })] }))] }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500" }), _jsx("p", { className: "text-red-700", children: error })] })), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: () => setStep(1), disabled: isCreating, className: "flex-1 bg-healthcare-200 text-healthcare-700 py-3 rounded-lg hover:bg-healthcare-300 disabled:opacity-50 transition-colors", children: "Back" }), _jsx("button", { onClick: handleStartConversation, disabled: isCreating, className: "flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors", children: isCreating ? 'Starting Conversation...' : 'Start Conversation' })] })] }));
            default:
                return null;
        }
    };
    // Always render ConversationRoom if conversationUrl is set
    if (conversationUrl) {
        return _jsx(ConversationRoom, { conversationUrl: conversationUrl });
    }
    // UI for ending active conversations
    if (showEndConversations) {
        return (_jsxs("div", { className: "max-w-xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-red-600", children: "Active Conversations" }), _jsx("p", { className: "mb-4 text-healthcare-700", children: "You have reached the maximum number of active video calls. Please end one or more of the following conversations to continue." }), activeConversations.length === 0 ? (_jsx("p", { className: "text-green-600", children: "No active conversations found. Try again in a moment." })) : (_jsx("ul", { className: "space-y-4", children: activeConversations.map((conv) => (_jsxs("li", { className: "flex items-center justify-between bg-healthcare-50 p-4 rounded-lg border border-healthcare-200", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-healthcare-800", children: conv.conversation_name || conv.conversation_id }), _jsxs("div", { className: "text-xs text-healthcare-600", children: ["ID: ", conv.conversation_id] }), _jsxs("div", { className: "text-xs text-healthcare-600", children: ["Status: ", conv.status] })] }), _jsx("button", { onClick: () => endConversation(conv.conversation_id), className: "ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors", disabled: isCreating, children: "End" })] }, conv.conversation_id))) })), _jsx("button", { onClick: () => setShowEndConversations(false), className: "mt-6 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-bold", children: "Back" })] }));
    }
    return (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "flex items-center justify-between", children: [1, 2].map((stepNumber) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-healthcare-200 text-healthcare-600'}`, children: stepNumber }), stepNumber < 2 && (_jsx("div", { className: `w-16 h-1 mx-2 ${step > stepNumber ? 'bg-primary-500' : 'bg-healthcare-200'}` }))] }, stepNumber))) }), _jsxs("div", { className: "flex justify-between mt-2 text-xs text-healthcare-600", children: [_jsx("span", { children: "Setup" }), _jsx("span", { children: "Review" })] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-lg p-8", children: renderStep() })] }));
};
