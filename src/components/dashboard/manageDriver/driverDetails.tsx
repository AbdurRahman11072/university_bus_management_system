"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Driver {
  _id: string;
  username: string;
  phone_number: string;
  bloodGroup: string;
  driverLicence: string;
  licenceExpire: string;
  avatar_url?: string;
}

export default function DriverTable() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/user/get-all-driver"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch drivers");
        }

        const data = await response.json();
        setDrivers(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading drivers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Driver
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Phone Number
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Blood Group
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Driving Licence No
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Licence Expire
              </th>
              <th className="text-left py-4 px-6 font-semibold text-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr
                key={driver._id}
                className="border-b border-border hover:bg-muted/25 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={
                          driver.avatar_url ||
                          "https://imgs.search.brave.com/Va59nOCLxzhYrxei6EnmhDuO-h9fj3EkEt6W-ZXY0hg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cy4x/MjNyZi5jb20vNDUw/d20vam92YW5tYW5k/aWMvam92YW5tYW5k/aWMyMzA2L2pvdmFu/bWFuZGljMjMwNjAw/MDAzLzIwNjAzNjkw/OC1wcm9mZXNzaW9u/YWwtZHJpdmVyLWRy/aXZpbmctYS10cnVj/ay1vbi10aGUtcm9h/ZC5qcGc_dmVyPTY"
                        }
                        alt={`${driver.username}'s profile`}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {driver.username}
                      </p>
                      <p className="text-sm text-muted-foreground">Driver</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-foreground">{driver.phone_number}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {driver.bloodGroup}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <p className="text-foreground font-mono text-sm">
                    {driver.driverLicence}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-foreground">{driver.licenceExpire}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drivers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No drivers found</p>
        </div>
      )}
    </div>
  );
}
