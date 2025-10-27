"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import axiosInstance from "@/hooks/axiosInstance";
import { formatDistanceToNow } from "date-fns";

export function MaintenancePage() {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axiosInstance.get(
        `maintenance/total-maintenance-info`
      );
      setMaintenance(result.data.data);
      console.log(result.data.data);
    } catch (error) {
      console.error("Error fetching maintenance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format the date to relative time
  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Maintenance Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Track bus repairs and maintenance
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Loading maintenance data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {maintenance.map((bus: any) => (
              <Card key={bus.busId} className="bg-white">
                <CardContent className="pt-6 space-y-3 ">
                  <p className="font-semibold text-foreground">{bus.busId}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Repairs (Month)
                      </span>
                      <span className="font-semibold text-foreground">
                        {bus.totalBusCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last Service
                      </span>
                      <span
                        className="font-semibold text-foreground"
                        title={new Date(
                          bus.lastCreatedData.createdAt
                        ).toLocaleString()}
                      >
                        {formatTimeAgo(bus.lastCreatedData.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-semibold text-primary">Good</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
