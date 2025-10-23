import React from "react";
import { Button } from "./ui/button";
import { MapPin, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const buses = [
  {
    id: "BUS-001",
    number: "BUS-003",
    capacity: 50,
    currentPassengers: 45,
    driver: {
      name: "David Lee",
      phone: "+91 98765 43212",
      rating: 4.7,
      experience: "4 years",
    },
    lastUpdate: "3 mins ago",
    gpsLocation: { lat: 28.706, lng: 77.104 },
  },
  {
    id: "BUS-002",
    number: "BUS-003",
    capacity: 50,
    currentPassengers: 45,
    driver: {
      name: "David Lee",
      phone: "+91 98765 43212",
      rating: 4.7,
      experience: "4 years",
    },
    lastUpdate: "3 mins ago",
    gpsLocation: { lat: 28.706, lng: 77.104 },
  },
  {
    id: "BUS-003",
    number: "BUS-003",
    capacity: 50,
    currentPassengers: 45,
    driver: {
      name: "David Lee",
      phone: "+91 98765 43212",
      rating: 4.7,
      experience: "4 years",
    },
    lastUpdate: "3 mins ago",
    gpsLocation: { lat: 28.706, lng: 77.104 },
  },
];

const ScheduleDetails = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {buses.map((bus) => (
        <Card
          key={bus.id}
          className="bg-white border-primary/20 overflow-hidden hover:border-primary transition-all duration-300"
        >
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
            <div className="flex items-start justify-between">
              <div className="px-4">
                <CardTitle className="text-primary">{bus.number}</CardTitle>
                <CardDescription>
                  {bus.currentPassengers}/{bus.capacity} passengers
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Update</p>
                <p className="text-sm font-semibold text-foreground">
                  {bus.lastUpdate}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-1 space-y-4">
            {/* Bus Status */}
            <div className="space-y-3 pb-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">
                Bus Status
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="font-semibold text-foreground">
                    {bus.capacity} seats
                  </p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Available</p>
                  <p className="font-semibold text-accent">
                    {bus.capacity - bus.currentPassengers} seats
                  </p>
                </div>
              </div>
            </div>

            {/* GPS Location */}
            <div className="space-y-3 pb-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">
                GPS Location
              </p>
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">Coordinates</p>
                <p className="font-mono text-sm text-foreground">
                  {bus.gpsLocation.lat.toFixed(4)},{" "}
                  {bus.gpsLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <MapPin className="w-4 h-4 mr-2" />
                Track Live
              </Button>
              <Button variant="outline" className="bg-transparent">
                <Phone className="w-4 h-4 mr-2" />
                Contact Driver
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleDetails;
