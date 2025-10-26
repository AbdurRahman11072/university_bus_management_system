"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import BusTable from "./busTable";
import { BusModal } from "./bus-form";

// Update your BusData type to include _id
export interface BusData {
  _id: string; // Add this line
  busId: string;
  busName: string;
  busRoute: string;
  busImg: string;
  busDestination: string[];
  busDriverId: string;
  busDepartureTime: string;
  busArrivalTime: string;
  busDepartureTime2: string;
  busArrivalTime2: string;
  busStatus: "On Time" | "Late" | "In Jame" | "Maintenance";
}

interface ApiResponse {
  data: BusData[];
  success?: boolean;
  message?: string;
}

export default function ManageBusPage() {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "http://localhost:5000/api/v1/bus/get-bus-info"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch buses");
      }

      const result: ApiResponse = await response.json();
      console.log("API Response:", result); // Debug log

      // Handle different possible response structures
      if (Array.isArray(result.data)) {
        setBuses(result.data);
      } else if (Array.isArray(result)) {
        setBuses(result);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("[v0] Error fetching buses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/bus/delete-bus-info/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete bus");
      }

      setBuses((prevBuses) => prevBuses.filter((bus) => bus._id !== _id));
    } catch (err) {
      console.error("[v0] Error deleting bus:", err);
      alert("Failed to delete bus");
    }
  };

  const handleEdit = async (updatedBus: BusData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/bus/update-bus-info/${updatedBus._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBus),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bus");
      }

      setBuses((prevBuses) =>
        prevBuses.map((bus) => (bus._id === updatedBus._id ? updatedBus : bus))
      );
    } catch (err) {
      console.error("[v0] Error updating bus:", err);
      alert("Failed to update bus");
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Bus Management
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor your bus fleet
            </p>
          </div>
          <BusModal />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-8 h-8" />
            <span className="ml-2 text-muted-foreground">Loading buses...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">Error: {error}</p>
            <button
              onClick={fetchBuses}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <BusTable buses={buses} onDelete={handleDelete} onEdit={handleEdit} />
        )}
      </div>
    </main>
  );
}
