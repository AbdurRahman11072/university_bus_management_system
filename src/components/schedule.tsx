'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "./ui/card";
import axiosInstance from "@/hooks/axiosInstance";
import { Spinner } from "./ui/spinner";
import { 
  Bus, 
  Clock, 
  MapPin, 
  Search,
  ArrowRight,
  Route as RouteIcon,
  Users
} from "lucide-react";
import { SectionHeader } from "./homeComponent/sectionHeader";

const Schedule = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    // Auto-focus input when page loads
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const filtered = data.filter(route => 
      route.busRoute?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destinations?.some((dest: string) => dest.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/bus/schedule");
      const result = response.data.data || [];
      setData(result);
      setFilteredData(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="container mx-auto px-4 pt-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            badge="Official Timetable"
            title="University Bus"
            accentTitle="Schedules"
            description="Access the most up-to-date information for all university bus lines and destination routes."
            align="left"
          />

          {/* Search & Stats Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:max-w-2xl"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search size={20} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search by route number or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 rounded-2xl border border-border bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all text-base font-medium shadow-sm"
                />
              </div>
            </motion.div>

            <div className="flex gap-4 shrink-0">
              <div className="px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                <RouteIcon className="text-primary" size={20} />
                <span className="font-bold text-slate-700">{data.length} Routes</span>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center gap-3">
                <Bus className="text-secondary-foreground" size={20} />
                <span className="font-bold text-slate-700">Active Fleet</span>
              </div>
            </div>
          </div>

          {/* Schedule Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Spinner className="w-10 h-10 text-primary" />
              <p className="mt-4 text-muted-foreground font-medium">Fetching live schedules...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredData.map((route, index) => (
                <motion.div
                  key={route.busRoute}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                <Card
                key={route.busRoute}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 bg-white rounded-xl overflow-hidden"
              >
                <CardContent className="p-5 bg-white">
                  <div className="space-y-4">
                    {/* Route Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {route.busRoute}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Route {route.busRoute}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>
                              {route.totalBus} bus
                              {route.totalBus !== 1 ? "es" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Destinations */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Destinations
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {route.destinations
                          ?.slice(0, 3)
                          .map((dest: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20"
                            >
                              {dest}
                            </span>
                          ))}
                        {route.destinations?.length > 3 && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                            +{route.destinations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Schedule Times */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Schedule
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Departure
                          </p>
                          <p className="font-semibold text-foreground text-sm">
                            {route.departureTime}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Arrival
                          </p>
                          <p className="font-semibold text-foreground text-sm">
                            {route.arrivalTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="pt-2 border-t border-border">
                      <Link
                        href={`/schedule/${route.busRoute}`}
                        className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                      >
                        View Bus Details
                        <Bus className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredData.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No matching routes</h3>
              <p className="text-muted-foreground">Try searching for a different destination or route number.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
