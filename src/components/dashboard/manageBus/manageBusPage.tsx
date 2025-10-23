"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import BusCards from "./busCards";
import ManageBusModel from "./manageBusModel";

const ManageBusesPage = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Buses</h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, or delete buses
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Add Bus
          </Button>
        </div>

        {/* all bus cards  */}
        <BusCards />
        {/* add bus form  */}
        <ManageBusModel setShowModal={setShowModal} showModal={showModal} />
      </div>
    </div>
  );
};

export default ManageBusesPage;
