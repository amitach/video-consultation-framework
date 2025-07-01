/// <reference types="vite/client" />
import { TavusPersona, ConversationSession, ApiResponse } from '../types';

class TavusService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_TAVUS_API_KEY || '';
    this.baseUrl = 'https://tavusapi.com/v2';
  }

  async createPersona(personaConfig: any): Promise<ApiResponse<TavusPersona>> {
    try {
      const response = await fetch(`${this.baseUrl}/personas`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: personaConfig.name,
          description: personaConfig.description,
          conversation_config: personaConfig.conversationConfig,
          pipeline_mode: personaConfig.pipeline_mode,
          system_prompt: personaConfig.system_prompt,
          replica_id: personaConfig.replicaId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          ...personaConfig,
          id: data.persona_id,
          replicaId: data.replica_id,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async initializeConversation(
    personaId: string,
    patientId: string,
    metadata: Record<string, any> = {}
  ): Promise<ApiResponse<ConversationSession>> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona_id: personaId,
          participant_id: patientId,
          metadata: {
            ...metadata,
            healthcare_context: true,
            hipaa_compliant: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          sessionId: data.conversation_id,
          patientId,
          personaId,
          status: 'initializing',
          videoUrl: data.video_url,
          chatEnabled: data.chat_enabled || false,
          startTime: new Date().toISOString(),
          metadata: data.metadata,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getConversationStatus(conversationId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async endConversation(conversationId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      // Tavus API returns 204 No Content for successful end conversation
      return {
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async createReplica(videoFile: File, name: string): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('name', name);

      const response = await fetch(`${this.baseUrl}/replicas`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Mock implementation for development
  async mockConversationSession(personaId: string, patientId: string): Promise<ConversationSession> {
    return {
      sessionId: `mock-session-${Date.now()}`,
      patientId,
      personaId,
      status: 'active',
      videoUrl: 'https://example.com/mock-video-stream',
      chatEnabled: true,
      startTime: new Date().toISOString(),
      metadata: {
        mock: true,
        environment: 'development',
      },
    };
  }
}

export const tavusService = new TavusService();