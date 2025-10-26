"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { DriverModal } from "./driverModal";

const ManageDrivers = () => {
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
        <DriverModal/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["John Smith", "Mike Johnson", "David Lee"].map((driver) => (
            <Card key={driver}>
              <CardContent className="pt-6">
                <p className="font-semibold text-foreground">{driver}</p>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* show model  */}
      </div>
    </div>
  );
};

export default ManageDrivers;
