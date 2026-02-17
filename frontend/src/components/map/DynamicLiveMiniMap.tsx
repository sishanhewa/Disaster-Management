import { lazy, Suspense } from 'react';
import Loading from '../ui/Loading';

interface Props {
  lat?: number | null;
  lng?: number | null;
  zoom?: number;
  locationName?: string;
}

const LazyMiniMap = lazy(() => import('./LiveMiniMap'));

export default function DynamicLiveMiniMap({ lat, lng, zoom, locationName }: Props) {
  return (
    <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-slate-900 animate-pulse"><Loading size="sm" /></div>}>
      <LazyMiniMap lat={lat} lng={lng} zoom={zoom} locationName={locationName} />
    </Suspense>
  );
}
