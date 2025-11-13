"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import axiosInstance from "@/hooks/axiosInstance";
import { Spinner } from "./ui/spinner";
import { Bus, Clock, MapPin, Route, Users } from "lucide-react";

const Schedule = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/bus/schedule");
      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] space-y-6 p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Bus Schedule
              </h1>
              <p className="text-muted-foreground mt-1">
                View routes and available buses
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Route className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-sm font-medium text-foreground">
              {data.length} Routes
            </p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <Users className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-sm font-medium text-foreground">
              {data.reduce(
                (total: number, route: any) => total + (route.totalBus || 0),
                0
              )}{" "}
              Buses
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-8 h-8" />
          <span className="ml-2 text-muted-foreground">
            Loading all bus routes...
          </span>
        </div>
      )}

      {/* Routes Grid */}
      {!isLoading && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Available Routes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data?.map((route: any) => (
              <Card
                key={route.busRoute}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 bg-white"
              >
                <CardContent className="p-5 bg-white">
                  <div className="space-y-4">
                    {/* Route Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {route.busRoute}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Route {route.busRoute}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>
                              {route.totalBus} bus
                              {route.totalBus !== 1 ? "es" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Destinations */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Destinations
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {route.destinations
                          ?.slice(0, 3)
                          .map((dest: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20"
                            >
                              {dest}
                            </span>
                          ))}
                        {route.destinations?.length > 3 && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                            +{route.destinations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Schedule Times */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Schedule
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Departure
                          </p>
                          <p className="font-semibold text-foreground text-sm">
                            {route.departureTime}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Arrival
                          </p>
                          <p className="font-semibold text-foreground text-sm">
                            {route.arrivalTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="pt-2 border-t border-border">
                      <Link
                        href={`/schedule/${route.busRoute}`}
                        className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                      >
                        View Bus Details
                        <Bus className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {data?.length === 0 && !isLoading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Routes Available
                </h3>
                <p className="text-muted-foreground">
                  There are currently no bus routes scheduled. Please check back
                  later.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
