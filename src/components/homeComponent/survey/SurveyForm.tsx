import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Clock,
  MapPin,
  GraduationCap,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { SurveyData } from "./surveyMain";

interface SurveyFormProps {
  formData: SurveyData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyData>>;
  user: any;
  onNextStep: () => void;
}

interface BusInfo {
  _id: string;
  busId: string;
  busName: string;
  busRoute: string;
  busImg: string;
  busDestination: string[];
  busDriverId: string;
  busDepartureTime: string;
  busArrivalTime: string;
  busDepartureTime2: string;
  busArrivalTime2: string;
  busIpAddress: string;
  busStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  status: string;
  message: string;
  data: BusInfo[];
}

const SurveyForm: React.FC<SurveyFormProps> = ({
  formData,
  setFormData,
  user,
  onNextStep,
}) => {
  const [busRoutes, setBusRoutes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bus routes from API
  const fetchBusRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching bus routes from API...");
      const response = await fetch(
        "http://localhost:5000/api/v1/bus/get-bus-info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      console.log("Received API response:", apiResponse);

      if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
        throw new Error("Invalid data format: expected data array");
      }

      // Extract unique bus routes from the data array
      const routes = apiResponse.data
        .map((bus) => bus.busRoute)
        .filter((route) => route != null && route.toString().trim() !== "")
        .map((route) => route.toString());

      const uniqueRoutes = Array.from(new Set(routes)).sort((a, b) => {
        // Sort routes numerically if they're numbers, otherwise alphabetically
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });

      console.log("Extracted unique routes:", uniqueRoutes);
      setBusRoutes(uniqueRoutes);

      if (uniqueRoutes.length === 0) {
        setError("No bus routes found in the system.");
      }
    } catch (err) {
      console.error("Error fetching bus routes:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to load bus routes: ${errorMessage}`);
      setBusRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusRoutes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateSurveyForm = (): boolean => {
    const requiredFields = [
      "userSemester",
      "destination",
      "classTime",
      "classEndTime",
    ];
    return requiredFields.every((field) => formData[field as keyof SurveyData]);
  };

  // Retry function
  const handleRetry = () => {
    fetchBusRoutes();
  };

  return (
    <form className="space-y-6">
      {/* Semester */}
      <div className="space-y-3">
        <Label
          htmlFor="userSemester"
          className="text-sm font-semibold flex items-center gap-2"
        >
          <GraduationCap className="h-4 w-4 text-primary" />
          Current Semester
        </Label>
        <Select
          value={formData.userSemester}
          onValueChange={(value) => handleSelectChange("userSemester", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your semester" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
              <SelectItem key={semester} value={`Semester ${semester}`}>
                Semester {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Destination - Updated to use Select with bus routes */}
      <div className="space-y-3">
        <Label
          htmlFor="destination"
          className="text-sm font-semibold flex items-center gap-2"
        >
          <MapPin className="h-4 w-4 text-green-600" />
          Preferred Bus Route
        </Label>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading bus routes...
          </div>
        ) : error ? (
          <div className="space-y-2">
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
            <Button
              type="button"
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : (
          <Select
            value={formData.destination}
            onValueChange={(value) => handleSelectChange("destination", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your preferred bus route" />
            </SelectTrigger>
            <SelectContent>
              {busRoutes.length > 0 ? (
                busRoutes.map((route) => (
                  <SelectItem key={route} value={route}>
                    Route {route}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-routes" disabled>
                  No bus routes available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Class Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label
            htmlFor="classTime"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <Clock className="h-4 w-4 text-purple-600" />
            Class Start Time
          </Label>
          <Input
            type="time"
            required
            name="classTime"
            id="classTime"
            value={formData.classTime}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="classEndTime"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <Clock className="h-4 w-4 text-purple-600" />
            Class End Time
          </Label>
          <Input
            type="time"
            required
            name="classEndTime"
            id="classEndTime"
            value={formData.classEndTime}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
      </div>

      {/* Bus Preference */}
      {user?.roles === "Teacher" && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <span className="text-orange-600">🚌</span>
            Bus Type Preference
          </Label>
          <RadioGroup
            value={formData.acBus}
            onValueChange={(value) => handleSelectChange("acBus", value)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AC" id="ac" />
              <Label htmlFor="ac" className="cursor-pointer font-normal">
                AC Bus
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Non-AC" id="non-ac" />
              <Label htmlFor="non-ac" className="cursor-pointer font-normal">
                Non-AC Bus
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Next Button */}
      <Button
        type="button"
        onClick={onNextStep}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={!validateSurveyForm()}
        size="lg"
      >
        Continue to Payment
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};

export default SurveyForm;
