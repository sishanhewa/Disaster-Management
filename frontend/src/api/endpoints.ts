import apiClient from './client';

/* --- Auth --- */
export const authApi = {
  register: (data: any) => apiClient.post('/api/v1/auth/register', data).then(res => res.data),
  login: (data: any) => apiClient.post('/api/v1/auth/login', data).then(res => res.data),
  logout: () => apiClient.post('/api/v1/auth/logout').then(res => res.data),
  refresh: () => apiClient.post('/api/v1/auth/refresh').then(res => res.data),
};

/* --- Weather --- */
export const weatherApi = {
  getSpatialUnitWeather: (id: string) => apiClient.get(`/api/v1/weather/spatial-unit/${id}`).then(res => res.data),
  searchLocations: (q: string) => apiClient.get('/api/v1/weather/search', { params: { q } }).then(res => res.data),
  getNearestWeather: (lat: number, lng: number) => apiClient.get('/api/v1/weather/exact', { params: { lat, lng } }).then(res => res.data),
  getActiveWarningsForUnit: (spatialUnitId: string) => apiClient.get(`/api/v1/weather/active-warnings/${spatialUnitId}`).then(res => res.data),
  getForecast: (lat: number, lng: number) => apiClient.get('/api/v1/weather/exact', { params: { lat, lng } }).then(res => res.data),
  getTrackedWeather: () => apiClient.get('/api/v1/weather/tracked').then(res => res.data),
};

/* --- Disasters --- */
export const disastersApi = {
  getActiveWarnings: () => apiClient.get('/api/v1/disasters/warnings/active').then(res => res.data),
  getWarning: (id: string) => apiClient.get(`/api/v1/disasters/warnings/${id}`).then(res => res.data),
  getProposedWarnings: (params?: any) => apiClient.get('/api/v1/admin/warnings/proposed', { params }).then(res => res.data),
  approveProposedWarning: (id: string) => apiClient.post(`/api/v1/admin/warnings/${id}/approve`).then(res => res.data),
  rejectProposedWarning: (id: string, reason: string) => apiClient.post(`/api/v1/admin/warnings/${id}/reject`, { reason }).then(res => res.data),
};

/* --- Reports --- */
export const reportsApi = {
  createReport: (data: any) => apiClient.post('/api/v1/reports', data).then(res => res.data),
  getPublicReports: (params?: any) => apiClient.get('/api/v1/reports/public', { params }).then(res => res.data),
  getMyReports: (params?: any) => apiClient.get('/api/v1/reports/mine', { params }).then(res => res.data),
  updateMyReport: (id: string, data: any) => apiClient.put(`/api/v1/reports/${id}`, data).then(res => res.data),
  deleteMyReport: (id: string) => apiClient.delete(`/api/v1/reports/${id}`).then(res => res.data),
  confirmReport: (id: string, isConfirmation: boolean) => apiClient.post(`/api/v1/reports/${id}/confirm`, { isConfirmation }).then(res => res.data),
};

/* --- Flood --- */
export const floodApi = {
  getFloodDashboard: () => apiClient.get('/api/v1/flood/dashboard').then(res => res.data),
  getRivernetStatus: () => apiClient.get('/api/v1/flood/rivernet/status').then(res => res.data),
  getArcgisGeoJson: (layerName: string) => apiClient.get(`/api/v1/flood/arcgis/geojson/${layerName}`).then(res => res.data),
  getArcgisSummary: () => apiClient.get('/api/v1/flood/arcgis/summary').then(res => res.data),
  getArcgisStations: () => apiClient.get('/api/v1/flood/arcgis/stations').then(res => res.data),
  getArcgisGaugeHistory: (name: string) => apiClient.get(`/api/v1/flood/arcgis/gauges/${name}/history`).then(res => res.data),
  getArcgisRainfallTop: (limit = 10) => apiClient.get('/api/v1/flood/arcgis/rainfall/top', { params: { limit } }).then(res => res.data),
  getRivernetDevices: () => apiClient.get('/api/v1/flood/rivernet/devices').then(res => res.data),
  getRivernetLiveStatus: (deviceType: string, keys: string[]) => apiClient.get('/api/v1/flood/rivernet/live-status', { params: { deviceType, keys } }).then(res => res.data),
  getRivernetChart: (deviceKey: string, start: number, end: number) => apiClient.get(`/api/v1/flood/rivernet/chart/${deviceKey}`, { params: { start, end } }).then(res => res.data),
  syncRivernetDevices: () => apiClient.post('/api/v1/flood/rivernet/sync').then(res => res.data),
};

