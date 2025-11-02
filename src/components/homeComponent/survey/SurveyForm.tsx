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
import { Clock, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import React from "react";
import { SurveyData } from "./surveyMain";

interface SurveyFormProps {
  formData: SurveyData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyData>>;
  user: any;
  onNextStep: () => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({
  formData,
  setFormData,
  user,
  onNextStep,
}) => {
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

      {/* Destination */}
      <div className="space-y-3">
        <Label
          htmlFor="destination"
          className="text-sm font-semibold flex items-center gap-2"
        >
          <MapPin className="h-4 w-4 text-green-600" />
          Preferred Bus Route
        </Label>
        <Input
          type="text"
          required
          name="destination"
          id="destination"
          value={formData.destination}
          onChange={handleInputChange}
          placeholder="Enter your preferred destination.. (ecg. Route 1)"
          className="w-full"
        />
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
