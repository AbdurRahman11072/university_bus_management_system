"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface ManageBusModelProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface BusFormData {
  busNumber: string;
  route: string;
  capacity: number | string;
  driver: string;
  licensePlate: string;
  model: string;
  year: number | string;
  status: string;
}

const formField = [
  {
    label: "Bus ID",
    name: "busId",
    type: "text",
    placeholder: "e.g., BUS001",
  },
  {
    label: "Bus Route",
    name: "busRoute",
    type: "text",
    placeholder: "e.g., Route 1",
  },
  {
    label: "Bus Destination",
    name: "busDestination",
    type: "text",
    placeholder: "e.g., New Route, Second Route",
  },
  {
    label: "Driver ID",
    name: "busDriverId",
    type: "text",
    placeholder: "e.g., DRV2024010",
  },
  {
    label: "Departure Time",
    name: "busDepartureTime",
    type: "time",
    placeholder: "e.g., 12:00",
  },
  {
    label: "Arrival Time",
    name: "busArrivalTime",
    type: "time",
    placeholder: "e.g., 12:45",
  },
  {
    label: "Second Departure Time",
    name: "busDepartureTime2",
    type: "time",
    placeholder: "e.g., 13:00",
  },
  {
    label: "Second Arrival Time",
    name: "busArrivalTime2",
    type: "time",
    placeholder: "e.g., 13:50",
  },
  {
    label: "Bus Status",
    name: "busStatus",
    type: "select",
    placeholder: "Select status",
    options: ["On Time", "Delayed", "Cancelled", "Arrived", "Departed"],
  },
];

const ManageBusModel: React.FC<ManageBusModelProps> = ({
  setShowModal,
  showModal,
}) => {
  const [formData, setFormData] = useState<BusFormData>({
    busNumber: "",
    route: "",
    capacity: "",
    driver: "",
    licensePlate: "",
    model: "",
    year: "",
    status: "Active",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const baseUrl = process.env.baseUrl;
      console.log(formData);

      // const response = await axios.post(
      //   `${baseUrl}/bus/post-bus-info`,
      //   formData
      // );
      // console.log("Bus saved successfully:", response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving bus:", error);
    }
  };

  return (
    <div>
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setShowModal(false)}
          />

          {/* Sliding Modal */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-scroll">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Add New Bus
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {formField.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Save Bus
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="flex-1 bg-transparent border-border hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBusModel;
