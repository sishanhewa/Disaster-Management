import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface LocationUpdate {
  type: 'VICTIM_LOCATION' | 'RESPONDER_LOCATION';
  userId?: string;
  responderId?: string;
  responderName?: string;
  lat: number;
  lng: number;
  accuracy?: number;
  batteryLevel?: number;
  status?: string;
  timestamp: string;
}

interface StatusUpdate {
  type: 'STATUS_UPDATE';
  status: string;
  message?: string;
  updatedBy: string;
  timestamp: string;
}

interface UseSosWebSocketReturn {
  victimLocation: LocationUpdate | null;
  responderLocations: Map<string, LocationUpdate>;
  statusUpdates: StatusUpdate[];
  isConnected: boolean;
  error: string | null;
  sendVictimLocation: (lat: number, lng: number, batteryLevel?: number) => void;
  sendResponderLocation: (lat: number, lng: number, status: string) => void;
}

export const useSosWebSocket = (
  incidentId: string | null,
  token: string | null
): UseSosWebSocketReturn => {
  const clientRef = useRef<Client | null>(null);
  const [victimLocation, setVictimLocation] = useState<LocationUpdate | null>(null);
  const [responderLocations, setResponderLocations] = useState<Map<string, LocationUpdate>>(new Map());
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!incidentId || !token) {
      setError('Missing incident ID or authentication token');
      return;
    }

    const socket = new SockJS(`${import.meta.env.VITE_API_URL || ''}/ws/sos`);
    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[WebSocket]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      setError(null);
      console.log('[SOS WebSocket] Connected to incident:', incidentId);

      // Subscribe to victim location updates
      client.subscribe(`/topic/sos/${incidentId}/victim`, (message: IMessage) => {
        try {
          const data: LocationUpdate = JSON.parse(message.body);
          setVictimLocation(data);
        } catch (err) {
          console.error('[SOS WebSocket] Failed to parse victim location:', err);
        }
      });

      // Subscribe to responder location updates
      client.subscribe(`/topic/sos/${incidentId}/responders`, (message: IMessage) => {
        try {
          const data: LocationUpdate = JSON.parse(message.body);
          if (data.responderId) {
            setResponderLocations((prev) => {
              const newMap = new Map(prev);
              newMap.set(data.responderId!, data);
              return newMap;
            });
          }
        } catch (err) {
          console.error('[SOS WebSocket] Failed to parse responder location:', err);
        }
      });

      // Subscribe to status updates
      client.subscribe(`/topic/sos/${incidentId}/status`, (message: IMessage) => {
        try {
          const data: StatusUpdate = JSON.parse(message.body);
          setStatusUpdates((prev) => [...prev, data].slice(-10)); // Keep last 10
        } catch (err) {
          console.error('[SOS WebSocket] Failed to parse status update:', err);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('[SOS WebSocket] STOMP error:', frame.headers.message);
      setError(frame.headers.message || 'WebSocket connection error');
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      console.log('[SOS WebSocket] Connection closed');
      setIsConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [incidentId, token]);

  const sendVictimLocation = useCallback(
    (lat: number, lng: number, batteryLevel?: number) => {
      if (!clientRef.current?.connected || !incidentId) return;

      clientRef.current.publish({
        destination: `/app/sos/${incidentId}/location`,
        body: JSON.stringify({
          lat,
          lng,
          batteryLevel,
          accuracy: 10,
        }),
      });
    },
    [incidentId]
  );

  const sendResponderLocation = useCallback(
    (lat: number, lng: number, status: string) => {
      if (!clientRef.current?.connected || !incidentId) return;

      clientRef.current.publish({
        destination: `/app/sos/${incidentId}/responder/location`,
        body: JSON.stringify({
          lat,
          lng,
          status,
          accuracy: 10,
        }),
      });
    },
    [incidentId]
  );

  return {
    victimLocation,
    responderLocations,
    statusUpdates,
    isConnected,
    error,
    sendVictimLocation,
    sendResponderLocation,
  };
};

export default useSosWebSocket;