/* --- Meteo --- */
export const meteoApi = {
  getBulletins: () => apiClient.get('/api/v1/meteo/bulletins').then(res => res.data),
  getForecast: () => apiClient.get('/api/v1/meteo/forecast').then(res => res.data),
  getMarine: () => apiClient.get('/api/v1/meteo/marine').then(res => res.data),
  getFleet: () => apiClient.get('/api/v1/meteo/fleet').then(res => res.data),
  getAdvisories: () => apiClient.get('/api/v1/meteo/advisories').then(res => res.data),
  getGraphics: () => apiClient.get('/api/v1/meteo/graphics').then(res => res.data),
  getPdfs: () => apiClient.get('/api/v1/meteo/pdfs').then(res => res.data),
  getThreeHourly: () => apiClient.get('/api/v1/meteo/3hourly').then(res => res.data),
};

/* --- Map --- */
export const mapApi = {
  getLiveData: () => apiClient.get('/api/v1/map/live-data').then(res => res.data),
  getAnnouncements: () => apiClient.get('/api/v1/map/announcements').then(res => res.data),
};

/* --- Analytics --- */
export const analyticsApi = {
  getOverview: (spatialUnitId: string) => apiClient.get(`/api/v1/analytics/overview/${spatialUnitId}`).then(res => res.data),
  getForecastAccuracy: (spatialUnitId: string, params?: { days?: number; metric?: string }) =>
    apiClient.get(`/api/v1/analytics/forecast-accuracy/${spatialUnitId}`, { params }).then(res => res.data),
  getForecastHistory: (spatialUnitId: string, metric: string, params?: { days?: number }) =>
    apiClient.get(`/api/v1/analytics/forecast-history/${spatialUnitId}/${metric}`, { params }).then(res => res.data),
  // NEW: Satellite rainfall comparison (JAXA vs Station vs Model)
  getSatelliteRainfall: (spatialUnitId: string, params?: { days?: number }) =>
    apiClient.get(`/api/v1/analytics/satellite-rain/${spatialUnitId}`, { params }).then(res => res.data),
  // NEW: Station comparison (Ground truth vs interpolated)
  getStationComparison: (spatialUnitId: string) =>
    apiClient.get(`/api/v1/analytics/station-comparison/${spatialUnitId}`).then(res => res.data),
  // NEW: Hourly trend for detailed charts
  getHourlyTrend: (spatialUnitId: string, params?: { hours?: number; metric?: string }) =>
    apiClient.get(`/api/v1/analytics/hourly-trend/${spatialUnitId}`, { params }).then(res => res.data),
};

/* --- Emergency --- */
export const emergencyApi = {
  createSos: (data: any) => apiClient.post('/api/v1/emergency/sos', data).then(res => res.data),
  getMySosIncidents: () => apiClient.get('/api/v1/emergency/sos/mine').then(res => res.data),
  closeMySos: (id: string) => apiClient.delete(`/api/v1/emergency/sos/${id}`).then(res => res.data),
  getAvailableResources: (params?: any) => apiClient.get('/api/v1/emergency/resources', { params }).then(res => res.data),
  getAvailableTasks: () => apiClient.get('/api/v1/emergency/tasks').then(res => res.data),
  getAllTasks: () => apiClient.get('/api/v1/emergency/tasks', { params: { all: true } }).then(res => res.data),
  createTask: (data: any) => apiClient.post('/api/v1/emergency/tasks', data).then(res => res.data),
  acceptTask: (id: string) => apiClient.put(`/api/v1/emergency/tasks/${id}/accept`).then(res => res.data),
  completeTask: (id: string) => apiClient.put(`/api/v1/emergency/tasks/${id}/complete`).then(res => res.data),
};

