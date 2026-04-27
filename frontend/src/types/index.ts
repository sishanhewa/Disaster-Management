// Barrel file — re-export all types and provide legacy aliases
export {
  type Camp,
  type CollectionPoint,
  type ReliefNeed,
  type ReliefPledge,
  type BroadcastAlert,
  type DisasterIncident,
  type ArcgisSensorReading,
  type ReliefAnalyticsSummary,
} from './relief';

// Legacy aliases used by the DM (Disaster-Management) codebase pages
// (CampDashboard, ReliefAdminPage, services/api.ts, AlertsManager)
export type { ReliefNeed as Need } from './relief';
export type { ReliefPledge as Pledge } from './relief';
export type { BroadcastAlert as CustomAlert } from './relief';
