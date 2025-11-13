"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { API_BASE } from "@/lib/config";
import Logo from "../../../../public/GUBLogo.svg";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import Profile from "./profile";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import TextMarquee from "../text-marquee";

const menu = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Schedule",
    path: "/schedule",
  },
  {
    name: "Book Trip",
    path: "/booktrip",
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
  {
    name: "Notice",
    path: "/notice",
  },
];

interface BusSearchResult {
  id: string;
  busNumber: string;
  busName: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  busImage?: string;
  busRoute?: string;
  startingPoint?: string;
  rating?: number;
  busDestination: string[];
  busImg: string;
}

const announcementTexts = [
  "🚌 Book your tickets now! Special discounts available",
  "🌟 New routes added: Downtown Express & Airport Shuttle",
  "📱 Download our mobile app for exclusive offers",
  "🎫 Group bookings available with 20% discount",
  "⏰ Early bird special: Book 3 days in advance and save!",
  "🔒 Safe and comfortable travel guaranteed",
];

const TopNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allBuses, setAllBuses] = useState<BusSearchResult[]>([]);
  const [searchResults, setSearchResults] = useState<BusSearchResult[]>([]);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  console.log(user, isAuthenticated);

  // Fetch all buses when component mounts
  useEffect(() => {
    fetchAllBuses();
  }, []);

  // Fetch all buses function
  const fetchAllBuses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/bus/get-bus-info`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      console.log("All buses:", data.data);
      setAllBuses(data.data || []);
      setSearchResults(data.data || []); // Initialize search results with all buses
    } catch (error) {
      console.error("Fetch all buses error:", error);
      setSearchError("Failed to load buses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Open search dialog and show all buses
  const openSearchDialog = () => {
    console.log("Opening search dialog");
    setIsSearchDialogOpen(true);
    setSearchQuery("");
    setSearchError("");

    // If we have buses loaded, show them immediately
    if (allBuses.length > 0) {
      setSearchResults(allBuses);
    } else {
      // If no buses loaded yet, try to fetch them
      fetchAllBuses();
    }
  };

  // Handle desktop search - ALWAYS open modal
  const handleDesktopSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Desktop search triggered with query:", searchQuery);

    // Always open the modal first
    openSearchDialog();

    // If there's a search query, perform search after opening modal
    if (searchQuery.trim()) {
      setIsLoading(true);
      setSearchError("");

      try {
        // Server-side search
        const response = await fetch(
          `${API_BASE}/bus/search/${encodeURIComponent(searchQuery)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Search results:", data.data);
        setSearchResults(data.data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchError("Failed to search. Please try again.");
        // Fallback to client-side search
        performClientSideSearch();
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Client-side search function
  const performClientSideSearch = () => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      setSearchResults(allBuses);
      return;
    }

    const filtered = allBuses.filter((bus) => {
      // Check bus destinations
      const hasMatchingDestination = bus.busDestination?.some((dest) =>
        dest.toLowerCase().includes(query)
      );

      // Check bus name
      const hasMatchingName = bus.busName?.toLowerCase().includes(query);

      // Check bus number
      const hasMatchingNumber = bus.busNumber?.toLowerCase().includes(query);

      return hasMatchingDestination || hasMatchingName || hasMatchingNumber;
    });

    console.log("Client-side filtered results:", filtered);
    setSearchResults(filtered);

    if (filtered.length === 0) {
      setSearchError(`No buses found matching "${searchQuery}"`);
    }
  };

  const closeSearchDialog = () => {
    setIsSearchDialogOpen(false);
    setSearchQuery("");
    setSearchError("");
  };

  // Real-time filtering when search query changes and dialog is open
  useEffect(() => {
    if (isSearchDialogOpen && searchQuery.trim() === "") {
      // Show all buses when search is empty
      setSearchResults(allBuses);
      setSearchError("");
    } else if (isSearchDialogOpen && searchQuery.trim() !== "") {
      // Perform real-time client-side filtering
      performClientSideSearch();
    }
  }, [searchQuery, isSearchDialogOpen, allBuses]);

  // Function to check if a menu item is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav className="w-full flex bg-white justify-between items-center p-4 border-b-[1px] border-slate-500/20 z-50">
        <div className="flex gap-5 justify-center items-center">
          <div className="logo-container">
            <Image
              src={Logo}
              alt="logo"
              width={100}
              height={50}
              className="w-48 h-12 -ml-5 lg:ml-0"
              priority
            />
          </div>

          {/* Desktop search field - ALWAYS OPENS MODAL */}
          <form onSubmit={handleDesktopSearch} className="hidden lg:block">
            <InputGroup className="rounded-3xl pl-2">
              <InputGroupInput
                placeholder="Search by destination..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={openSearchDialog} // Also open modal when clicking on input
              />
              <InputGroupAddon></InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  className="absolute top-1.5 right-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  ) : (
                    <SearchIcon />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>
        <div className="w-[40vw] overflow-hidden">
          <TextMarquee texts={announcementTexts} />
        </div>

        <div className="flex items-center gap-3 text-xl">
          {/* Mobile search button */}
          <button onClick={openSearchDialog} className="lg:hidden">
            <SearchIcon
              strokeWidth="2px"
              className="stroke-accent-foreground"
            />
          </button>

          <ul className="gap-4 hidden font-sans lg:flex">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex justify-center items-center gap-1 text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-md ${
                  isActive(item.path)
                    ? "bg-accent text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </ul>

          {!isAuthenticated && (
            <Link href={`/auth/login`}>
              <button
                className="px-1 py-1.5 rounded-sm w-18 h-9
                bg-accent hover:bg-primary-foreground hover:text-black hover:border-2 hover:border-accent text-sm text-primary-foreground font-bold"
              >
                Log in
              </button>
            </Link>
          )}
          {isAuthenticated && <Profile />}
        </div>
      </nav>

      {/* Search Dialog */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Search Buses
              </DialogTitle>
            </DialogHeader>

            {/* Search Input */}
            <div className="mt-4">
              <div className="relative">
                <InputGroup className="rounded-xl">
                  <InputGroupInput
                    placeholder="Search by destination, bus name, or bus number..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pr-12"
                    autoFocus
                  />
                  <InputGroupAddon align="inline-end">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      ) : (
                        <SearchIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {searchError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-center">{searchError}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-3 text-gray-600">Loading buses...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">
                    {searchQuery ? (
                      <>
                        Found {searchResults.length} buses matching{" "}
                        <span className="font-semibold">"{searchQuery}"</span>
                      </>
                    ) : (
                      <>Showing all {searchResults.length} buses</>
                    )}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>

                {searchResults.map((bus: BusSearchResult) => (
                  <div
                    key={bus.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Bus Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={bus.busImg || "/default-bus.jpg"}
                            alt={bus.busName}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/default-bus.jpg";
                            }}
                          />
                        </div>
                      </div>

                      {/* Bus Details */}
                      <div className="flex-1 min-w-0">
                        {/* Bus Name and Rating */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {bus.busName || bus.busNumber}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Bus No: {bus.busNumber}
                            </p>
                          </div>
                        </div>

                        {/* Route */}
                        <div className="mb-3">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">
                              Destinations
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {bus.busDestination?.map(
                                (dest: string, i: number) => (
                                  <span
                                    key={i}
                                    className={`text-xs px-2 py-1 rounded ${
                                      searchQuery &&
                                      dest
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase())
                                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                                        : "bg-secondary/30 text-foreground"
                                    }`}
                                  >
                                    {dest}
                                  </span>
                                )
                              ) || (
                                <span className="text-xs text-gray-500">
                                  No destinations available
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/schedule/${bus.busRoute || bus.id}`}
                        onClick={() => setIsSearchDialogOpen(false)}
                      >
                        <Button className="w-full bg-accent text-white font-semibold py-2.5 rounded-lg">
                          View Schedule & Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <SearchIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery ? "No buses found" : "No buses available"}
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {searchQuery
                      ? `No buses found matching "${searchQuery}". Try a different destination or bus name.`
                      : "There are currently no buses available in the system."}
                  </p>
                  {searchQuery && (
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="mt-4"
                    >
                      Show All Buses
                    </Button>
                  )}
                </div>
              )
            )}
          </div>

          {/* Footer */}
          {searchResults.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {searchQuery
                    ? `Showing ${searchResults.length} matching results`
                    : `Showing all ${searchResults.length} buses`}
                </p>
                <Button
                  variant="outline"
                  onClick={closeSearchDialog}
                  className="border-gray-300 text-gray-700 hover:bg-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopNavbar;