/* --- Users --- */
export const usersApi = {
  getProfile: () => apiClient.get('/api/v1/users/me').then(res => res.data),
  updateProfile: (data: any) => apiClient.put('/api/v1/users/me', data).then(res => res.data),
  updatePreferences: (data: any) => apiClient.put('/api/v1/users/me/preferences', data).then(res => res.data),
  changePassword: (data: any) => apiClient.post('/api/v1/users/me/change-password', data).then(res => res.data),
  getSavedLocations: () => apiClient.get('/api/v1/users/me/saved-locations').then(res => res.data),
  addSavedLocation: (data: any) => apiClient.post('/api/v1/users/me/saved-locations', data).then(res => res.data),
  deleteSavedLocation: (locationId: string) => apiClient.delete(`/api/v1/users/me/saved-locations/${locationId}`).then(res => res.data),
};

/* --- Notifications --- */
export const notificationsApi = {
  getNotifications: (params?: any) => apiClient.get('/api/v1/notifications', { params }).then(res => res.data),
  getUnreadCount: () => apiClient.get('/api/v1/notifications/unread-count').then(res => res.data),
  markAsRead: (id: string) => apiClient.put(`/api/v1/notifications/${id}/read`).then(res => res.data),
  markAllAsRead: () => apiClient.put('/api/v1/notifications/mark-all-read').then(res => res.data),
  broadcast: (data: any) => apiClient.post('/api/v1/notifications/admin/broadcast', data).then(res => res.data),
};

/* --- Alert Rules --- */
export const alertRulesApi = {
  getAlertRules: () => apiClient.get('/api/v1/alert-rules').then(res => res.data),
  createAlertRule: (data: any) => apiClient.post('/api/v1/alert-rules', data).then(res => res.data),
  updateAlertRule: (id: string, data: any) => apiClient.put(`/api/v1/alert-rules/${id}`, data).then(res => res.data),
  deleteAlertRule: (id: string) => apiClient.delete(`/api/v1/alert-rules/${id}`).then(res => res.data),
  toggleAlertRule: (id: string) => apiClient.put(`/api/v1/alert-rules/${id}/toggle`).then(res => res.data),
};

/* --- Guides --- */
export const guidesApi = {
  getGuides: (language = 'en') => apiClient.get('/api/v1/guides', { params: { language } }).then(res => res.data),
  getGuideBySlug: (slug: string) => apiClient.get(`/api/v1/guides/${slug}`).then(res => res.data),
  createGuide: (data: any) => apiClient.post('/api/v1/admin/guides', data).then(res => res.data),
  updateGuide: (id: string, data: any) => apiClient.put(`/api/v1/admin/guides/${id}`, data).then(res => res.data),
};

/* --- FAQ --- */
export const faqApi = {
  getFaqs: (language = 'en') => apiClient.get('/api/v1/faq', { params: { language } }).then(res => res.data),
  createFaq: (data: any) => apiClient.post('/api/v1/admin/faq', data).then(res => res.data),
  updateFaq: (id: string, data: any) => apiClient.put(`/api/v1/admin/faq/${id}`, data).then(res => res.data),
};

