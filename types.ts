
export interface Threat {
    id: string;
    target: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'ACTIVE' | 'MITIGATING' | 'NEUTRALIZED';
    description: string;
    timestamp: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}
