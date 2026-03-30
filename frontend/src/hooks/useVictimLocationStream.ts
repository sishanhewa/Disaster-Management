import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Hook for victims to stream their GPS location to responders via WebSocket.
 * Used on EmergencyPage when user has an active SOS incident.
 */
export const useVictimLocationStream = (
  incidentId: string | null,
  token: string | null,
  isActive: boolean
) => {
  const clientRef = useRef<Client | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Send location update via WebSocket
  const sendLocation = useCallback(
    (lat: number, lng: number, accuracy?: number) => {
      if (!clientRef.current?.connected || !incidentId) return;

      clientRef.current.publish({
        destination: `/app/sos/${incidentId}/location`,
        body: JSON.stringify({
          lat,
          lng,
          accuracy,
          timestamp: new Date().toISOString(),
        }),
      });
    },
    [incidentId]
  );

  useEffect(() => {
    if (!incidentId || !token || !isActive) {
      // Cleanup
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      return;
    }

    // Connect WebSocket
    const socket = new SockJS(`${import.meta.env.VITE_API_URL || ''}/ws/sos`);
    const client = new Client({
      webSocketFactory: () => socket as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[VictimStream]', str);
        }
      },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log('[VictimStream] Connected, streaming location for SOS:', incidentId);

      // Start watching GPS position
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            sendLocation(
              position.coords.latitude,
              position.coords.longitude,
              position.coords.accuracy
            );
          },
          (error) => {
            console.error('[VictimStream] GPS error:', error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000, // 10 seconds
            timeout: 10000,
          }
        );
      }
    };

    client.onStompError = (frame) => {
      console.error('[VictimStream] STOMP error:', frame.headers.message);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [incidentId, token, isActive, sendLocation]);

  return {
    isStreaming: !!clientRef.current?.connected,
  };
};

export default useVictimLocationStream;
