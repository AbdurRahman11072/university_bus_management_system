"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from "lucide-react";

interface SurveyData {
  _id?: string;
  username: string;
  department: string;
  semester: string;
  destination: string;
  classTime: string;
  submittedAt: string;
}

const SurveyTable = () => {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
  const [filteredData, setFilteredData] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    semester: "",
    department: "",
    classTime: "",
    search: "",
  });

  useEffect(() => {
    fetchSurveyData();
  }, []);

  useEffect(() => {
    filterData();
  }, [surveyData, filters]);

  const fetchSurveyData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/survey/get-all-Survey"
      );
      if (response.ok) {
        const data = await response.json();
        setSurveyData(data);
      } else {
        throw new Error("Failed to fetch survey data");
      }
    } catch (error) {
      console.error("Error fetching survey data:", error);
      alert("Error fetching survey data");
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = surveyData;

    if (filters.semester) {
      filtered = filtered.filter((item) =>
        item.semester.toLowerCase().includes(filters.semester.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter((item) =>
        item.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    if (filters.classTime) {
      filtered = filtered.filter((item) =>
        item.classTime.toLowerCase().includes(filters.classTime.toLowerCase())
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.username.toLowerCase().includes(searchLower) ||
          item.destination.toLowerCase().includes(searchLower) ||
          item.semester.toLowerCase().includes(searchLower) ||
          item.department.toLowerCase().includes(searchLower) ||
          item.classTime.toLowerCase().includes(searchLower)
      );
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      semester: "",
      department: "",
      classTime: "",
      search: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center my-10">
        Loading survey data...
      </div>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto my-10">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Survey Results</span>
          <Button onClick={fetchSurveyData} variant="outline" size="sm">
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all fields..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester-filter" className="text-sm">
                Semester
              </Label>
              <Input
                id="semester-filter"
                placeholder="Filter by semester"
                value={filters.semester}
                onChange={(e) => handleFilterChange("semester", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department-filter" className="text-sm">
                Department
              </Label>
              <Input
                id="department-filter"
                placeholder="Filter by department"
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-filter" className="text-sm">
                Class Time
              </Label>
              <Input
                id="time-filter"
                placeholder="Filter by time"
                value={filters.classTime}
                onChange={(e) =>
                  handleFilterChange("classTime", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm invisible">Clear</Label>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredData.length} of {surveyData.length} records
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Username</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Semester</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Class Time
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.length > 0 ? (
                  filteredData.map((survey, index) => (
                    <tr key={survey._id || index} className="hover:bg-muted/50">
                      <td className="px-4 py-3">{survey.username}</td>
                      <td className="px-4 py-3">{survey.department}</td>
                      <td className="px-4 py-3">{survey.semester}</td>
                      <td className="px-4 py-3">{survey.destination}</td>
                      <td className="px-4 py-3">{survey.classTime}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(survey.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No survey data found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyTable;