/* --- Admin --- */
export const adminApi = {
  getStats: () => apiClient.get('/api/v1/admin/dashboard/stats').then(res => res.data),
  getAllUsers: (params?: any) => apiClient.get('/api/v1/admin/users', { params }).then(res => res.data),
  getUserById: (id: string) => apiClient.get(`/api/v1/admin/users/${id}`).then(res => res.data),
  updateUser: (id: string, data: any) => apiClient.put(`/api/v1/admin/users/${id}`, data).then(res => res.data),
  updateUserRoles: (id: string, roles: string[]) => apiClient.put(`/api/v1/admin/users/${id}/roles`, { roles }).then(res => res.data),
  deactivateUser: (id: string) => apiClient.put(`/api/v1/admin/users/${id}/deactivate`).then(res => res.data),
  reactivateUser: (id: string) => apiClient.put(`/api/v1/admin/users/${id}/reactivate`).then(res => res.data),
  getAllWarnings: (params?: any) => apiClient.get('/api/v1/admin/warnings', { params }).then(res => res.data),
  createWarning: (data: any) => apiClient.post('/api/v1/admin/warnings', data).then(res => res.data),
  updateWarning: (id: string, data: any) => apiClient.put(`/api/v1/admin/warnings/${id}`, data).then(res => res.data),
  resolveWarning: (id: string) => apiClient.delete(`/api/v1/admin/warnings/${id}`).then(res => res.data),
  hardDeleteWarning: (id: string) => apiClient.delete(`/api/v1/admin/warnings/${id}/hard`).then(res => res.data),
  getAllReports: (params?: any) => apiClient.get('/api/v1/admin/reports', { params }).then(res => res.data),
  updateReportStatus: (id: string, data: any) => apiClient.put(`/api/v1/admin/reports/${id}/status`, data).then(res => res.data),
  deleteReport: (id: string) => apiClient.delete(`/api/v1/admin/reports/${id}`).then(res => res.data),
  getCustomZones: () => apiClient.get('/api/v1/map/custom-zones').then(res => res.data),
  // Emergency Admin
  createResource: (data: any) => apiClient.post('/api/v1/admin/emergency/resources', data).then(res => res.data),
  updateResource: (id: string, data: any) => apiClient.put(`/api/v1/admin/emergency/resources/${id}`, data).then(res => res.data),
  deleteResource: (id: string) => apiClient.delete(`/api/v1/admin/emergency/resources/${id}`).then(res => res.data),
  listVolunteers: () => apiClient.get('/api/v1/emergency/volunteers').then(res => res.data),
  updateTask: (id: string, data: any) => apiClient.put(`/api/v1/admin/emergency/tasks/${id}`, data).then(res => res.data),
  assignTask: (id: string, volunteerId: string) => apiClient.put(`/api/v1/admin/emergency/tasks/${id}/assign`, null, { params: { volunteerId } }).then(res => res.data),
  deleteTask: (id: string) => apiClient.delete(`/api/v1/admin/emergency/tasks/${id}`).then(res => res.data),
  getActiveSos: () => apiClient.get('/api/v1/admin/sos').then(res => res.data),
  respondToSos: (id: string) => apiClient.post(`/api/v1/admin/sos/${id}/respond`).then(res => res.data),
  updateSosStatus: (id: string, status: string) => apiClient.patch(`/api/v1/admin/sos/${id}/status`, null, { params: { status } }).then(res => res.data),
  createCustomZone: (data: any) => apiClient.post('/api/v1/admin/map/zones', data).then(res => res.data),
  updateCustomZone: (id: string, data: any) => apiClient.put(`/api/v1/admin/map/zones/${id}`, data).then(res => res.data),
  deleteCustomZone: (id: string) => apiClient.delete(`/api/v1/admin/map/zones/${id}`).then(res => res.data),
  // System Management (God Mode)
  getSystemConfigs: () => apiClient.get('/api/v1/admin/system/config').then(res => res.data),
  setSystemConfig: (data: { key: string, value: string, description?: string }) => apiClient.put('/api/v1/admin/system/config', data).then(res => res.data),
  getErrors: (params?: any) => apiClient.get('/api/v1/admin/system/errors', { params }).then(res => res.data),
  resolveError: (id: string) => apiClient.put(`/api/v1/admin/system/errors/${id}/resolve`).then(res => res.data),
  getCircuitBreakerStats: () => apiClient.get('/api/v1/admin/system/metrics/circuit-breaker').then(res => res.data),
  getApiKeyStats: () => apiClient.get('/api/v1/admin/system/metrics/api-keys').then(res => res.data),
  getFallbackStats: () => apiClient.get('/api/v1/admin/system/metrics/fallback').then(res => res.data),
  resetCircuitBreaker: (serviceName: string) => apiClient.post(`/api/v1/admin/system/metrics/circuit-breaker/${serviceName}/reset`).then(res => res.data),
  
  // Spatial Units CRUD
  getSpatialUnits: (params?: any) => apiClient.get('/api/v1/admin/spatial-units', { params }).then(res => res.data),
  createSpatialUnit: (data: any) => apiClient.post('/api/v1/admin/spatial-units', data).then(res => res.data),
  updateSpatialUnit: (id: string, data: any) => apiClient.put(`/api/v1/admin/spatial-units/${id}`, data).then(res => res.data),
  deleteSpatialUnit: (id: string) => apiClient.delete(`/api/v1/admin/spatial-units/${id}`).then(res => res.data),
  getSpatialUnitMappings: (id: string, limit?: number) => apiClient.get(`/api/v1/admin/spatial-units/${id}/mappings`, { params: { limit } }).then(res => res.data),
  getSpatialUnitChildren: (id: string, params?: any) => apiClient.get(`/api/v1/admin/spatial-units/${id}/children`, { params }).then(res => res.data),
  getSpatialUnitWeatherInsight: (id: string, limit?: number) => apiClient.get(`/api/v1/admin/spatial-units/${id}/weather-insight`, { params: { limit } }).then(res => res.data),

  // Weather Nodes CRUD
  getWeatherNodes: (params?: any) => apiClient.get('/api/v1/admin/weather-nodes', { params }).then(res => res.data),
  createWeatherNode: (data: any) => apiClient.post('/api/v1/admin/weather-nodes', data).then(res => res.data),
  updateWeatherNode: (id: string, data: any) => apiClient.put(`/api/v1/admin/weather-nodes/${id}`, data).then(res => res.data),
  deleteWeatherNode: (id: string) => apiClient.delete(`/api/v1/admin/weather-nodes/${id}`).then(res => res.data),
  getWeatherNodeLiveTelemetry: (id: string) => apiClient.get(`/api/v1/admin/weather-nodes/${id}/live-data`).then(res => res.data),
  getWeatherNodeLiveTelemetrySummary: (id: string) => apiClient.get(`/api/v1/admin/weather-nodes/${id}/live-data/summary`).then(res => res.data),

  // Workers / Setup
  triggerSpatialImport: () => apiClient.post('/api/v1/admin/setup/import-spatial').then(res => res.data),
  getSpatialImportStatus: () => apiClient.get('/api/v1/admin/setup/import-status').then(res => res.data),
  triggerGenerateNodes: () => apiClient.post('/api/v1/admin/setup/generate-nodes').then(res => res.data),
  triggerComputeIdw: () => apiClient.post('/api/v1/admin/setup/compute-idw').then(res => res.data),
  getIdwStatus: () => apiClient.get('/api/v1/admin/setup/idw-status').then(res => res.data),
  triggerBackfillHistory: (days = 730) => apiClient.post('/api/v1/admin/setup/backfill-history', null, { params: { days } }).then(res => res.data),
  triggerWeatherSync: () => apiClient.post('/api/v1/admin/setup/sync-weather').then(res => res.data),
  triggerForecastSync: () => apiClient.post('/api/v1/admin/setup/sync-forecasts').then(res => res.data),
  triggerEvictCache: () => apiClient.post('/api/v1/admin/setup/evict-cache').then(res => res.data),
  triggerMeteoSync: () => apiClient.post('/api/v1/admin/setup/sync-meteo').then(res => res.data),
  triggerFloodSync: () => apiClient.post('/api/v1/admin/setup/sync-flood').then(res => res.data),
  triggerRivernetSync: () => apiClient.post('/api/v1/admin/setup/sync-rivernet').then(res => res.data),
  triggerCacheWarming: () => apiClient.post('/api/v1/admin/setup/warm-cache').then(res => res.data),
  triggerAlertEvaluation: () => apiClient.post('/api/v1/admin/setup/evaluate-alerts').then(res => res.data),
  getWorkersStatus: () => apiClient.get('/api/v1/admin/setup/workers/status').then(res => res.data),
  runWorker: (workerKey: string, params?: { days?: number }) => apiClient.post(`/api/v1/admin/setup/workers/run/${workerKey}`, null, { params }).then(res => res.data),
  getAiTrainingData: (spatialUnitId: string, days = 365) => apiClient.get('/api/v1/admin/ai-export/training-data', { params: { spatialUnitId, days } }).then(res => res.data),
};

