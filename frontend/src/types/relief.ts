// Step 5+6+7: Complete API types for the SIDMS relief domain
// Ported from Disaster-Management-master/frontend/src/types.ts with CS-aligned field naming

export interface Camp {
  id?: string;
  campName: string;
  district: string;
  address: string;
  capacity?: number;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
  manager?: { id: string; displayName: string; email: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionPoint {
  id?: string;
  name: string;
  address: string;
  operatingHours?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface ReliefNeed {
  id?: string;
  camp: Camp;
  itemName: string;
  category: string;
  quantityRequired: number;
  quantityPledged: number;
  quantityReceived: number;
  urgency: string;           // low | medium | high | critical
  imageUrl?: string;         // Cloudinary URL (replaces DM's imageBase64)
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReliefPledge {
  id?: string;
  donor?: { id: string; displayName: string } | null;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  need: Pick<ReliefNeed, 'id' | 'itemName'>;
  quantity: number;
  status: string;            // pending | collected | delivered
  qrCodeUuid?: string;
  collectionPoint?: Pick<CollectionPoint, 'id' | 'name'> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BroadcastAlert {
  id?: string;
  title: string;
  message: string;
  severity: string;          // info | warning | critical
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DisasterIncident {
  id?: string;
  title: string;
  district: string;
  hazardType: string;
  severity: string;
  affectedPeople: number;
  casualties: number;
  damageEstimateLkr: number;
  responseStatus: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  reportedBy?: string;
  arcgisObjectId?: number;
  incidentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArcgisSensorReading {
  id?: string;
  locationName: string;
  hazardType: string;
  measuredValue: number;
  unit: string;
  dangerLevel: string;
  observationTime: string;
  fetchedAt?: string;
}

export interface ReliefAnalyticsSummary {
  totalCamps: number;
  totalActiveNeeds: number;
  totalPledges: number;
  totalItemsRequired: number;
  totalItemsPledged: number;
}
