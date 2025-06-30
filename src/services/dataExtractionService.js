import { healthcarePersonaConfig, medicalContextMapping } from '../config/personas';
class DataExtractionService {
    extractionRules;
    constructor() {
        this.extractionRules = this.buildExtractionRules();
    }
    buildExtractionRules() {
        const rules = [];
        // Collect all extraction rules from conversation flow
        healthcarePersonaConfig.conversationConfig.conversationFlow.forEach(flow => {
            rules.push(...flow.dataExtractionRules);
        });
        return rules;
    }
    extractDataFromConversation(messages) {
        const extractedData = {
            patientInfo: {},
            medicalHistory: {
                patientId: '',
                conditions: [],
                medications: [],
                allergies: [],
                surgeries: [],
                familyHistory: [],
            },
            appointmentPreferences: {
                appointmentType: 'consultation',
            },
            symptoms: {
                primarySymptoms: [],
                duration: '',
                severity: 1,
            },
            consent: {
                hipaaConsent: false,
                treatmentConsent: false,
                dataProcessingConsent: false,
                communicationConsent: false,
            },
        };
        // Process patient messages only
        const patientMessages = messages.filter(msg => msg.speaker === 'patient');
        patientMessages.forEach(message => {
            this.extractionRules.forEach(rule => {
                const extractedValue = this.applyExtractionRule(message.content, rule);
                if (extractedValue !== null) {
                    this.setNestedProperty(extractedData, rule.field, extractedValue);
                }
            });
            // Apply contextual extraction for medical terms
            this.extractMedicalContext(message.content, extractedData);
        });
        // Post-process and validate extracted data
        this.validateAndCleanData(extractedData);
        return extractedData;
    }
    applyExtractionRule(text, rule) {
        const regex = new RegExp(rule.pattern, 'gi');
        const matches = text.match(regex);
        if (!matches)
            return null;
        switch (rule.validation) {
            case 'string':
                return matches[0];
            case 'number':
                const numMatch = matches[0].match(/\d+/);
                return numMatch ? parseInt(numMatch[0], 10) : null;
            case 'boolean':
                return /yes|agree|consent|okay|sure/i.test(matches[0]);
            case 'email':
                const emailMatch = matches[0].match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                return emailMatch ? emailMatch[0] : null;
            case 'phone':
                const phoneMatch = matches[0].match(/\d{3}[-.]?\d{3}[-.]?\d{4}/);
                return phoneMatch ? phoneMatch[0] : null;
            case 'array':
                return matches;
            default:
                return matches[0];
        }
    }
    extractMedicalContext(text, extractedData) {
        const lowerText = text.toLowerCase();
        // Extract symptoms using medical context mapping
        Object.entries(medicalContextMapping.symptoms).forEach(([category, terms]) => {
            terms.forEach(term => {
                if (lowerText.includes(term.toLowerCase())) {
                    if (!extractedData.symptoms.primarySymptoms.includes(term)) {
                        extractedData.symptoms.primarySymptoms.push(term);
                    }
                }
            });
        });
        // Extract conditions
        Object.entries(medicalContextMapping.conditions).forEach(([category, conditions]) => {
            conditions.forEach(condition => {
                if (lowerText.includes(condition.toLowerCase())) {
                    if (!(extractedData.medicalHistory.conditions ?? []).includes(condition)) {
                        (extractedData.medicalHistory.conditions ??= []).push(condition);
                    }
                }
            });
        });
        // Extract medications
        medicalContextMapping.medications.common.forEach(medication => {
            if (lowerText.includes(medication.toLowerCase())) {
                const existingMed = (extractedData.medicalHistory.medications ?? []).find(med => med.name.toLowerCase() === medication.toLowerCase());
                if (!existingMed) {
                    (extractedData.medicalHistory.medications ??= []).push({
                        name: medication,
                        dosage: '',
                        frequency: '',
                        prescribedDate: '',
                        prescribingPhysician: '',
                    });
                }
            }
        });
        // Extract duration patterns
        const durationMatch = text.match(/(\d+)\s*(days?|weeks?|months?|years?)/i);
        if (durationMatch && !extractedData.symptoms.duration) {
            extractedData.symptoms.duration = durationMatch[0];
        }
        // Extract severity ratings
        const severityMatch = text.match(/(\d+)\s*(?:out of|\/)\s*10/i);
        if (severityMatch) {
            const severity = parseInt(severityMatch[1], 10);
            if (severity >= 1 && severity <= 10) {
                extractedData.symptoms.severity = severity;
            }
        }
    }
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        const finalKey = keys[keys.length - 1];
        // Handle array fields
        if (Array.isArray(value) && Array.isArray(current[finalKey])) {
            current[finalKey] = [...current[finalKey], ...value];
        }
        else {
            current[finalKey] = value;
        }
    }
    validateAndCleanData(extractedData) {
        // Remove duplicates from arrays
        if (extractedData.symptoms.primarySymptoms) {
            extractedData.symptoms.primarySymptoms = [...new Set(extractedData.symptoms.primarySymptoms)];
        }
        if (extractedData.medicalHistory.conditions) {
            extractedData.medicalHistory.conditions = [...new Set(extractedData.medicalHistory.conditions)];
        }
        if (extractedData.medicalHistory.allergies) {
            extractedData.medicalHistory.allergies = [...new Set(extractedData.medicalHistory.allergies)];
        }
        // Validate email format
        if (extractedData.patientInfo.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(extractedData.patientInfo.email)) {
                delete extractedData.patientInfo.email;
            }
        }
        // Validate phone format
        if (extractedData.patientInfo.phone) {
            const phoneRegex = /^\d{3}[-.]?\d{3}[-.]?\d{4}$/;
            if (!phoneRegex.test(extractedData.patientInfo.phone)) {
                delete extractedData.patientInfo.phone;
            }
        }
        // Ensure severity is within valid range
        if (extractedData.symptoms.severity < 1 || extractedData.symptoms.severity > 10) {
            extractedData.symptoms.severity = 1;
        }
    }
    // Real-time extraction for live conversations
    extractFromMessage(message, currentData) {
        const updatedData = { ...currentData };
        if (message.speaker === 'patient') {
            this.extractionRules.forEach(rule => {
                const extractedValue = this.applyExtractionRule(message.content, rule);
                if (extractedValue !== null) {
                    this.setNestedProperty(updatedData, rule.field, extractedValue);
                }
            });
            this.extractMedicalContext(message.content, updatedData);
            this.validateAndCleanData(updatedData);
        }
        return updatedData;
    }
    // Generate summary of extracted data
    generateDataSummary(extractedData) {
        const summary = [];
        if (extractedData.patientInfo.firstName && extractedData.patientInfo.lastName) {
            summary.push(`Patient: ${extractedData.patientInfo.firstName} ${extractedData.patientInfo.lastName}`);
        }
        if (extractedData.symptoms.primarySymptoms.length > 0) {
            summary.push(`Primary symptoms: ${extractedData.symptoms.primarySymptoms.join(', ')}`);
        }
        if (extractedData.symptoms.duration) {
            summary.push(`Duration: ${extractedData.symptoms.duration}`);
        }
        if (extractedData.symptoms.severity > 1) {
            summary.push(`Severity: ${extractedData.symptoms.severity}/10`);
        }
        if ((extractedData.medicalHistory.conditions ?? []).length > 0) {
            summary.push(`Medical conditions: ${(extractedData.medicalHistory.conditions ?? []).join(', ')}`);
        }
        if (extractedData.appointmentPreferences.appointmentType) {
            summary.push(`Appointment type: ${extractedData.appointmentPreferences.appointmentType}`);
        }
        return summary.join(' | ');
    }
}
export const dataExtractionService = new DataExtractionService();
