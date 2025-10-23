"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

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
    label: "Bus Number",
    name: "busNumber",
    type: "text",
    placeholder: "e.g., BUS-001",
  },
  {
    label: "Route",
    name: "route",
    type: "text",
    placeholder: "e.g., Route 5A",
  },
  {
    label: "Capacity (Seats)",
    name: "capacity",
    type: "number",
    placeholder: "e.g., 45",
  },
  {
    label: "Driver Name",
    name: "driver",
    type: "text",
    placeholder: "e.g., John Doe",
  },
  {
    label: "License Plate",
    name: "licensePlate",
    type: "text",
    placeholder: "e.g., ABC-1234",
  },
  {
    label: "Bus Model",
    name: "model",
    type: "text",
    placeholder: "e.g., Volvo B7R",
  },
  {
    label: "Year",
    name: "year",
    type: "number",
    placeholder: "e.g., 2023",
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

  const handleSave = () => {
    // You can replace this with your API or form submission logic
    console.log("Bus saved:", formData);
    setShowModal(false);
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
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-hidden">
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Maintenance</option>
                  </select>
                </div>
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
