"use client";
import React, { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import DriverDetails from "./driverDetails";

import { Bus, MapPin } from "lucide-react";
import { FullscreenMapModal } from "./liveLocation";
import { Button } from "./ui/button";

type Bus = {
  busId: string;
  busName: string;
  busImg: string;
  busRoute: string;
  busDestination: string[];
  busDriverId: string;
  busIpAddress: string;
  busDepartureTime: string;
  busDepartureTime2: string;
  busArrivalTime: string;
  busArrivalTime2: string;
  busStatus?: "On Time" | "Late" | "In Jame" | "Maintenance";
  status?: "show" | "hidden";
};
type Sprops = {
  busData: Bus[];
  slug: string;
};

const ScheduleDetails = ({ busData, slug }: Sprops) => {
  const busIpAddress = "103.120.162.38";
  const [isMapOpen, setIsMapOpen] = useState(false);
  console.log("busData", busData);

  return (
    <div className="container mx-auto space-y-5 mb-10 h-[90vh]">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bus On Route:{slug}
        </h1>
        <p className="text-muted-foreground mt-1">
          View all available buses on route {slug}
        </p>
      </div>
      {/* {Loading && (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-8 h-8" />
          <span className="ml-2 text-muted-foreground">
            Loading all buses...
          </span>
        </div>
      )} */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {busData.map((data: Bus) => (
          <Card
            key={data?.busName}
            className="bg-white border-primary/20 overflow-hidden hover:border-primary transition-all duration-300"
          >
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
              <div className="flex items-start justify-between">
                <div className="px-4">
                  <CardTitle className="text-primary">
                    Bus Name : {data.busName}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-1 space-y-4">
              {/* Bus Status */}
              <div className="space-y-3 pb-4 border-b border-border">
                <p className="text-sm font-semibold text-foreground">
                  Bus Destination
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-secondary/30 text-foreground px-2 py-1 rounded">
                    {data.busDestination?.join(" → ")} .
                  </span>
                </div>
              </div>

              {/* GPS Location */}
              <div className="flex flex-wrap justify-between gap-6">
                <div className="space-y-3 pb-4 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Departure Time:
                  </p>
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <p className="text-xs font-bold text-black">
                      {data.busDepartureTime}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 pb-4 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Arrivel Time:
                  </p>
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <p className="text-xs font-bold text-black">
                      {data.busArrivalTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => setIsMapOpen(true)}
                >
                  <MapPin className="h-5 w-5" />
                  View Bus Location
                </Button>

                <DriverDetails id={data.busDriverId} />
              </div>
            </CardContent>
            <FullscreenMapModal
              ipAddress={data.busIpAddress}
              busId="001"
              busName="Express Route A"
              isOpen={isMapOpen}
              onClose={() => setIsMapOpen(false)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScheduleDetails;
