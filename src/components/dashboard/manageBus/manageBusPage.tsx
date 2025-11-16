"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { API_BASE } from "@/lib/config";
import BusTable from "./busTable";
import { BusModal } from "./bus-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [routeFilter, setRouteFilter] = useState<string>("all");

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/bus/get-bus-info`);

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

  // Get unique routes for filter
  const uniqueRoutes = [...new Set(buses.map((bus) => bus.busRoute))];

  // Filter buses based on search term and filters
  const filteredBuses = buses.filter((bus) => {
    // Search term filter
    const matchesSearch =
      !searchTerm.trim() ||
      bus.busId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.busRoute.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.busDriverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.busDestination.some((dest) =>
        dest.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Status filter
    const matchesStatus =
      statusFilter === "all" || bus.busStatus === statusFilter;

    // Route filter
    const matchesRoute = routeFilter === "all" || bus.busRoute === routeFilter;

    return matchesSearch && matchesStatus && matchesRoute;
  });

  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch(`${API_BASE}/bus/delete-bus-info/${_id}`, {
        method: "DELETE",
      });

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
        `${API_BASE}/bus/update-bus-info/${updatedBus._id}`,
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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRouteFilter("all");
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Bus Management
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor your bus fleet
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 h-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bus
          </Button>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-border shadow-sm mb-6">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="On Time">On Time</option>
                    <option value="Late">Late</option>
                    <option value="In Jame">In Jame</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Route Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={routeFilter}
                    onChange={(e) => setRouteFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 text-sm"
                  >
                    <option value="all">All Routes</option>
                    {uniqueRoutes.map((route) => (
                      <option key={route} value={route}>
                        {route}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(searchTerm ||
                  statusFilter !== "all" ||
                  routeFilter !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              {/* Search Input */}
              <div className="w-full ">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search buses by ID, name, route, driver, destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Counter and Active Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {filteredBuses.length} of {buses.length} buses
              </div>

              {/* Active Filters Display */}
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                    Search: "{searchTerm}"
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
                    Status: {statusFilter}
                  </span>
                )}
                {routeFilter !== "all" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                    Route: {routeFilter}
                  </span>
                )}
              </div>
            </div>

            {/* Search Tips */}
            {searchTerm && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Search tips:</strong> Search by bus ID, bus name,
                  route, driver ID, or destination
                </p>
              </div>
            )}
          </div>
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
          <BusTable
            buses={filteredBuses}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}

        <BusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </main>
  );
}
