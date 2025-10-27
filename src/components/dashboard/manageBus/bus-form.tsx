"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Plus, ChevronDown } from "lucide-react";
import { ImageUpload } from "../image-upload";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BusFormData {
  busImg: string;
  busName: string;
  busId: string;
  busRoute: string;
  busDestination: string[];
  busDriverId: string;
  busDepartureTime: string;
  busArrivalTime: string;
  busDepartureTime2: string;
  busArrivalTime2: string;
}

interface Driver {
  _id: string;
  username: string;

  // Add other driver properties as needed
}

export function BusModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [busImage, setBusImage] = useState<string>("");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [destinationInput, setDestinationInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDriverDropdownOpen, setIsDriverDropdownOpen] = useState(false);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, reset, watch } =
    useForm<BusFormData>({
      defaultValues: {
        busImg: "",
        busName: "",
        busId: "",
        busRoute: "",
        busDestination: [],
        busDriverId: "",
        busDepartureTime: "",
        busArrivalTime: "",
        busDepartureTime2: "",
        busArrivalTime2: "",
      },
    });
  console.log("Select", selectedDriver);

  // Fetch drivers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDrivers();
    }
  }, [isOpen]);

  const fetchDrivers = async () => {
    setIsLoadingDrivers(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/user/get-all-driver"
      );
      console.log("driver:", response.data.data);

      setDrivers(response.data.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
      setDrivers([]);
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  console.log("Driver:", drivers);

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setValue("busDriverId", driver._id);
    setIsDriverDropdownOpen(false);
  };

  const addDestination = () => {
    if (
      destinationInput.trim() &&
      !destinations.includes(destinationInput.trim())
    ) {
      const newDestinations = [...destinations, destinationInput.trim()];
      setDestinations(newDestinations);
      setValue("busDestination", newDestinations);
      setDestinationInput("");
    }
  };

  const removeDestination = (index: number) => {
    const newDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(newDestinations);
    setValue("busDestination", newDestinations);
  };

  const handleImageChange = async (value: string) => {
    console.log("Image value:", value);

    try {
      const formData = new FormData();

      if (value.startsWith("data:image")) {
        formData.append("image", value.split(",")[1]);
      } else if (value) {
        formData.append("image", value);
      } else {
        formData.append("image", value);
      }

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
        setBusImage(response.data.data.display_url);
        return response.data.data.url;
      } else {
        throw new Error(response.data.error?.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Image upload failed", {
        description: error.response?.data?.error?.message || "Please try again",
      });
      throw error;
    }
  };

  const onSubmit = async (data: BusFormData) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        busImg:
          busImage ||
          "https://imgs.search.brave.com/SxyJvYvh6t6kTyNc38ZK2li8QCCwh0vPvsyM5Nj8wtI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vZnJvbnQv/aW1nL2xhbmRpbmdz/L2hvbWVwYWdlLzY5/NDk4NTQyLmpwZw",
        busDestination: destinations,
      };

      console.log("Submitting data:", formData);

      const response = await axios.post(
        "http://localhost:5000/api/v1/bus/post-bus-info",
        formData
      );

      toast("Success", {
        description: "New Bus Information Has Been Added",
      });

      if (response.status === 200) {
        router.refresh();
        router.back();
      }

      console.log("Response:", response.data);

      // Reset form and close modal on success
      if (response.status === 200 || response.status === 201) {
        reset();
        setBusImage("");
        setDestinations([]);
        setSelectedDriver(null);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error posting data:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
        toast.error("Failed to add bus", {
          description: error.response?.data?.message || "Please try again",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          Add Bus
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 pt-5 overflow-hidden rounded-2xl bg-white overflow-y-auto max-h-[90vh]">
        <DialogHeader className="px-6">Add Buses</DialogHeader>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
          {/* Image Upload */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-2 block">
              Bus Image:
            </Label>
            <ImageUpload value={busImage} onChange={handleImageChange} />
          </div>

          {/* Bus Name */}
          <div>
            <Label
              htmlFor="busName"
              className="text-sm font-semibold text-gray-900 mb-2 block"
            >
              Bus Name:
            </Label>
            <Input
              id="busName"
              {...register("busName", { required: true })}
              className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Bus ID and Route */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="busId"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Bus ID:
              </Label>
              <Input
                id="busId"
                {...register("busId", { required: true })}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <Label
                htmlFor="busRoute"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Bus Route:
              </Label>
              <Input
                id="busRoute"
                {...register("busRoute", { required: true })}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Driver Selection */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-2 block">
              Bus Driver:
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDriverDropdownOpen(!isDriverDropdownOpen)}
                className="w-full bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 rounded-md px-3 py-2 text-left flex items-center justify-between"
              >
                <span>
                  {selectedDriver
                    ? selectedDriver?.username
                    : "Select a driver"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDriverDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-green-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {isLoadingDrivers ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Loading drivers...
                    </div>
                  ) : drivers.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No drivers available
                    </div>
                  ) : (
                    drivers.map((driver: any) => (
                      <button
                        key={driver._id}
                        type="button"
                        onClick={() => handleDriverSelect(driver)}
                        className="w-full px-3 py-2 text-left hover:bg-green-50 text-sm font-medium"
                      >
                        {driver?.username}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <input
              type="hidden"
              {...register("busDriverId", { required: true })}
            />
            {selectedDriver && (
              <p className="text-xs text-green-600 mt-1">
                Selected: {selectedDriver.username}
              </p>
            )}
          </div>

          {/* Destinations */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-2 block">
              Destinations:
            </Label>
            <div className="flex gap-2 mb-3">
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
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <Button
                type="button"
                onClick={addDestination}
                className="bg-green-600 hover:bg-green-700 text-white px-4"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {destinations.map((destination, index) => (
                <div
                  key={index}
                  className="bg-green-100 border border-green-300 text-green-900 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium"
                >
                  {destination}
                  <button
                    type="button"
                    onClick={() => removeDestination(index)}
                    className="hover:text-green-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Departure & Arrival Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="busDepartureTime"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Departure Time:
              </Label>
              <Input
                id="busDepartureTime"
                type="time"
                {...register("busDepartureTime", { required: true })}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <Label
                htmlFor="busArrivalTime"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Arrival Time:
              </Label>
              <Input
                id="busArrivalTime"
                type="time"
                {...register("busArrivalTime", { required: true })}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Second Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="busDepartureTime2"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Second Departure:
              </Label>
              <Input
                id="busDepartureTime2"
                type="time"
                {...register("busDepartureTime2")}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <Label
                htmlFor="busArrivalTime2"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Second Arrival:
              </Label>
              <Input
                id="busArrivalTime2"
                type="time"
                {...register("busArrivalTime2")}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !selectedDriver}
            className="w-full bg-green-600 hover:bg-green-700 text-white mt-6 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Bus Details"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
