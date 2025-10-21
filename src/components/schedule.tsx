import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "./ui/card";

interface ScheduleCards {
  route: number;
  buses: number;
  destination: string[];
  departure: string;
  arrivel: string;
  status: "On time" | "Late" | "In jame";
}
const SchduleData = [
  {
    route: 1,
    buses: 3,
    destination: ["Central Station", "Maple Avenue"],
    departure: "08:00 AM",
    arrivel: "08:45 AM",
    status: "On time",
  },
  {
    route: 2,
    buses: 3,
    destination: ["Downtown Plaza", "Riverfront Park", "Hillside Mall"],
    departure: "09:15 AM",
    arrivel: "10:30 AM",
    status: "Late",
  },
  {
    route: 3,
    buses: 3,
    destination: [
      "North Terminal",
      "Business District",
      "Central Station",
      "Airport Zone",
    ],
    departure: "11:00 AM",
    arrivel: "12:45 PM",
    status: "In jame",
  },
  {
    route: 4,
    buses: 3,
    destination: ["Eastgate", "Westview"],
    departure: "01:20 PM",
    arrivel: "02:10 PM",
    status: "On time",
  },
  {
    route: 5,
    buses: 3,
    destination: ["Central Station", "University Campus", "Research Park"],
    departure: "03:30 PM",
    arrivel: "04:25 PM",
    status: "Late",
  },
  {
    route: 6,
    buses: 3,
    destination: [
      "South Station",
      "Shopping Mall",
      "Entertainment District",
      "Waterfront",
      "South Station",
      "Shopping Mall",
      "Entertainment District",
      "Waterfront",
    ],
    departure: "05:45 PM",
    arrivel: "07:15 PM",
    status: "In jame",
  },
];

const Schdule = () => {
  const getStatusColor = (status: string) => {
    if (status === "On time") return "bg-accent/20 text-accent";
    if (status === "Late") return "bg-destructive/20 text-destructive";
    return "bg-secondary/20 text-secondary";
  };
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bus Schedule</h1>
        <p className="text-muted-foreground mt-1">
          View routes and available buses
        </p>
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        Available Routes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SchduleData.map((route) => (
          <Card
            key={route.route}
            className="cursor-pointer hover:shadow-lg transition-all border-primary/20 hover:border-primary/50 bg-white"
          >
            <Link href={`/schedule/${route.route}`}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Route Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-primary">
                        Route {route.route}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {route.buses} bus
                        {route.buses !== 1 ? "es" : ""} available
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                        route.status
                      )}`}
                    >
                      {route.status}
                    </span>
                  </div>

                  {/* Destinations */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Destinations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {route.destination.map((dest, i) => (
                        <span
                          key={i}
                          className="text-xs bg-secondary/30 text-foreground px-2 py-1 rounded"
                        >
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Departure</p>
                      <p className="font-semibold text-foreground">
                        {route.departure}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Arrival</p>
                      <p className="font-semibold text-foreground">
                        {route.arrivel}
                      </p>
                    </div>
                  </div>

                  {/* Click to expand */}
                  <div className="flex items-center justify-center text-primary text-sm font-medium">
                    View Buses
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schdule;