/* --- Media --- */
export const mediaApi = {
  upload: (file: File, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return apiClient.post('/api/v1/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },
};

/* --- Relief Camps (SIDMS — Step 5) --- */
export const campsApi = {
  getAll: () => apiClient.get('/api/v1/camps').then(res => res.data),
  getById: (id: string) => apiClient.get(`/api/v1/camps/${id}`).then(res => res.data),
  getByDistrict: (district: string) => apiClient.get(`/api/v1/camps/district/${district}`).then(res => res.data),
  getByManager: (managerId: string) => apiClient.get(`/api/v1/camps/manager/${managerId}`).then(res => res.data),
  create: (data: any) => apiClient.post('/api/v1/camps', data).then(res => res.data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/camps/${id}`, data).then(res => res.data),
  delete: (id: string) => apiClient.delete(`/api/v1/camps/${id}`).then(res => res.data),
};

/* --- Expert Python Predictions API (SIDMS) --- */
import axios from 'axios';
const PREDICTION_SERVER = 'http://104.208.67.128:8000';
export const predictionsApi = {
  getAllStatus: () => axios.get(`${PREDICTION_SERVER}/stations/status/all`).then(res => res.data),
  getHistory: (stationId: number, days = 1) => axios.get(`${PREDICTION_SERVER}/stations/${stationId}/history?days=${days}`).then(res => res.data),
  getAccuracy: (stationId: number) => axios.get(`${PREDICTION_SERVER}/stations/${stationId}/accuracy?hours=24`).then(res => res.data),
};

/* --- Relief Needs (SIDMS) --- */
export const needsApi = {
  getAll: () => apiClient.get('/api/v1/needs').then(res => res.data),
  getByCamp: (campId: string) => apiClient.get(`/api/v1/needs/camp/${campId}`).then(res => res.data),
  getByManager: (managerId: string) => apiClient.get(`/api/v1/needs/manager/${managerId}`).then(res => res.data),
  create: (data: any) => apiClient.post('/api/v1/needs', data).then(res => res.data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/needs/${id}`, data).then(res => res.data),
  updateStatus: (id: string, isActive: boolean) =>
    apiClient.put(`/api/v1/needs/${id}/status`, { isActive }).then(res => res.data),
  delete: (id: string) => apiClient.delete(`/api/v1/needs/${id}`).then(res => res.data),
};

/* --- Relief Pledges (SIDMS) --- */
export const pledgesApi = {
  getByManager: (managerId: string) => apiClient.get(`/api/v1/pledges/manager/${managerId}`).then(res => res.data),
  getByNeed: (needId: string) => apiClient.get(`/api/v1/pledges/need/${needId}`).then(res => res.data),
  getMyPledges: () => apiClient.get('/api/v1/pledges/my').then(res => res.data),
  create: (data: any) => apiClient.post('/api/v1/pledges', data).then(res => res.data),
  updateStatus: (id: string, status: string) =>
    apiClient.put(`/api/v1/pledges/${id}/status`, { status }).then(res => res.data),
};

/* --- Collection Points (SIDMS) --- */
export const collectionPointsApi = {
  getAll: () => apiClient.get('/api/v1/collection-points').then(res => res.data),
  create: (data: any) => apiClient.post('/api/v1/collection-points', data).then(res => res.data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/collection-points/${id}`, data).then(res => res.data),
  delete: (id: string) => apiClient.delete(`/api/v1/collection-points/${id}`).then(res => res.data),
};

/* --- Disaster Incidents (SIDMS / ArcGIS field reports) --- */
export const incidentsApi = {
  getAll: () => apiClient.get('/api/v1/incidents').then(res => res.data),
  getActive: () => apiClient.get('/api/v1/incidents/active').then(res => res.data),
  getById: (id: string) => apiClient.get(`/api/v1/incidents/${id}`).then(res => res.data),
  getByDistrict: (district: string) => apiClient.get(`/api/v1/incidents/district/${district}`).then(res => res.data),
  getByHazard: (hazardType: string) => apiClient.get(`/api/v1/incidents/hazard/${hazardType}`).then(res => res.data),
  create: (data: any) => apiClient.post('/api/v1/incidents', data).then(res => res.data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/incidents/${id}`, data).then(res => res.data),
  delete: (id: string) => apiClient.delete(`/api/v1/incidents/${id}`).then(res => res.data),
};

/* --- ArcGIS Sensor Readings (SIDMS) --- */
export const sensorReadingsApi = {
  getLatest: () => apiClient.get('/api/v1/sensor-readings/latest').then(res => res.data),
  getHistory: (locationName: string, hazardType: string, daysBack = 7) =>
    apiClient.get('/api/v1/sensor-readings/history', {
      params: { locationName, hazardType, daysBack },
    }).then(res => res.data),
};

/* --- Broadcast Alerts (SIDMS) --- */
export const broadcastAlertsApi = {
  getActive: () => apiClient.get('/api/v1/broadcast-alerts/active').then(res => res.data),
  getAll: () => apiClient.get('/api/v1/broadcast-alerts').then(res => res.data),
  getById: (id: string) => apiClient.get(`/api/v1/broadcast-alerts/${id}`).then(res => res.data),
  create: (data: any) => apiClient.post('/api/v1/broadcast-alerts', data).then(res => res.data),
  update: (id: string, data: any) => apiClient.put(`/api/v1/broadcast-alerts/${id}`, data).then(res => res.data),
  delete: (id: string) => apiClient.delete(`/api/v1/broadcast-alerts/${id}`).then(res => res.data),
};

/* --- Relief Analytics (SIDMS) --- */
export const reliefAnalyticsApi = {
  getSummary: () => apiClient.get('/api/v1/relief/analytics/summary').then(res => res.data),
};

/* --- AI Chatbot Proxy (Step 9 — routes to ai-service /chat via Vite proxy) --- */
export const aiApi = {
  /**
   * Send a chat message to the SIDMS Guide (Gemini 2.5 Flash).
   * The API key is stored server-side in ai-service/.env (GEMINI_API_KEY).
   *
   * @param messages - conversation history (excluding the system welcome message)
   * @param query    - the new user message to send
   */
  chat: (
    messages: Array<{ role: 'user' | 'model'; content: string }>,
    query: string,
  ): Promise<{ response: string; model: string }> =>
    fetch('/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, query }),
    }).then(res => {
      if (!res.ok) throw new Error(`AI chat proxy error: ${res.status}`);
      return res.json();
    }),
};

/* --- Verification & Volunteer (OTP verification for email/phone/volunteer) --- */
export const verificationApi = {
  getStatus: () => apiClient.get('/api/verification/status').then(res => res.data),
  requestEmailVerification: () => apiClient.post('/api/verification/email/request', {}).then(res => res.data),
  verifyEmail: (otp: string) => apiClient.post('/api/verification/email/verify', { otp }).then(res => res.data),
  requestVolunteerVerification: (phone: string) => apiClient.post('/api/verification/volunteer/request', { phone }).then(res => res.data),
  verifyVolunteer: (otp: string) => apiClient.post('/api/verification/volunteer/verify', { otp }).then(res => res.data),
  toggleVolunteerStatus: () => apiClient.post('/api/verification/volunteer/toggle').then(res => res.data),
};
