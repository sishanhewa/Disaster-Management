import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocationContextValue {
  id: string;
  name: string;
  type: string;
  lat?: number;
  lng?: number;
  pcode?: string;
}

interface LocationContextState {
  selectedLocation: LocationContextValue | null;
  selectedTimeIso: string | null;
}

interface LocationContextActions {
  setSelectedLocation: (location: LocationContextValue | null) => void;
  setSelectedTimeIso: (timeIso: string | null) => void;
  clearContext: () => void;
}

export const useLocationContextStore = create<LocationContextState & LocationContextActions>()(
  persist(
    (set) => ({
      selectedLocation: null,
      selectedTimeIso: null,

      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setSelectedTimeIso: (timeIso) => set({ selectedTimeIso: timeIso }),
      clearContext: () => set({ selectedLocation: null, selectedTimeIso: null }),
    }),
    {
      name: 'sidms-location-context',
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        selectedTimeIso: state.selectedTimeIso,
      }),
    }
  )
);
