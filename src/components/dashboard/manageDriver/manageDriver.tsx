"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { DriverModal } from "./driverModal";
import DriverCards from "./driverDetails";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const ManageDrivers = () => {
  const { user } = useAuth();
  const router = useRouter();
  if (user?.roles != "Admin") {
    router.push("/auth/login");
  }
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Manage Drivers
            </h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, or delete drivers
            </p>
          </div>
        </div>

        <DriverCards />

        {/* show model  */}
      </div>
    </div>
  );
};

export default ManageDrivers;
