"use client";

import type React from "react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusData } from "./busTable";

interface EditBusDialogProps {
  bus: BusData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bus: BusData) => void;
}

export default function EditBusDialog({
  bus,
  open,
  onOpenChange,
  onSave,
}: EditBusDialogProps) {
  const [formData, setFormData] = useState<BusData>(bus);
  const [imagePreview, setImagePreview] = useState<string>(bus.busImg);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const destinations = e.target.value.split(",").map((d) => d.trim());
    setFormData((prev) => ({
      ...prev,
      busDestination: destinations,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      busStatus: value as BusData["busStatus"],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          busImg: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Bus Information</DialogTitle>
          <DialogDescription>
            Update the bus details below and click save to confirm changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Bus Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-3">
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Bus preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="busName">Bus Name</Label>
            <Input
              id="busName"
              name="busName"
              value={formData.busName}
              onChange={handleInputChange}
              placeholder="Enter bus name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="busRoute">Route</Label>
            <Input
              id="busRoute"
              name="busRoute"
              value={formData.busRoute}
              onChange={handleInputChange}
              placeholder="Enter route"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="busDestination">
              Destinations (comma-separated)
            </Label>
            <Input
              id="busDestination"
              value={formData.busDestination.join(", ")}
              onChange={handleDestinationChange}
              placeholder="e.g., City Center, Airport"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="busDriverId">Driver ID</Label>
            <Input
              id="busDriverId"
              name="busDriverId"
              value={formData.busDriverId}
              onChange={handleInputChange}
              placeholder="Enter driver ID"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="busDepartureTime">Departure Time 1</Label>
              <Input
                id="busDepartureTime"
                name="busDepartureTime"
                value={formData.busDepartureTime}
                onChange={handleInputChange}
                placeholder="e.g., 08:00 AM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="busArrivalTime">Arrival Time 1</Label>
              <Input
                id="busArrivalTime"
                name="busArrivalTime"
                value={formData.busArrivalTime}
                onChange={handleInputChange}
                placeholder="e.g., 10:30 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="busDepartureTime2">Departure Time 2</Label>
              <Input
                id="busDepartureTime2"
                name="busDepartureTime2"
                value={formData.busDepartureTime2}
                onChange={handleInputChange}
                placeholder="e.g., 02:00 PM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="busArrivalTime2">Arrival Time 2</Label>
              <Input
                id="busArrivalTime2"
                name="busArrivalTime2"
                value={formData.busArrivalTime2}
                onChange={handleInputChange}
                placeholder="e.g., 04:30 PM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="busStatus">Status</Label>
            <Select
              value={formData.busStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="busStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On Time">On Time</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="In Jame">In Jame</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
