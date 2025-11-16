"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { API_BASE } from "@/lib/config";
import DriverTable from "./driverTable";

interface Driver {
  _id: string;
  uId: number;
  username: string;
  email: string;
  phone_number: string;
  bloodGroup: string;
  driverLicence: string;
  licenceExpire: string;
  avatar_url?: string;
  roles: string;
}

export default function ManageDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/user/get-all-driver`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Drivers API Response:", data);
      setDrivers(data.data || data);
    } catch (err) {
      let errorMessage = "Failed to fetch drivers";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("[v0] Error fetching drivers:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Driver Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all drivers in the system
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-8 h-8" />
            <span className="ml-2 text-muted-foreground">
              Loading drivers...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">{error}</p>
            <button
              onClick={fetchDrivers}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && <DriverTable drivers={drivers} />}
      </div>
    </main>
  );
}
