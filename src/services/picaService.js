class PicaService {
    secretKey;
    baseUrl;
    constructor() {
        this.secretKey = import.meta.env.VITE_PICA_SECRET_KEY || '';
        this.baseUrl = 'https://api.pica.ai/v1';
    }
    async getAvailableConnectors() {
        try {
            const response = await fetch(`${this.baseUrl}/connectors`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Pica API error: ${response.statusText}`);
            }
            const data = await response.json();
            return {
                success: true,
                data,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString(),
            };
        }
    }
    async createConnection(platform, credentials) {
        try {
            const response = await fetch(`${this.baseUrl}/connections`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    platform,
                    credentials,
                }),
            });
            if (!response.ok) {
                throw new Error(`Pica API error: ${response.statusText}`);
            }
            const data = await response.json();
            return {
                success: true,
                data: {
                    id: data.connection_id,
                    platform,
                    status: 'connected',
                    credentials,
                    lastSync: new Date().toISOString(),
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString(),
            };
        }
    }
    async executeAction(action) {
        try {
            const response = await fetch(`${this.baseUrl}/execute`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(action),
            });
            if (!response.ok) {
                throw new Error(`Pica API error: ${response.statusText}`);
            }
            const data = await response.json();
            return {
                success: true,
                data: {
                    id: data.action_id,
                    ...action,
                    status: 'completed',
                    result: data.result,
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Healthcare-specific integration methods
    async syncToEHR(extractedData, ehrSystem) {
        return this.executeAction({
            platform: ehrSystem,
            action: 'create_patient_record',
            parameters: {
                patient_info: extractedData.patientInfo,
                medical_history: extractedData.medicalHistory,
                appointment_preferences: extractedData.appointmentPreferences,
                symptoms: extractedData.symptoms,
            },
        });
    }
    async syncToCRM(extractedData, crmSystem) {
        return this.executeAction({
            platform: crmSystem,
            action: 'create_contact',
            parameters: {
                contact_info: extractedData.patientInfo,
                interaction_history: {
                    type: 'video_consultation',
                    timestamp: new Date().toISOString(),
                    summary: `Pre-consultation interview completed. Primary symptoms: ${extractedData.symptoms.primarySymptoms?.join(', ')}`,
                },
                follow_up_required: true,
            },
        });
    }
    async verifyInsurance(insuranceProvider, policyNumber) {
        return this.executeAction({
            platform: 'insurance_verification',
            action: 'verify_coverage',
            parameters: {
                provider: insuranceProvider,
                policy_number: policyNumber,
                service_type: 'consultation',
            },
        });
    }
    async scheduleAppointment(appointmentData, schedulingSystem) {
        return this.executeAction({
            platform: schedulingSystem,
            action: 'create_appointment',
            parameters: appointmentData,
        });
    }
    // Mock implementations for development
    async mockEHRSync(extractedData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            success: true,
            data: {
                patient_id: `EHR-${Date.now()}`,
                record_created: true,
                integration_status: 'success',
            },
            timestamp: new Date().toISOString(),
        };
    }
    async mockCRMSync(extractedData) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            success: true,
            data: {
                contact_id: `CRM-${Date.now()}`,
                lead_created: true,
                integration_status: 'success',
            },
            timestamp: new Date().toISOString(),
        };
    }
}
export const picaService = new PicaService();
