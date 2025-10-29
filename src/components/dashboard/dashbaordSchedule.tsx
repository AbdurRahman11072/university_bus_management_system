"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/hooks/axiosInstance";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";

const DashboardSchdule = () => {
  const [Data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/bus/schedule");
      setdata(response.data.data); // Handle the data here
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="space-y-5 h-[80vh]">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bus Schedule</h1>
        <p className="text-muted-foreground mt-1">
          View routes and available buses
        </p>
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        Available Routes
      </h2>
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-8 h-8" />
          <span className="ml-2 text-muted-foreground">
            Loading all bus routes...
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Data?.map((route: any) => (
          <Card
            key={route.busRoute}
            className="cursor-pointer hover:shadow-lg transition-all border-primary/20 hover:border-primary/50 bg-white"
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Route Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      Route {route.busRoute}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {route.totalBus} bus
                      {route.totalBus !== 1 ? "es" : ""} available
                    </p>
                  </div>
                </div>

                {/* Destinations */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Destinations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {route.destinations.map((dest: string, i: number) => (
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
                      {route.departureTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Arrival</p>
                    <p className="font-semibold text-foreground">
                      {route.arrivalTime}
                    </p>
                  </div>
                </div>

                {/* Click to expand */}
                <div className="flex items-center justify-center text-primary text-sm font-medium">
                  <Link href={`/dashboard/schedule/${route.busRoute}`}>
                    View Buses
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardSchdule;
