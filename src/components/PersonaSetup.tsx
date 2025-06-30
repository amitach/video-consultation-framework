import React, { useState } from 'react';
import { Upload, User, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { TavusPersona } from '../types';
import { healthcarePersonaConfig } from '../config/personas';

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
    if (!videoFile) {
      setError('Please upload a video file');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // In a real implementation, this would upload to Tavus and create the replica
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const persona: TavusPersona = {
        ...healthcarePersonaConfig,
        name: personaName,
        description: personaDescription,
        id: `persona-${Date.now()}`,
        replicaId: `replica-${Date.now()}`,
        status: 'active',
      };

      onPersonaCreated(persona);
    } catch (err) {
      setError('Failed to create persona. Please try again.');
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
              <Upload className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-healthcare-800 mb-2">
                Upload Training Video
              </h3>
              <p className="text-healthcare-600">
                Upload a 2-minute video of yourself speaking to create the AI replica
              </p>
            </div>

            <div className="border-2 border-dashed border-healthcare-300 rounded-lg p-8 text-center">
              {videoFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <p className="font-medium text-healthcare-800">{videoFile.name}</p>
                    <p className="text-sm text-healthcare-600">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setVideoFile(null)}
                    className="text-primary-500 hover:text-primary-600 text-sm"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-healthcare-400 mx-auto" />
                  <div>
                    <p className="text-healthcare-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-healthcare-500">
                      MP4, MOV, or AVI (max 100MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 cursor-pointer transition-colors"
                  >
                    Select Video
                  </label>
                </div>
              )}
            </div>

            <div className="bg-healthcare-50 rounded-lg p-4">
              <h4 className="font-medium text-healthcare-800 mb-2">Video Requirements:</h4>
              <ul className="text-sm text-healthcare-600 space-y-1">
                <li>• 2-3 minutes in length</li>
                <li>• Good lighting and clear audio</li>
                <li>• Face clearly visible throughout</li>
                <li>• Professional healthcare attire recommended</li>
                <li>• Speak naturally about healthcare topics</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-healthcare-200 text-healthcare-700 py-3 rounded-lg hover:bg-healthcare-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!videoFile}
                className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
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
                onClick={() => setStep(2)}
                disabled={isCreating}
                className="flex-1 bg-healthcare-200 text-healthcare-700 py-3 rounded-lg hover:bg-healthcare-300 disabled:opacity-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreatePersona}
                disabled={isCreating}
                className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
              >
                {isCreating ? 'Creating Persona...' : 'Create Persona'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-healthcare-200 text-healthcare-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary-500' : 'bg-healthcare-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-healthcare-600">
          <span>Setup</span>
          <span>Upload</span>
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