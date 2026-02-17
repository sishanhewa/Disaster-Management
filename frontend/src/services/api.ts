import axios from 'axios';
import type { Camp, Need, Pledge, CollectionPoint, CustomAlert } from '../types';

const API_BASE = 'http://localhost:8080/api';

class BaseService<T> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = `${API_BASE}/${endpoint}`;
    }

    async getAll(): Promise<T[]> {
        const res = await axios.get(this.endpoint);
        return res.data;
    }

    async create(data: Partial<T>): Promise<T> {
        const res = await axios.post(this.endpoint, data);
        return res.data;
    }
}

class CampService extends BaseService<Camp> {
    constructor() { super('camps'); }
    async getByManager(id: string): Promise<Camp[]> {
        const res = await axios.get(`${this.endpoint}/manager/${id}`);
        return res.data;
    }
}

class NeedService extends BaseService<Need> {
    constructor() { super('needs'); }
    async getByManager(id: string): Promise<Need[]> {
        const res = await axios.get(`${this.endpoint}/manager/${id}`);
        return res.data;
    }
}

class PledgeService extends BaseService<Pledge> {
    constructor() { super('pledges'); }
    async updateStatus(id: string, status: string): Promise<Pledge> {
        const res = await axios.put(`${this.endpoint}/${id}/status`, { status });
        return res.data;
    }
    async getByManager(id: string): Promise<Pledge[]> {
        const res = await axios.get(`${this.endpoint}/manager/${id}`);
        return res.data;
    }
}

class CollectionPointService extends BaseService<CollectionPoint> {
    constructor() { super('collection-points'); }
}

// Temporary Local Fallback for Alerts (since backend is offline)
let localAlerts: CustomAlert[] = [
    { id: '1', title: 'Heavy Rain Warning', message: 'Expecting 150mm rainfall in Colombo district over the next 24 hours. Avoid low-lying areas.', severity: 'critical', active: true, createdAt: new Date().toISOString() },
    { id: '2', title: 'Relief Pack Distribution', message: 'Distribution of dry rations at Kolonnawa camp starting at 2 PM today.', severity: 'info', active: true, createdAt: new Date().toISOString() }
];

class AlertService extends BaseService<CustomAlert> {
    constructor() { super('alerts'); }

    // Override with local fallback
    async getAll(): Promise<CustomAlert[]> {
        try {
            const res = await axios.get(this.endpoint);
            return res.data;
        } catch (e) {
            console.warn("Backend offline, using local alerts memory.");
            return [...localAlerts];
        }
    }

    async create(data: Partial<CustomAlert>): Promise<CustomAlert> {
        try {
            const res = await axios.post(this.endpoint, data);
            return res.data;
        } catch (e) {
            console.warn("Backend offline, saving alert to local memory.");
            const newAlert = { ...data, id: Date.now().toString(), active: true, createdAt: new Date().toISOString() } as CustomAlert;
            localAlerts = [newAlert, ...localAlerts];
            return newAlert;
        }
    }
}

export const api = {
    camps: new CampService(),
    needs: new NeedService(),
    pledges: new PledgeService(),
    collectionPoints: new CollectionPointService(),
    alerts: new AlertService()
};
