"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Navigation, Clock, Wifi, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  timezone: string;
  isp: string;
}

interface FullscreenMapModalProps {
  ipAddress: string;
  busId?: string;
  busName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FullscreenMapModal({
  ipAddress,
  busId,
  busName,
  isOpen,
  onClose,
}: FullscreenMapModalProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocation() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/location?ip=${encodeURIComponent(ipAddress)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch location");
        }

        const data = await response.json();
        setLocation(data);
      } catch (err) {
        console.error("[v0] Location fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch location"
        );
      } finally {
        setLoading(false);
      }
    }

    if (ipAddress && isOpen) {
      fetchLocation();
    }
  }, [ipAddress, isOpen]);

  const mapUrl = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        location.longitude - 0.05
      },${location.latitude - 0.05},${location.longitude + 0.05},${
        location.latitude + 0.05
      }&layer=mapnik&marker=${location.latitude},${location.longitude}`
    : "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[95vh] w-[95vw] flex-col overflow-hidden rounded-xl border border-primary/20 bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Navigation className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {busName || `Bus ${busId || "Tracker"}`}
                </h2>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wifi className="h-3.5 w-3.5" />
                  IP: {ipAddress}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary"
            >
              <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
              Live
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {loading && (
            <div className="flex flex-1 items-center justify-center bg-muted/20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">
                  Loading location data...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-1 items-center justify-center bg-destructive/5">
              <div className="flex flex-col items-center gap-3 text-center">
                <MapPin className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium text-destructive">
                  Failed to load location
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && location && (
            <>
              <div className="relative flex-1">
                <iframe
                  src={mapUrl}
                  className="h-full w-full border-0"
                  title="Bus Location Map"
                  loading="lazy"
                />

                <div className="absolute left-16 top-2 rounded-lg border border-border bg-white/95 px-4 py-2 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-primary shadow-lg shadow-primary/50" />
                    <span className="text-sm font-semibold text-card-foreground">
                      Live Position
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-80 border-l border-border bg-muted/20 p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Location Details
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        Location
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {location.city}, {location.region}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {location.country}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Navigation className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        Coordinates
                      </span>
                    </div>
                    <p className="font-mono text-base font-semibold text-foreground">
                      {location.latitude.toFixed(6)}°
                    </p>
                    <p className="font-mono text-base font-semibold text-foreground">
                      {location.longitude.toFixed(6)}°
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        Timezone
                      </span>
                    </div>
                    <p className="text-base font-semibold text-foreground">
                      {location.timezone}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-white p-4">
                    <div className="mb-2 flex items-center gap-2 text-accent">
                      <Wifi className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        Network Provider
                      </span>
                    </div>
                    <p className="text-balance text-base font-semibold text-foreground">
                      {location.isp}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
