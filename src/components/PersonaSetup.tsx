import React, { useState } from 'react';
import { Upload, User, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { TavusPersona } from '../types';
import { healthcarePersonaConfig } from '../config/personas';
import { tavusService } from '../services/tavusService';
import ConversationRoom from './ConversationRoom';

interface PersonaSetupProps {
  onPersonaCreated: (persona: TavusPersona) => void;
}

export const PersonaSetup: React.FC<PersonaSetupProps> = ({ onPersonaCreated }) => {
  const [step, setStep] = useState(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [personaName, setPersonaName] = useState(healthcarePersonaConfig.name);
  const [personaDescription, setPersonaDescription] = useState(healthcarePersonaConfig.description);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pipelineMode, setPipelineMode] = useState('full');
  const [systemPrompt, setSystemPrompt] = useState('As a compassionate healthcare assistant, you provide clear, empathetic, and professional support to patients during video consultations.');
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setError(null);
      } else {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create persona. Please try again.');
    } finally {
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
      } else {
        setError('Failed to start conversation.');
      }
    } catch (err) {
      setError('Failed to start conversation.');
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-healthcare-800 mb-2">
                Create Healthcare Persona
              </h3>
              <p className="text-healthcare-600">
                Upload a 2-minute video to create your AI healthcare assistant
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-healthcare-700 mb-2">
                  Persona Name
                </label>
                <input
                  type="text"
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  className="w-full px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-healthcare-700 mb-2">
                  Description
                </label>
                <textarea
                  value={personaDescription}
                  onChange={(e) => setPersonaDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-healthcare-700 mb-2">
                  Pipeline Mode
                </label>
                <input
                  type="text"
                  value={pipelineMode}
                  onChange={(e) => setPipelineMode(e.target.value)}
                  className="w-full px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-healthcare-700 mb-2">
                  System Prompt
                </label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the persona's behavior and expertise..."
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Settings className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-healthcare-800 mb-2">
                Review Configuration
              </h3>
              <p className="text-healthcare-600">
                Review your persona settings before creation
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-healthcare-50 rounded-lg p-4">
                <h4 className="font-medium text-healthcare-800 mb-3">Persona Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-healthcare-600">Name:</span>
                    <span className="text-healthcare-800">{personaName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-healthcare-600">Specialty:</span>
                    <span className="text-healthcare-800">General Practice</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-healthcare-600">Language:</span>
                    <span className="text-healthcare-800">English (US)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-healthcare-600">Max Duration:</span>
                    <span className="text-healthcare-800">30 minutes</span>
                  </div>
                </div>
              </div>

              <div className="bg-healthcare-50 rounded-lg p-4">
                <h4 className="font-medium text-healthcare-800 mb-3">Conversation Flow</h4>
                <div className="space-y-2 text-sm text-healthcare-600">
                  <div>✓ Patient consent collection</div>
                  <div>✓ Demographic information gathering</div>
                  <div>✓ Medical history assessment</div>
                  <div>✓ Current symptoms evaluation</div>
                  <div>✓ Appointment scheduling preferences</div>
                  <div>✓ Insurance verification</div>
                  <div>✓ Data integration with EHR/CRM</div>
                </div>
              </div>

              {videoFile && (
                <div className="bg-healthcare-50 rounded-lg p-4">
                  <h4 className="font-medium text-healthcare-800 mb-3">Training Video</h4>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-healthcare-800">{videoFile.name}</p>
                      <p className="text-xs text-healthcare-600">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                disabled={isCreating}
                className="flex-1 bg-healthcare-200 text-healthcare-700 py-3 rounded-lg hover:bg-healthcare-300 disabled:opacity-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleStartConversation}
                disabled={isCreating}
                className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
              >
                {isCreating ? 'Starting Conversation...' : 'Start Conversation'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (conversationUrl) {
    return <ConversationRoom conversationUrl={conversationUrl} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-healthcare-200 text-healthcare-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 2 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary-500' : 'bg-healthcare-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-healthcare-600">
          <span>Setup</span>
          <span>Review</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {renderStep()}
      </div>
    </div>
  );
};