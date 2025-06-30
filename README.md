# Healthcare Video Assistant

An AI-powered video-based healthcare assistant that provides personalized medical information and seamlessly integrates with healthcare systems using Tavus and Pica APIs.

## Features

### Phase 1: Persona Development ✅
- **Healthcare Professional Persona**: Dr. Sarah Chen - Compassionate healthcare assistant
- **Video Script Templates**: Pre-configured conversation flows for medical consultations
- **Response Mapping Framework**: Intelligent response generation based on patient input
- **Medical Context Recognition**: Advanced extraction of medical terminology and symptoms

### Core Capabilities
- **Interactive Video Interface**: Professional, empathetic healthcare persona using Tavus
- **Conversational Intelligence**: Natural conversation flow with medical terminology recognition
- **Data Integration System**: Extract patient information into structured JSON format
- **Security & Compliance**: HIPAA-compliant data handling and encryption

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling with healthcare-focused design system
- **Responsive Design** with mobile-first approach
- **Real-time Video Streaming** integration with Tavus

### Backend Services
- **Tavus Integration**: Video persona creation and conversation management
- **Pica Integration**: API orchestration and data processing
- **Data Extraction Service**: Real-time conversation analysis and medical data extraction
- **Security Layer**: End-to-end encryption and HIPAA compliance

### Key Components

#### 1. Persona Configuration (`src/config/personas.ts`)
- Healthcare professional persona with medical specialty focus
- Conversation flow with 8 stages: consent → demographics → medical history → symptoms → scheduling
- Medical terminology mapping and context recognition
- Personality traits optimized for healthcare interactions

#### 2. Video Interface (`src/components/VideoInterface.tsx`)
- Real-time video streaming with Tavus integration
- Audio/video controls and call management
- Integrated chat functionality
- Professional healthcare UI design

#### 3. Data Extraction (`src/services/dataExtractionService.ts`)
- Real-time extraction of patient information
- Medical context recognition using NLP patterns
- Structured data validation and cleaning
- HIPAA-compliant data handling

#### 4. API Integration (`src/services/`)
- **TavusService**: Persona creation, conversation management, video streaming
- **PicaService**: EHR/CRM integration, insurance verification, appointment scheduling
- **Mock implementations** for development and testing

## Getting Started

### Prerequisites
- Node.js 18+ 
- Tavus API key
- Pica API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthcare-video-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API keys:
   ```env
   VITE_TAVUS_API_KEY=your_tavus_api_key_here
   VITE_PICA_SECRET_KEY=your_pica_secret_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Usage

#### 1. Persona Setup
- Upload a 2-minute training video of healthcare professional
- Configure persona name, description, and specialty
- Review conversation flow and personality traits
- Create Tavus replica and deploy persona

#### 2. Patient Consultation
- Start new conversation session
- Conduct video-based patient interview
- Real-time data extraction and validation
- Automatic integration with EHR/CRM systems

#### 3. Dashboard Monitoring
- View conversation statistics and success rates
- Monitor data extraction accuracy
- Track integration status with healthcare systems
- Review patient interaction history

## Conversation Flow

The healthcare persona follows a structured 8-stage conversation flow:

1. **Welcome & Introduction**: Professional greeting and context setting
2. **Consent Collection**: HIPAA consent and data processing authorization
3. **Patient Demographics**: Name, contact information, basic details
4. **Medical History**: Conditions, medications, allergies, surgeries
5. **Current Symptoms**: Primary concerns, severity, duration
6. **Appointment Scheduling**: Preferences, availability, special needs
7. **Insurance Verification**: Provider, policy information, coverage
8. **Summary & Completion**: Data review and next steps

## Data Extraction

### Extracted Information
- **Patient Demographics**: Name, phone, email, date of birth
- **Medical History**: Conditions, medications, allergies, surgeries
- **Current Symptoms**: Primary symptoms, severity (1-10), duration
- **Appointment Preferences**: Type, timing, physician preferences
- **Insurance Information**: Provider, policy number, coverage details
- **Consent Status**: HIPAA, treatment, data processing consent

### Medical Context Recognition
- **Symptom Categories**: Pain, breathing, digestive, neurological, cardiovascular
- **Condition Types**: Chronic, acute, mental health conditions
- **Medication Recognition**: Prescription, OTC, supplements
- **Duration Patterns**: Days, weeks, months, years
- **Severity Scaling**: 1-10 pain/symptom severity ratings

## Integration Capabilities

### Healthcare Systems
- **EHR Integration**: Epic, Cerner, Allscripts
- **CRM Platforms**: Salesforce Health Cloud, HubSpot
- **Patient Portals**: MyChart, FollowMyHealth
- **Insurance Systems**: Coverage verification and benefits checking

### API Orchestration (Pica)
- **OneTool SDK**: Single integration point for 100+ APIs
- **AuthKit**: Secure OAuth handling and token management
- **BuildKit**: Custom API integration generation
- **Real-time Sync**: Automatic data synchronization

## Security & Compliance

### HIPAA Compliance
- End-to-end encryption for all patient data
- Secure video streaming with encrypted channels
- Audit logging for all data access and modifications
- Role-based access control (RBAC)

### Data Protection
- AES-256 encryption at rest and in transit
- Secure token-based authentication
- Session timeout and automatic logout
- Data retention policies and secure deletion

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── VideoInterface.tsx
│   ├── PersonaSetup.tsx
│   └── Dashboard.tsx
├── services/           # API services
│   ├── tavusService.ts
│   ├── picaService.ts
│   └── dataExtractionService.ts
├── config/            # Configuration
│   └── personas.ts
├── types/             # TypeScript definitions
│   └── index.ts
└── utils/             # Utility functions
    └── cn.ts
```

### Key Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with comprehensive interfaces
- **Tailwind CSS**: Utility-first CSS with healthcare design system
- **Vite**: Fast development server and build tool
- **Lucide React**: Professional icon library

### Mock Development Mode
The application includes comprehensive mock implementations for development:
- Mock Tavus video sessions with simulated streaming
- Mock Pica integrations with realistic API responses
- Simulated data extraction and processing
- Local storage persistence for development data

## Deployment

### Production Build
```bash
npm run build
```

### Environment Configuration
- Configure production API endpoints
- Set up SSL certificates for HTTPS
- Configure CORS policies for video streaming
- Set up monitoring and logging

### Healthcare Compliance
- Ensure HIPAA compliance in production environment
- Configure audit logging and monitoring
- Set up secure backup and disaster recovery
- Implement access controls and user management

## Roadmap

### Phase 2: Technical Implementation (Next)
- Production Tavus integration with real video streaming
- Complete Pica API integration with healthcare systems
- Advanced NLP for medical terminology extraction
- Multi-language support for diverse patient populations

### Phase 3: Testing & Deployment
- Comprehensive security audit and penetration testing
- Performance testing with concurrent video sessions
- User acceptance testing with healthcare professionals
- Production deployment with monitoring and alerting

### Future Enhancements
- AI-powered symptom analysis and triage
- Integration with telemedicine platforms
- Advanced analytics and reporting dashboard
- Mobile application for patient access

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Review the documentation and API references

---

**Healthcare Video Assistant** - Transforming patient consultations through AI-powered video interactions and seamless healthcare system integration.