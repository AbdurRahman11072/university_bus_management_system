"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_BASE } from "@/lib/config";

interface DriverFormData {
  driverName: string;
  phoneNumber: string;
  bloodGroup: string;
  drivingLicenceNo: string;
  licenceExpire: string;
  driverImg?: string;
}

export function DriverModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<DriverFormData>({
    defaultValues: {
      driverName: "",
      phoneNumber: "",
      bloodGroup: "",
      drivingLicenceNo: "",
      licenceExpire: "",
    },
  });

  const onSubmit = async (data: DriverFormData) => {
    setIsLoading(true);
    try {
      console.log("Form submitted:", data);

      // Add API call here
      const response = await axios.post(`${API_BASE}/driver/post-driver-info`, {
        ...data,
        driverImg: "/driver-profile.png", // or handle image upload separately
      });

      console.log("API Response:", response.data);

      // Reset form and close modal on success
      if (response.status === 200 || response.status === 201) {
        reset();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
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
          Add Driver
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl bg-white overflow-y-auto max-h-[90vh]">
        {/* Profile Image Section */}
        <div className="bg-white pt-6 pb-4 flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src="/driver-profile.png"
              alt="Driver profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
          {/* Driver Name */}
          <div>
            <Label
              htmlFor="driverName"
              className="text-sm font-semibold text-gray-900 mb-2 block"
            >
              Driver Name:
            </Label>
            <Input
              id="driverName"
              {...register("driverName", {
                required: "Driver name is required",
              })}
              className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter driver name"
            />
          </div>

          {/* Phone Number and Blood Group */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Phone Number:
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: "Invalid phone number format",
                  },
                })}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label
                htmlFor="bloodGroup"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Blood Group:
              </Label>
              <Input
                id="bloodGroup"
                {...register("bloodGroup", {
                  required: "Blood group is required",
                })}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="e.g., A+"
              />
            </div>
          </div>

          {/* Driving Licence No and Licence Expire */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="drivingLicenceNo"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Driving Licence No:
              </Label>
              <Input
                id="drivingLicenceNo"
                {...register("drivingLicenceNo", {
                  required: "Driving licence number is required",
                })}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Licence number"
              />
            </div>
            <div>
              <Label
                htmlFor="licenceExpire"
                className="text-sm font-semibold text-gray-900 mb-2 block"
              >
                Licence Expire:
              </Label>
              <Input
                id="licenceExpire"
                type="date"
                {...register("licenceExpire", {
                  required: "Licence expiry date is required",
                })}
                className="bg-green-50 border border-green-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white mt-6 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Driver Details"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
