import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Database, 
  Settings,
  Play,
  Pause,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { TavusPersona, Conversation, ExtractedData } from '../types';

interface DashboardProps {
  persona: TavusPersona;
  conversations: Conversation[];
  onStartConversation: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  persona,
  conversations,
  onStartConversation,
}) => {
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    completedConversations: 0,
    averageDuration: 0,
    dataExtractionRate: 0,
    integrationSuccessRate: 0,
  });

  useEffect(() => {
    // Calculate statistics
    const total = conversations.length;
    const active = conversations.filter(c => c.status === 'active').length;
    const completed = conversations.filter(c => c.status === 'completed').length;
    
    const completedConversations = conversations.filter(c => c.status === 'completed');
    const avgDuration = completedConversations.length > 0 
      ? completedConversations.reduce((sum, c) => {
          if (c.endTime) {
            return sum + (new Date(c.endTime).getTime() - new Date(c.startTime).getTime());
          }
          return sum;
        }, 0) / completedConversations.length / 1000 / 60 // Convert to minutes
      : 0;

    const successfulExtractions = conversations.filter(c => 
      c.extractedData.patientInfo.firstName && c.extractedData.patientInfo.lastName
    ).length;
    const extractionRate = total > 0 ? (successfulExtractions / total) * 100 : 0;

    const successfulIntegrations = conversations.filter(c => 
      c.integrationStatus.ehrIntegration === 'success' || 
      c.integrationStatus.crmIntegration === 'success'
    ).length;
    const integrationRate = total > 0 ? (successfulIntegrations / total) * 100 : 0;

    setStats({
      totalConversations: total,
      activeConversations: active,
      completedConversations: completed,
      averageDuration: avgDuration,
      dataExtractionRate: extractionRate,
      integrationSuccessRate: integrationRate,
    });
  }, [conversations]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-healthcare-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-healthcare-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-healthcare-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-healthcare-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {persona.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-healthcare-800">{persona.name}</h1>
              <p className="text-healthcare-600">{persona.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  persona.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {persona.status}
                </span>
                <span className="text-sm text-healthcare-500">
                  ID: {persona.id}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onStartConversation}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start Conversation</span>
            </button>
            <button className="bg-healthcare-100 text-healthcare-700 px-6 py-3 rounded-lg hover:bg-healthcare-200 transition-colors flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Conversations"
          value={stats.totalConversations}
          icon={<MessageSquare className="w-6 h-6" />}
          color="text-primary-600"
        />
        <StatCard
          title="Active Sessions"
          value={stats.activeConversations}
          icon={<Activity className="w-6 h-6" />}
          color="text-green-600"
        />
        <StatCard
          title="Completed"
          value={stats.completedConversations}
          icon={<CheckCircle className="w-6 h-6" />}
          color="text-blue-600"
        />
        <StatCard
          title="Avg Duration"
          value={`${stats.averageDuration.toFixed(1)}m`}
          icon={<Clock className="w-6 h-6" />}
          color="text-purple-600"
        />
        <StatCard
          title="Data Extraction"
          value={`${stats.dataExtractionRate.toFixed(1)}%`}
          icon={<Database className="w-6 h-6" />}
          color="text-orange-600"
          subtitle="Success rate"
        />
        <StatCard
          title="Integration Success"
          value={`${stats.integrationSuccessRate.toFixed(1)}%`}
          icon={<BarChart3 className="w-6 h-6" />}
          color="text-teal-600"
          subtitle="EHR/CRM sync"
        />
      </div>

      {/* Recent Conversations */}
      <div className="bg-white rounded-lg shadow-sm border border-healthcare-200">
        <div className="p-6 border-b border-healthcare-200">
          <h2 className="text-lg font-semibold text-healthcare-800">Recent Conversations</h2>
        </div>
        <div className="divide-y divide-healthcare-200">
          {conversations.slice(0, 5).map((conversation) => (
            <div key={conversation.id} className="p-6 hover:bg-healthcare-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-healthcare-200 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-healthcare-600" />
                  </div>
                  <div>
                    <p className="font-medium text-healthcare-800">
                      {conversation.extractedData.patientInfo.firstName || 'Unknown'}{' '}
                      {conversation.extractedData.patientInfo.lastName || 'Patient'}
                    </p>
                    <p className="text-sm text-healthcare-600">
                      {new Date(conversation.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    conversation.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : conversation.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {conversation.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    {conversation.integrationStatus.ehrIntegration === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" title="EHR Integration Success" />
                    )}
                    {conversation.integrationStatus.crmIntegration === 'success' && (
                      <CheckCircle className="w-4 h-4 text-blue-500" title="CRM Integration Success" />
                    )}
                    {(conversation.integrationStatus.ehrIntegration === 'failed' || 
                      conversation.integrationStatus.crmIntegration === 'failed') && (
                      <AlertTriangle className="w-4 h-4 text-red-500" title="Integration Failed" />
                    )}
                  </div>
                </div>
              </div>
              {conversation.extractedData.symptoms.primarySymptoms.length > 0 && (
                <div className="mt-3 ml-14">
                  <p className="text-sm text-healthcare-600">
                    <span className="font-medium">Symptoms:</span>{' '}
                    {conversation.extractedData.symptoms.primarySymptoms.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-healthcare-300 mx-auto mb-4" />
              <p className="text-healthcare-600">No conversations yet</p>
              <p className="text-sm text-healthcare-500 mt-1">
                Start your first conversation to see data here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-healthcare-200 p-6">
          <h3 className="text-lg font-semibold text-healthcare-800 mb-4">Conversation Flow</h3>
          <div className="space-y-3">
            {persona.conversationConfig.conversationFlow.slice(0, 6).map((flow, index) => (
              <div key={flow.id} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-sm text-healthcare-700 capitalize">
                  {flow.stage.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-healthcare-200 p-6">
          <h3 className="text-lg font-semibold text-healthcare-800 mb-4">Personality Traits</h3>
          <div className="space-y-3">
            {Object.entries(persona.conversationConfig.personality).map(([trait, value]) => (
              <div key={trait} className="flex items-center justify-between">
                <span className="text-sm text-healthcare-700 capitalize">
                  {trait}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-healthcare-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-healthcare-600 w-6">{value}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};