// Simple types matching the Spring Boot Backend

export interface Camp {
    id?: string;
    campName: string;
    district: string;
    address: string;
}

export interface Need {
    id?: string;
    camp: Camp;
    itemName: string;
    category: string;
    quantityRequired: number;
    quantityPledged: number;
    quantityReceived: number;
    urgency: string;
    imageBase64?: string;
    createdAt?: string;
}

export interface CollectionPoint {
    id?: string;
    name: string;
    address: string;
    operatingHours: string;
}

export interface Pledge {
    id?: string;
    donorName?: string;
    donorEmail?: string;
    donorPhone?: string;
    need?: Need;
    quantity: number;
    status: string;
    donor?: any;
}

export interface CustomAlert {
    id?: string;
    title: string;
    message: string;
    severity: string; // 'info', 'warning', 'critical'
    active: boolean;
    createdAt?: string;
}
