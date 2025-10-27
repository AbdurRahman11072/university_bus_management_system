"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Driver {
  id: string;
  name: string;
  phone: string;
  bloodGroup: string;
  drivingLicenceNo: string;
  licenceExpire: string;
  profileImage?: string;
}

export default function DriverCards() {
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
        setDrivers(data.data); // Adjust based on your API response structure
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  console.log(drivers);

  if (loading) {
    return <div className="text-center py-4">Loading drivers...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {drivers.map((driver: any) => (
        <div
          key={driver._id}
          className="bg-white rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-20 h-20 rounded-full mx-auto mb-4">
            <Image
              src={
                driver.avatar_url ||
                "https://imgs.search.brave.com/Va59nOCLxzhYrxei6EnmhDuO-h9fj3EkEt6W-ZXY0hg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cy4x/MjNyZi5jb20vNDUw/d20vam92YW5tYW5k/aWMvam92YW5tYW5k/aWMyMzA2L2pvdmFu/bWFuZGljMjMwNjAw/MDAzLzIwNjAzNjkw/OC1wcm9mZXNzaW9u/YWwtZHJpdmVyLWRy/aXZpbmctYS10cnVj/ay1vbi10aGUtcm9h/ZC5qcGc_dmVyPTY"
              }
              alt={`${driver.username}'s profile`}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-full"
            />
          </div>

          <div className="space-y-3 pb-4 border-b border-border">
            <p className="text-sm font-semibold text-foreground">
              Driver Name:
            </p>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-xs font-bold text-black">{driver.username}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-2 mt-4">
            <div className="space-y-3 ">
              <p className="text-sm font-semibold text-foreground">
                Phone Number:
              </p>
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <p className="text-xs font-bold text-black text-center">
                  {driver.phone_number}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Blood Group:
              </p>
              <div className=" bg-primary/5 p-3 rounded-lg border border-primary/20">
                <p className="text-xs font-bold text-black text-center">
                  {driver.bloodGroup}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-4 mt-4">
            <div className="space-y-3 w-full">
              <p className="text-sm font-semibold text-foreground">
                Driving Licence No:
              </p>
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <p className="text-xs font-bold text-black">
                  {driver.driverLicence}
                </p>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <p className="text-sm font-semibold text-foreground">
                Licence Expire:
              </p>
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                <p className="text-xs font-bold text-black">
                  {driver.licenceExpire}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
