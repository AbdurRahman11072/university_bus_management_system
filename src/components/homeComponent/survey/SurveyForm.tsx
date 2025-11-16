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
  MapPin,
  GraduationCap,
  ArrowRight,
  RefreshCw,
  Calendar,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { SurveyData } from "./surveyMain";
import { API_BASE } from "@/lib/config";

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

interface ClassSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const semesters = ["Fall", "Spring", "Summer"];

const SurveyForm: React.FC<SurveyFormProps> = ({
  formData,
  setFormData,
  user,
  onNextStep,
}) => {
  const [busRoutes, setBusRoutes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);

  // Fetch bus routes from API
  const fetchBusRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching bus routes from API...");
      const response = await fetch(`${API_BASE}/bus/get-bus-info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

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

  // Update form data when class schedules change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      classSchedules: classSchedules,
    }));
  }, [classSchedules, setFormData]);

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

  // Add new class schedule
  const addClassSchedule = () => {
    const newSchedule: ClassSchedule = {
      id: Date.now().toString(),
      day: "",
      startTime: "",
      endTime: "",
    };
    setClassSchedules((prev) => [...prev, newSchedule]);
  };

  // Remove class schedule
  const removeClassSchedule = (id: string) => {
    setClassSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
  };

  // Update class schedule
  const updateClassSchedule = (
    id: string,
    field: keyof ClassSchedule,
    value: string
  ) => {
    setClassSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const validateSurveyForm = (): boolean => {
    const requiredFields = ["userSemester", "destination"];

    const hasValidClassSchedules =
      classSchedules.length > 0 &&
      classSchedules.every(
        (schedule) => schedule.day && schedule.startTime && schedule.endTime
      );

    return (
      requiredFields.every((field) => formData[field as keyof SurveyData]) &&
      hasValidClassSchedules
    );
  };

  // Retry function
  const handleRetry = () => {
    fetchBusRoutes();
  };

  // Get available days (days not already selected in other schedules)
  const getAvailableDays = (currentScheduleId: string) => {
    const selectedDays = classSchedules
      .filter((schedule) => schedule.id !== currentScheduleId)
      .map((schedule) => schedule.day);

    return daysOfWeek.filter((day) => !selectedDays.includes(day));
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
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
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

      {/* Class Schedules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            Class Schedule
          </Label>
          <Button
            type="button"
            onClick={addClassSchedule}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Class
          </Button>
        </div>

        {classSchedules.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              No class schedules added yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Click "Add Class" to add your class schedule
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {classSchedules.map((schedule, index) => {
              const availableDays = getAvailableDays(schedule.id);
              const hasAvailableDays = availableDays.length > 0 || schedule.day;

              return (
                <div
                  key={schedule.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Class {index + 1}</h4>
                    {classSchedules.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeClassSchedule(schedule.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Day Selection */}
                    <div className="space-y-2">
                      <Label htmlFor={`day-${schedule.id}`} className="text-xs">
                        Day
                      </Label>
                      <Select
                        value={schedule.day}
                        onValueChange={(value) =>
                          updateClassSchedule(schedule.id, "day", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {hasAvailableDays ? (
                            daysOfWeek.map((day) => (
                              <SelectItem
                                key={day}
                                value={day}
                                disabled={
                                  !availableDays.includes(day) &&
                                  day !== schedule.day
                                }
                              >
                                {day}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-days" disabled>
                              All days selected
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Start Time */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`startTime-${schedule.id}`}
                        className="text-xs"
                      >
                        Start Time
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="time"
                          id={`startTime-${schedule.id}`}
                          value={schedule.startTime}
                          onChange={(e) =>
                            updateClassSchedule(
                              schedule.id,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* End Time */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`endTime-${schedule.id}`}
                        className="text-xs"
                      >
                        End Time
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="time"
                          id={`endTime-${schedule.id}`}
                          value={schedule.endTime}
                          onChange={(e) =>
                            updateClassSchedule(
                              schedule.id,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {classSchedules.length > 0 && (
          <div className="text-xs text-gray-500">
            💡 Tip: Add all your classes for the week to get the best bus
            schedule recommendations
          </div>
        )}
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
