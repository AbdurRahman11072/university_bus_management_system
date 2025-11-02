"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  X,
  Plus,
  ChevronDown,
  Bus,
  Clock,
  MapPin,
  User,
  Route,
  Wifi,
  IdCard,
  Hash,
  Calendar,
} from "lucide-react";
import { ImageUpload } from "../image-upload";
import { BusData } from "./busTable";
import axios from "axios";
import { toast } from "sonner";

interface Driver {
  _id: string;
  username: string;
}

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
  const [destinations, setDestinations] = useState<string[]>(
    bus.busDestination || []
  );
  const [destinationInput, setDestinationInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDriverDropdownOpen, setIsDriverDropdownOpen] = useState(false);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Initialize form data when bus changes
  useEffect(() => {
    if (bus) {
      setFormData(bus);
      setDestinations(bus.busDestination || []);
      setDestinationInput("");
    }
  }, [bus]);

  // Fetch drivers when modal opens
  useEffect(() => {
    if (open) {
      fetchDrivers();
      // Find and set the selected driver
      if (bus.busDriverId && drivers.length > 0) {
        const driver = drivers.find((d) => d._id === bus.busDriverId);
        if (driver) {
          setSelectedDriver(driver);
        }
      }
    }
  }, [open, bus.busDriverId, drivers]);

  const fetchDrivers = async () => {
    setIsLoadingDrivers(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/user/get-all-driver"
      );
      setDrivers(response.data.data);

      // Set selected driver if bus has a driver ID
      if (bus.busDriverId) {
        const driver = response.data.data.find(
          (d: Driver) => d._id === bus.busDriverId
        );
        if (driver) {
          setSelectedDriver(driver);
        }
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
      setDrivers([]);
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onOpenChange(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData((prev) => ({
      ...prev,
      busDriverId: driver._id,
    }));
    setIsDriverDropdownOpen(false);
  };

  const addDestination = () => {
    if (
      destinationInput.trim() &&
      !destinations.includes(destinationInput.trim())
    ) {
      const newDestinations = [...destinations, destinationInput.trim()];
      setDestinations(newDestinations);
      setFormData((prev) => ({
        ...prev,
        busDestination: newDestinations,
      }));
      setDestinationInput("");
    }
  };

  const removeDestination = (index: number) => {
    const newDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(newDestinations);
    setFormData((prev) => ({
      ...prev,
      busDestination: newDestinations,
    }));
  };

  const handleImageChange = async (value: string) => {
    try {
      if (value.startsWith("data:image")) {
        // If it's a base64 image, upload it first
        const formData = new FormData();
        formData.append("image", value.split(",")[1]);

        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=c96a27f51a67e29bd7e8fbbdf52e996b",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          setFormData((prev) => ({
            ...prev,
            busImg: response.data.data.display_url,
          }));
          return response.data.data.url;
        }
      } else {
        // If it's already a URL, just set it
        setFormData((prev) => ({
          ...prev,
          busImg: value,
        }));
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Image upload failed", {
        description: error.response?.data?.error?.message || "Please try again",
      });
      throw error;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      onSave(formData);
      toast("Success", {
        description: "Bus information has been updated",
      });
      handleClose();
    } catch (error) {
      console.error("Error updating bus:", error);
      toast.error("Failed to update bus information");
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (!open && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 ${
          isClosing ? "fade-out" : "fade-in"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-4xl bg-white z-50 shadow-2xl ${
          isClosing ? "slide-out-right" : "slide-in-right"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary/90 px-8 py-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Edit Bus Information</h2>
              <p className="text-white/80 text-sm mt-1">
                Update bus details, schedule, and network information
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-lg w-10 h-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto px-8 pb-8 space-y-6 mt-6">
          {/* Image Upload Section */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <Label className="text-lg font-semibold text-slate-900 flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              Bus Image & Identity
            </Label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <ImageUpload
                  value={formData.busImg}
                  onChange={handleImageChange}
                />
                <p className="text-sm text-slate-600">
                  Upload a clear image of the bus. Recommended size: 500x300px
                </p>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="busName"
                    className="text-sm font-medium flex items-center gap-2 text-slate-700"
                  >
                    <IdCard className="w-4 h-4 text-primary" />
                    Bus Name
                  </Label>
                  <Input
                    id="busName"
                    name="busName"
                    value={formData.busName}
                    onChange={handleInputChange}
                    placeholder="e.g., City Express 101"
                    className="focus:ring-2 focus:ring-primary h-12 border-slate-300 text-slate-900"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="busId"
                    className="text-sm font-medium flex items-center gap-2 text-slate-700"
                  >
                    <Hash className="w-4 h-4 text-primary" />
                    Bus ID
                  </Label>
                  <Input
                    id="busId"
                    name="busId"
                    value={formData.busId}
                    onChange={handleInputChange}
                    placeholder="Enter unique bus ID"
                    className="focus:ring-2 focus:ring-primary h-12 border-slate-300 text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column - Route & Schedule */}
            <div className="space-y-8">
              {/* Route Information */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <Label className="text-lg font-semibold text-slate-900 flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Route className="w-5 h-5 text-white" />
                  </div>
                  Route Information
                </Label>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="busRoute"
                      className="text-sm font-medium text-slate-700"
                    >
                      Route Number
                    </Label>
                    <Input
                      id="busRoute"
                      name="busRoute"
                      value={formData.busRoute}
                      onChange={handleInputChange}
                      placeholder="e.g., RT-101"
                      className="focus:ring-2 focus:ring-green-500 h-12 border-slate-300"
                    />
                  </div>

                  {/* Destinations */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Destinations
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={destinationInput}
                        onChange={(e) => setDestinationInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addDestination();
                          }
                        }}
                        placeholder="Enter destination name"
                        className="flex-1 focus:ring-2 focus:ring-green-500 h-12 border-slate-300"
                      />
                      <Button
                        type="button"
                        onClick={addDestination}
                        variant="outline"
                        size="icon"
                        className="shrink-0 h-12 w-12 border-green-200 hover:bg-green-50 hover:border-green-300"
                      >
                        <Plus className="w-5 h-5 text-green-600" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-12">
                      {destinations.map((destination, index) => (
                        <div
                          key={index}
                          className="bg-green-50 text-green-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium border border-green-200"
                        >
                          <MapPin className="w-3 h-3" />
                          {destination}
                          <button
                            type="button"
                            onClick={() => removeDestination(index)}
                            className="hover:text-green-900 transition-colors ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <Label className="text-lg font-semibold text-slate-900 flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Schedule Information
                </Label>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="busDepartureTime"
                        className="text-sm font-medium text-slate-700"
                      >
                        First Departure
                      </Label>
                      <Input
                        id="busDepartureTime"
                        name="busDepartureTime"
                        type="time"
                        value={formData.busDepartureTime}
                        onChange={handleInputChange}
                        className="focus:ring-2 focus:ring-purple-500 h-12 border-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="busArrivalTime"
                        className="text-sm font-medium text-slate-700"
                      >
                        First Arrival
                      </Label>
                      <Input
                        id="busArrivalTime"
                        name="busArrivalTime"
                        type="time"
                        value={formData.busArrivalTime}
                        onChange={handleInputChange}
                        className="focus:ring-2 focus:ring-purple-500 h-12 border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="busDepartureTime2"
                        className="text-sm font-medium text-slate-700"
                      >
                        Second Departure
                      </Label>
                      <Input
                        id="busDepartureTime2"
                        name="busDepartureTime2"
                        type="time"
                        value={formData.busDepartureTime2}
                        onChange={handleInputChange}
                        className="focus:ring-2 focus:ring-purple-500 h-12 border-slate-300"
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="busArrivalTime2"
                        className="text-sm font-medium text-slate-700"
                      >
                        Second Arrival
                      </Label>
                      <Input
                        id="busArrivalTime2"
                        name="busArrivalTime2"
                        type="time"
                        value={formData.busArrivalTime2}
                        onChange={handleInputChange}
                        className="focus:ring-2 focus:ring-purple-500 h-12 border-slate-300"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Driver & Network */}
            <div className="space-y-8">
              {/* Driver Selection */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <Label className="text-lg font-semibold text-slate-900 flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Driver Assignment
                </Label>
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-slate-700">
                    Select Driver
                  </Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsDriverDropdownOpen(!isDriverDropdownOpen)
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white h-12"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-500" />
                        <span
                          className={
                            selectedDriver
                              ? "text-slate-900 font-medium"
                              : "text-slate-500"
                          }
                        >
                          {selectedDriver
                            ? selectedDriver.username
                            : "Select a driver"}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isDriverDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDriverDropdownOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-slate-300 rounded-lg shadow-xl max-h-60 overflow-auto">
                        {isLoadingDrivers ? (
                          <div className="px-4 py-3 text-sm text-slate-500 flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            Loading drivers...
                          </div>
                        ) : drivers.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-slate-500">
                            No drivers available
                          </div>
                        ) : (
                          drivers.map((driver: any) => (
                            <button
                              key={driver._id}
                              type="button"
                              onClick={() => handleDriverSelect(driver)}
                              className="w-full px-4 py-3 text-left hover:bg-orange-50 text-sm font-medium flex items-center gap-3 border-b border-slate-200 last:border-b-0"
                            >
                              <User className="w-4 h-4 text-slate-500" />
                              {driver.username}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {selectedDriver && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Driver Selected:</span>{" "}
                      {selectedDriver.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Network Information */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <Label className="text-lg font-semibold text-slate-900 flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-white" />
                  </div>
                  Network Information
                </Label>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="busIpAddress"
                      className="text-sm font-medium text-slate-700"
                    >
                      Bus IP Address
                    </Label>
                    <Input
                      id="busIpAddress"
                      name="busIpAddress"
                      value={formData.busIpAddress || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., 192.168.1.100"
                      className="focus:ring-2 focus:ring-red-500 h-12 border-slate-300 font-mono"
                    />
                    <p className="text-xs text-slate-600">
                      Enter the static IP address assigned to the bus for
                      tracking and communication
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <Label className="text-lg font-semibold text-slate-900 flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Bus Status
                </Label>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">
                      Current Status
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {["On Time", "Late", "In Jame", "Maintenance"].map(
                        (status) => (
                          <Button
                            key={status}
                            type="button"
                            variant={
                              formData.busStatus === status
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                busStatus: status as any,
                              }))
                            }
                            className={`flex-1 min-w-[120px] ${
                              formData.busStatus === status
                                ? "bg-primary text-primary-foreground"
                                : "border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {status}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-200 sticky bottom-0 bg-white pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-14 text-base font-medium border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading || !selectedDriver}
              className="flex-1 h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium text-base disabled:opacity-50 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating Bus Details...
                </div>
              ) : (
                "Update Bus Details"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
